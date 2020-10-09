import React from 'react';
import { Button, Image, Item, Label } from 'semantic-ui-react';

const ActivityList = () => {
  return (
    <Item.Group>
      <Item>
        <Item.Content>
          <Item.Header as='a'>Title</Item.Header>
          <Item.Meta>Date</Item.Meta>
          <Item.Description>
            <div>Description</div>
            <div>City, Venue</div>
          </Item.Description>
          <Item.Extra>
              <Button floated='right' content='View' color='blue'/>
              <Label content='Category'/>
          </Item.Extra>
        </Item.Content>
      </Item>
    </Item.Group>
  );
};

export default ActivityList;
