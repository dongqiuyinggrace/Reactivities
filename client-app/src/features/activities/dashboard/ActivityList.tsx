import React, { SyntheticEvent, useContext } from 'react';
import { Item, Segment } from 'semantic-ui-react';
import { IActivity } from './../../../app/models/activity';
import ActivityItem from './ActivityItem';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';

interface IProps {
  activities: IActivity[];
}

const ActivityList: React.FC<IProps> = ({activities}) => {
  const activityStore = useContext(ActivityStore);
  const {activitiesByDate} = activityStore;
  return (
    <Segment clearing>
      <Item.Group divided>
        {activitiesByDate.map(activity => <ActivityItem key={activity.id} activity={activity} />)}
      </Item.Group>
    </Segment>
  );
};

export default observer(ActivityList);
