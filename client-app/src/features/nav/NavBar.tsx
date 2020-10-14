import React from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';
import {Link, NavLink} from 'react-router-dom';
import { observer } from 'mobx-react-lite';


const NavBar = () => {
  
  return (
      <Menu inverted fixed='top'>
        <Container>
          <Menu.Item header name='home' exact as={NavLink} to='/'>
            <img
              src='/assets/logo.png'
              alt='logo'
              style={{ marginRight: '10px' }}
            />
            Reactivities
          </Menu.Item>
          <Menu.Item as={NavLink} to='/activities' name='Activities'/>
          <Menu.Item>
            <Button as={Link} to='/createActivity' positive content='Create Activity' />
          </Menu.Item>
        </Container>
      </Menu>
  );
};

export default NavBar;
