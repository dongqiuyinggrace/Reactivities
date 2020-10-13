import { action, computed, observable } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import agent from '../api/agent';
import { IActivity } from './../models/activity';

class ActivityStore {
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitting = false;
  @observable target = '';

  @computed get activitiesByDate() {
    return this.activities.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      activities.forEach((activity) => {
        activity.date = activity.date.split('.')[0];
        this.activities.push(activity);
      });
      this.loadingInitial = false;
    } catch (error) {
      console.log(error);
      this.loadingInitial = false;
    }
  };

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activities.find((a) => a.id === id);
    this.editMode = false;
  };

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      this.activities.push(activity);
      this.selectedActivity = activity;
      this.editMode = false;
      this.submitting = false;
    } catch(error) {
      console.log(error);
      this.submitting = false;
    }
  };

  @action editActivity = (activity: IActivity) => {
    this.submitting = true;
    agent.Activities.update(activity)
      .then(() => {
        this.activities = [
          ...this.activities.filter((a) => a.id !== activity.id),
          activity,
        ];
        this.selectedActivity = activity;
        this.editMode = false;
      })
      .then(() => {
        this.submitting = false;
      });
  };

  @action deleteActivity = (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.target = event.currentTarget.name;
    this.submitting = true;
    agent.Activities.delete(id)
      .then(() => {
        this.activities = [
          ...this.activities.filter((activity) => activity.id !== id),
        ];
      })
      .then(() => {
        this.submitting = false;
      });
  };

  @action setEditMode = (mode: boolean) => {
    this.editMode = mode;
  };
}

export default createContext(new ActivityStore());
