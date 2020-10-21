import { action, computed, observable, runInAction } from 'mobx';
import agent from '../api/agent';
import { IUser, IUserFormValues } from './../models/user';
import { RootStore } from './rootStore';
import { history } from './../../index';
import { toast } from 'react-toastify';

class UserStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable user: IUser | null = null;

  @computed get isLoggedIn() {
    return !!this.user;
  }

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.login(values);
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push('/activities');
    } catch (error) {
      throw error;
    }
  };

  @action register = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.register(values);
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      toast.success('successfully register user');
      history.push('/activities');
    } catch (error) {
      throw error;
    }
  };

  @action logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push('/');
  };

  @action getCurrentUser = async () => {
    try {
      const user = await agent.User.current();
      runInAction('get CurrentUser', () => {
        this.user = user;
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export default UserStore;
