import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityDetailedHead from './ActivityDetailedHead';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';
import { RootStoreContext } from '../../../app/stores/rootStore';

interface DetailParams {
  id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const rootStore = useContext(RootStoreContext);
  const { activity, loadActivity, loadingInitial } = rootStore.activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
  }, [loadActivity, match.params.id]);

  if (loadingInitial) return <LoadingComponent content='Loading Activity' />;

  if (!activity) {
    return <h1>Activity not found</h1>
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHead activity={activity} />
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar attendees={activity.attendees}/>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);
