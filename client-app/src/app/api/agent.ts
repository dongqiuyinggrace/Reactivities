import axios, { AxiosResponse } from 'axios';
import { IActivity } from './../models/activity';
import { history } from './../../index';
import { toast } from 'react-toastify';
import { IUser, IUserFormValues } from './../models/user';
import { IPhoto, IProfile } from '../models/profile';
import { IEditProfile } from './../models/profile';

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('jwt');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(undefined, (error) => {
  if (error.message === 'Network Error' && !error.response) {
    toast.error('Network Error - make sure API is running');
  }
  const { config, data, status } = error.response;

  if (error.response.status === 404) {
    history.push('/notfound');
  }

  if (
    status === 400 &&
    config.method === 'get' &&
    data.errors.hasOwnProperty('id')
  ) {
    history.push('/notfound');
  }

  if (status === 500) {
    toast.error('server error - check the terminal for more info');
  }

  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );

const requests = {
  get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(sleep(1000)).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(1000)).then(responseBody),
  del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody),
  postForm: (url: string, file: Blob) => {
    let formData = new FormData();
    formData.append('File', file);
    return axios.post(url, formData, {
      headers: {'Content-type': 'multipart/form-data'}
    }).then(responseBody)
  }
};

const Activities = {
  list: (): Promise<IActivity[]> => requests.get('/activities'),
  details: (id: string): Promise<IActivity> =>
    requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post('/activities/', activity),
  update: (activity: IActivity) =>
    requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del(`/activities/${id}`),
  attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
  unattend: (id: string) => requests.del(`/activities/${id}/unattend`),
};

const User = {
  current: (): Promise<IUser> => requests.get('/user'),
  login: (user: IUserFormValues): Promise<IUser> =>
    requests.post('/user/login', user),
  register: (user: IUserFormValues): Promise<IUser> =>
    requests.post('/user/register', user),
};

const Profiles = {
  get: (userName: string): Promise<IProfile> => requests.get(`/profiles/${userName}`),
  uploadPhoto: (photo: Blob): Promise<IPhoto> => requests.postForm('/photos', photo),
  setMainPhoto: (id: string) => requests.post(`/photos/${id}/setmain`, {}),
  deletePhoto: (id: string) => requests.del(`/photos/${id}`),
  editProfile: (profile: IEditProfile) => requests.put('profiles', profile)
}

export default {
  Activities,
  User,
  Profiles
};
