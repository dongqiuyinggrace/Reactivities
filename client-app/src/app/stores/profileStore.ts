import { action, computed, observable, runInAction, reaction } from 'mobx';
import agent from '../api/agent';
import {
  IPhoto,
  IProfile,
  IEditProfile,
  IUserActivity,
} from './../models/profile';
import { RootStore } from './rootStore';
import { toast } from 'react-toastify';

export default class ProfileStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.activeTab,
      (activeTab) => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? 'followers' : 'following';
          this.loadFollowings(predicate);
        } else {
          this.followings = [];
        }
      }
    );
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = false;
  @observable uploadingPhoto = false;
  @observable loading = false;
  @observable editting = false;
  @observable followings: IProfile[] = [];
  @observable activeTab: number = 0;
  @observable userActivities: IUserActivity[] = [];
  @observable loadingActivities = false;

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.userName === this.profile.userName;
    } else {
      return false;
    }
  }

  @action setActiveTab = (activeIndex: number) => {
    this.activeTab = activeIndex;
  };

  @action loadProfile = async (userName: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(userName);
      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingProfile = false;
      });
      console.log(error);
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profiles.uploadPhoto(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
        this.uploadingPhoto = false;
      });
    } catch (error) {
      console.log(error);
      toast.error('Error uploading photo');
      runInAction(() => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      runInAction(() => {
        if (this.profile && this.rootStore.userStore.user) {
          this.profile.photos.find((x) => x.isMain)!.isMain = false;
          this.profile.photos.find((x) => x.id === photo.id)!.isMain = true;
          this.profile.image = photo.url;
          this.rootStore.userStore.user.image = photo.url;
        }
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      toast.error('Error setting main photo');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos = this.profile.photos.filter(
            (p) => p.id !== photo.id
          );
        }
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      toast.error('Error deleting photo');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action editProfile = async (profile: IEditProfile) => {
    this.editting = true;
    try {
      await agent.Profiles.editProfile(profile);
      runInAction(() => {
        if (
          profile.displayName !== this.rootStore.userStore.user?.displayName
        ) {
          this.rootStore.userStore.user!.displayName = profile.displayName!;
        }
        if (this.profile) {
          this.profile = { ...this.profile, ...profile };
        }
        this.editting = false;
      });
    } catch (error) {
      console.log(error);
      toast.error('Error editting profile');
      runInAction(() => {
        this.editting = false;
      });
    }
  };

  @action follow = async (userName: string) => {
    this.loading = true;
    try {
      await agent.Profiles.follow(userName);
      runInAction(() => {
        this.profile!.following = true;
        this.profile!.followersCount++;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      toast.error('Problem following user');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action unfollow = async (userName: string) => {
    this.loading = true;
    try {
      await agent.Profiles.unfollow(userName);
      runInAction(() => {
        this.profile!.following = false;
        this.profile!.followersCount--;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      toast.error('Problem unfollowing user');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action loadFollowings = async (predicate: string) => {
    this.loading = true;
    try {
      const profiles = await agent.Profiles.listFollowings(
        this.profile!.userName,
        predicate
      );
      runInAction(() => {
        this.followings = profiles;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      toast.error('Problem loading followings');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action loadUserActivities = async (userName: string, predicate?: string) => {
    this.loadingActivities = true;
    try {
      const userActivities = await agent.Profiles.listActivities(
        userName,
        predicate
      );
      runInAction(() => {
        this.userActivities = userActivities;
        this.loadingActivities = false;
      });
    } catch (error) {
      console.log(error);
      toast.error('Problem loading userActivities');
      runInAction(() => {
        this.loadingActivities = false;
      });
    }
  };
}
