import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IActivity } from './../models/activity';
import NavBar from '../../features/nav/NavBar';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState(false);

   const handleSelectedActivity = (id: string) => {
     setSelectedActivity(activities.filter(a => a.id === id)[0]);
   }

  useEffect(() => {
    axios
      .get<IActivity[]>('http://localhost:5000/api/activities')
      .then((response) => {
        setActivities(response.data);
      });
  }, []);

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard 
          activities={activities} 
          selectActivity={handleSelectedActivity} 
          activity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
        />
      </Container>
    </>
  );
};

export default App;