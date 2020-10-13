import React, { SyntheticEvent, useContext } from 'react';
import { Button, Item, Label } from 'semantic-ui-react';
import { IActivity } from './../../../app/models/activity';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';

interface IProps {
  activity: IActivity;
}

const ActivityItem: React.FC<IProps> = ({ activity }) => {

  const activityStore = useContext(ActivityStore);
  const {selectActivity, submitting, deleteActivity, target} = activityStore;

  return (
    <Item>
      <Item.Content>
        <Item.Header as='a'>{activity.title}</Item.Header>
        <Item.Meta>{activity.date}</Item.Meta>
        <Item.Description>
          <div>{activity.description}</div>
          <div>
            {activity.city}, {activity.venue}
          </div>
        </Item.Description>
        <Item.Extra>
          <Button 
            name={activity.id}
            loading={target===activity.id && submitting} 
            floated='right' 
            content='Delete' 
            color='red' 
            onClick={(e) => deleteActivity(e, activity.id)} 
          />  
          <Button floated='right' content='View' color='blue' onClick={() => selectActivity(activity.id)} />
          <Label basic content={activity.category} />
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

export default observer(ActivityItem);
