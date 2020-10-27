import React, { useContext, useState } from 'react';
import { Button, Grid, Header, Tab } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileEditForm from './ProfileEditForm';
import { IEditProfile } from './../../app/models/profile';

const ProfileDescription = () => {
  const rootStore = useContext(RootStoreContext);
  const { profile, isCurrentUser, editProfile } = rootStore.profileStore;
  const [editMode, setEditMode] = useState(false);

  const handleEditProfile = (values: IEditProfile) => {
    editProfile(values).then(() => setEditMode(false));
    console.log(values);
  }

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: '0' }}>
          <Header
            floated='left'
            icon='image'
            content={`About ${profile?.displayName}`}
          />
          {isCurrentUser && (
            <Button
              floated='right'
              basic
              content={editMode ? 'Cancel' : 'Edit Profile'}
              onClick={() => setEditMode(!editMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editMode ? <ProfileEditForm editProfile={handleEditProfile} profile={profile!}/> : <p>{profile?.bio}</p>}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileDescription);
