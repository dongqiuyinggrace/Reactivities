import { action, computed, observable, runInAction } from 'mobx';
import agent from '../api/agent';
import { IPhoto, IProfile, IEditProfile } from './../models/profile';
import { RootStore } from './rootStore';
import { toast } from 'react-toastify';

export default class ProfileStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = false;
  @observable uploadingPhoto = false;
  @observable loading = false;
  @observable editting = false;

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.userName === this.profile.userName;
    } else {
      return false;
    }
  }

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
        if (profile.displayName !== this.rootStore.userStore.user?.displayName) {
            this.rootStore.userStore.user!.displayName = profile.displayName!;
        }
        if (this.profile) {
            this.profile = {...this.profile, ...profile};
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
}
