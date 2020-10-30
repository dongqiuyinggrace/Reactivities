import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Grid, Loader } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import InfiniteScroller from 'react-infinite-scroller';
import ActivityFilters from './ActivityFilters';

const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadActivities,
    loadingInitial,
    setPage,
    page,
    totalPage,
  } = rootStore.activityStore;

  const [loadingNext, setLoadingNext] = useState(false);

  const handleLoadNext = () => {
    setLoadingNext(true);
    setPage(page + 1);
    loadActivities().then(() => setLoadingNext(false));
  };

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  if (loadingInitial && page === 0)
    return <LoadingComponent inverted={true} content='Loading Activities' />;

  return (
    <Grid>
      <Grid.Column width={10}>
        <InfiniteScroller
          pageStart={0}
          loadMore={handleLoadNext}
          hasMore={!loadingNext && page + 1 < totalPage}
          initialLoad={false}
        >
          <ActivityList />
        </InfiniteScroller>
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
