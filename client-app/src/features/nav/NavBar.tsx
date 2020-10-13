import React, { useContext } from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';
import ActivityStore from '../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';


const NavBar = () => {
  const activityStore = useContext(ActivityStore);
  const {openCreateForm} = activityStore;

  return (
      <Menu inverted fixed='top'>
        <Container>
          <Menu.Item header name='home'>
            <img
              src='/assets/logo.png'
              alt='logo'
              style={{ marginRight: '10px' }}
            />
            Reactivities
          </Menu.Item>
          <Menu.Item name='Activities' />
          <Menu.Item>
            <Button positive content='Create Activity' onClick={openCreateForm}/>
          </Menu.Item>
        </Container>
      </Menu>
  );
};

export default observer(NavBar);
