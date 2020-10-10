import React from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../forms/ActivityForm';
import { IActivity } from './../../../app/models/activity';
import ActivityList from './ActivityList';

interface IProps {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  activity: IActivity | null;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void
}

const ActivityDashboard: React.FC<IProps> = ({ activities, selectActivity, activity, editMode, setEditMode}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList activities={activities} selectActivity={selectActivity}/>
      </Grid.Column>
      <Grid.Column width={6}>
        {activity && !editMode && <ActivityDetails activity={activity} setEditMode={setEditMode}/>}   
        {editMode && <ActivityForm />}
      </Grid.Column>
    </Grid>
  );
};

export default ActivityDashboard;
