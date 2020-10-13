import React, { SyntheticEvent } from 'react';
import { Button, Item, Label } from 'semantic-ui-react';
import { IActivity } from './../../../app/models/activity';

interface IProps {
  activity: IActivity;
  selectActivity: (id: string) => void;
  deleteActivity: (event: SyntheticEvent<HTMLButtonElement> ,id: string) => void;
  submitting: boolean;
  target: string;
}

const ActivityItem: React.FC<IProps> = ({ activity, selectActivity, deleteActivity, submitting, target }) => {
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

export default ActivityItem;
