import React from 'react';
import { Button, Item, Label } from 'semantic-ui-react';
import { IActivity } from './../../../app/models/activity';

interface IProps {
  activity: IActivity;
  selectActivity: (id: string) => void;
}

const ActivityItem: React.FC<IProps> = ({ activity, selectActivity }) => {
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
          <Button floated='right' content='View' color='blue' onClick={() => selectActivity(activity.id)} />
          <Label basic content={activity.category} />
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

export default ActivityItem;
