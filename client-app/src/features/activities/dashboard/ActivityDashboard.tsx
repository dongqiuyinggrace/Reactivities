import React from 'react';
import { Grid, List } from 'semantic-ui-react';
import { IActivity } from './../../../app/models/activity';
import ActivityList from './ActivityList';

interface IProps {
  activities: IActivity[];
}

const ActivityDashboard: React.FC<IProps> = ({ activities }) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width={6}>Sidebar</Grid.Column>
    </Grid>
  );
};

export default ActivityDashboard;
