import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useContext } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../forms/ActivityForm';
import { IActivity } from './../../../app/models/activity';
import ActivityList from './ActivityList';
import ActivityStore from '../../../app/stores/activityStore';

interface IProps {
  activities: IActivity[];
  setSelectedActivity: (activity: IActivity | null) => void;
}

const ActivityDashboard: React.FC<IProps> = ({activities, setSelectedActivity}) => {

  const activityStore = useContext(ActivityStore);
  const {editMode, selectedActivity, createActivity} = activityStore;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList activities={activities}/>
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedActivity 
          && !editMode 
          && <ActivityDetails 
              activity={selectedActivity} 
              setSelectedActivity={setSelectedActivity}
              />
        }   
        {editMode 
          && <ActivityForm key={selectedActivity? selectedActivity.id : 0} 
                createActivity={createActivity} />}
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
