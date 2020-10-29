import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileContent from './ProfileContent';
import ProfileHeader from './ProfileHeader';
import { RouteComponentProps } from 'react-router-dom';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { observer } from 'mobx-react-lite';

interface RouteParams {
  userName: string;
}

interface IProps extends RouteComponentProps<RouteParams> {}

const ProfilePage: React.FC<IProps> = ({ match }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadProfile,
    loadingProfile,
    profile,
    loading,
    isCurrentUser,
    follow,
    unfollow,
    setActiveTab
  } = rootStore.profileStore;

  useEffect(() => {
    loadProfile(match.params.userName);
  }, [loadProfile, match]);

  if (loadingProfile)
    return <LoadingComponent inverted content='Loading Profile' />;

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader
          profile={profile!}
          isCurrentUser={isCurrentUser}
          follow={follow}
          loading={loading}
          unfollow={unfollow}
        />
        <ProfileContent setActiveTab={setActiveTab}/>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProfilePage);
