import React from 'react';
import { Tab, TabPane } from 'semantic-ui-react';
import ProfilePhotos from './ProfilePhotos';
import ProfileDescription from './ProfileDescription';
import { observer } from 'mobx-react-lite';

const panes = [
  { menuItem: 'About', render: () => <ProfileDescription /> },
  { menuItem: 'Photos', render: () => <ProfilePhotos /> },
  {
    menuItem: 'Activities',
    render: () => <TabPane>Activities content</TabPane>,
  },
  {
    menuItem: 'Followers',
    render: () => <TabPane>Followers content</TabPane>,
  },
  {
    menuItem: 'Following',
    render: () => <TabPane>Following content</TabPane>,
  },
];

const ProfileContent = () => {
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition='right'
      panes={panes}
    />
  );
};

export default observer(ProfileContent);
