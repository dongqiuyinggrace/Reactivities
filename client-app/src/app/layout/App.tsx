import React, { useState, useEffect, SyntheticEvent, useContext, Fragment } from 'react';
import { IActivity } from './../models/activity';
import NavBar from '../../features/nav/NavBar';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import ActivityStore from '../stores/activityStore';
import { observer } from 'mobx-react-lite';

const App = () => {
  const activityStore = useContext(ActivityStore);

  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);

  const handleSelectedActivity = (id: string) => {
    activityStore.selectActivity(id);
  }


  const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement> ,id: string) => {
    activityStore.deleteActivity(event, id);
  }

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <LoadingComponent inverted={true} content="Loading Activities"/>
  
  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard 
          activities={activityStore.activities}
          setSelectedActivity={setSelectedActivity}
        />
      </Container>
    </Fragment>
  );
};

export default observer(App);
