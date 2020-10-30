import {
  action,
  computed,
  observable,
  configure,
  runInAction,
  reaction,
} from 'mobx';
import { SyntheticEvent } from 'react';
import agent from '../api/agent';
import { IActivity } from './../models/activity';
import { history } from './../../index';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { setActivityProperties } from '../common/util/util';
import { createAttendee } from './../common/util/util';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';

configure({ enforceActions: 'always' });

const LIMIT = 2;

class ActivityStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 0;
        this.activityRegistry.clear();
        this.loadActivities();
      }
    );
  }

  @observable activityRegistry = new Map();
  @observable activities: IActivity[] = [];
  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = '';
  @observable hostName = '';
  @observable loading = false;
  @observable.ref hubConnection: HubConnection | null = null;
  @observable activityCount = 0;
  @observable page = 0;
  @observable predicate = new Map();

  @computed get totalPage() {
    return Math.ceil(this.activityCount / LIMIT);
  }

  @computed get axiosParams() {
    const params = new URLSearchParams();
    params.append('limit', String(LIMIT));
    params.append('offset', `${this.page ? this.page * LIMIT : 0}`);
    this.predicate.forEach((value, key) => {
      if (key === 'startDate') {
        params.append('startDate', value.toISOString());
      } else {
        params.append(key, value);
      }
    });
    return params;
  }

  @action setPredicate = (predicate: string, value: string | Date) => {
    this.predicate.clear();
    if (predicate !== 'all') {
      this.predicate.set(predicate, value);
    }
  };

  @action setPage = (page: number) => {
    this.page = page;
  };

  @action createHubConnection = (id: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5000/chat', {
        accessTokenFactory: () => this.rootStore.commonStore.token!,
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log(this.hubConnection?.state))
      .then(() => {
        console.log('Attempting to join the group');
        this.hubConnection?.invoke('AddToGroup', id);
      })
      .catch((error) => console.log('Error establishing connection', error));

    this.hubConnection.on('ReceiveComment', (comment) => {
      runInAction(() => {
        this.activity!.comments.push(comment);
      });
    });

    this.hubConnection.on('Send', (message) => {
      toast.info(message);
    });
  };

  @action stopHubConnection = () => {
    this.hubConnection
      ?.invoke('RemoveFromGroup', this.activity!.id)
      .then(() => {
        this.hubConnection?.stop();
      })
      .then(() => console.log('Connection stopped'))
      .catch((err) => console.log(err));
  };

  @action addComment = async (values: any) => {
    values.activityId = this.activity?.id;
    try {
      await this.hubConnection?.invoke('SendComment', values);
    } catch (error) {
      console.log(error);
    }
  };

  @computed get activitiesByDate() {
    return this.groupActivities(Array.from(this.activityRegistry.values()));
  }

  groupActivities = (activities: IActivity[]) => {
    const sortedActivities = activities.sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split('T')[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );

    //return Object.entries(sortedActivities);
  };

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activityEnvelop = await agent.Activities.list(this.axiosParams);
      const { activities, activityCount } = activityEnvelop;
      runInAction('load activities', () => {
        activities.forEach((activity) => {
          setActivityProperties(activity, this.rootStore.userStore.user!);
          this.activityRegistry.set(activity.id, activity);
        });
        this.activityCount = activityCount;
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction('load activities error', () => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction('load activity', () => {
          setActivityProperties(activity, this.rootStore.userStore.user!);
          this.activity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });
        return activity;
      } catch (error) {
        runInAction('load activity error', () => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action selectActivity = (id: string) => {
    this.activity = this.activityRegistry.get(id);
  };

  @action openCreateForm = () => {
    this.activity = null;
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      const attendee = createAttendee(this.rootStore.userStore.user!);
      attendee.isHost = true;
      const attendees = [];
      activity.comments = [];
      attendees.push(attendee);
      activity.attendees = attendees;
      activity.isHost = true;
      runInAction('create activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction('load activity error', () => {
        this.submitting = false;
      });
      toast.error('Problem submitting data');
      console.log(error.response);
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction('edit activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction('edit activity error', () => {
        this.submitting = false;
      });
      toast.error('Problem submitting data');
      console.log(error.response);
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.target = event.currentTarget.name;
    this.submitting = true;
    try {
      await agent.Activities.delete(id);
      runInAction('delete activity', () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = '';
      });
    } catch (error) {
      runInAction('delete activity error', () => {
        this.submitting = false;
        this.target = '';
      });
      console.log(error);
    }
  };

  @action cancelSelectedActivity = () => {
    this.activity = null;
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  @action attendActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.attend(id);
      runInAction(() => {
        let attendee = createAttendee(this.rootStore.userStore.user!);
        if (this.activity) {
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
        }
        this.loading = false;
      });
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  };

  @action unattendActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.unattend(id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(
            (a) => a.userName !== this.rootStore.userStore.user?.userName
          );
          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.id, this.activity);
        }
        this.loading = false;
      });
      history.push(`/activities/${id}`);
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  };
}

export default ActivityStore;
