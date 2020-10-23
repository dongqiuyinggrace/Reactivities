import { IActivity, IAttendee } from './../../models/activity';
import { IUser } from './../../models/user';

export const CombineDateAndTime = (date: Date, time: Date) => {
  const timeString = time.getHours() + ':' + time.getMinutes() + ':00';

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateString = `${year}-${month}-${day}`;
  return new Date(dateString + ' ' + timeString);
};

export const setActivityProperties = (activity: IActivity, user: IUser) => {
  activity.date = new Date(activity.date);
  activity.isGoing = activity.attendees.some(
    (a) => a.userName === user.userName
  );
  activity.isHost = activity.attendees.some(
    (a) => a.userName === user.userName && a.isHost
  );
  return activity;
};

export const createAttendee = (user: IUser): IAttendee => {
  return {
    displayName: user.displayName,
    userName: user.userName,
    image: user.image!,
    isHost: false,
  };
};
