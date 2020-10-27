import React, { useContext } from 'react';
import { Button, Header, Image, Item, Segment } from 'semantic-ui-react';
import { IActivity } from './../../../app/models/activity';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { RootStoreContext } from './../../../app/stores/rootStore';

const activityImageStyle = {
  filter: 'brightness(30%)',
};

const activityImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white',
};

interface IProps {
  activity: IActivity;
}

const ActivityDetailedHead: React.FC<IProps> = ({ activity }) => {
  const host = activity.attendees.filter((a) => a.isHost)[0];
  const rootStore = useContext(RootStoreContext);
  const {attendActivity, unattendActivity, loading} = rootStore.activityStore;

  return (
    <Segment.Group>
      <Segment basic attached='top' style={{ padding: '0' }}>
        <Image
          src={`/assets/categoryImages/${activity.category}.jpg`}
          fluid
          style={activityImageStyle}
        />
        <Segment basic style={activityImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size='huge'
                  content={activity.title}
                  style={{ color: 'white' }}
                />
                <p>{format(activity.date, 'eeee do MMMM')}</p>
                <p>
                  Hosted by <Link to={`/profile/${host.userName}`}>{host.displayName}</Link>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached='bottom'>
        {activity.isGoing && !activity.isHost && (
          <Button loading={loading} onClick={() => unattendActivity(activity.id)} >Cancel attendance</Button>
        )}
        {!activity.isGoing && !activity.isHost && (
          <Button loading={loading} color='teal' onClick={() => attendActivity(activity.id)} >Join Activity</Button>
        )}

        {activity.isHost && (
          <Button
            as={Link}
            to={`/manage/${activity.id}`}
            color='orange'
            floated='right'
          >
            Manage Event
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityDetailedHead);
