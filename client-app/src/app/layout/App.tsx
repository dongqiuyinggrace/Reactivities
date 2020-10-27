import React, { Fragment, useContext, useEffect } from 'react';
import NavBar from '../../features/nav/NavBar';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';
import ActivityForm from '../../features/activities/forms/ActivityForm';
import HomePage from '../../features/home/HomePage';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from './NotFound';
import { ToastContainer } from 'react-toastify';
import { RootStoreContext } from '../stores/rootStore';
import LoadingComponent from './LoadingComponent';
import { observer } from 'mobx-react-lite';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage from './../../features/profiles/ProfilePage';

const App = () => {
  const location = useLocation();
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const {getCurrentUser} = rootStore.userStore;

  useEffect(() => {
    if(token) {
      getCurrentUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [token, getCurrentUser, setAppLoaded]);

  if (!appLoaded) return <LoadingComponent inverted content='Loading App...'/>

  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position='bottom-right' />
      <Route exact path='/' component={HomePage} />
      <Route
        path='/(.+)'
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Switch key={location.key}>
                <Route
                  exact
                  path='/activities/:id'
                  component={ActivityDetails}
                />
                <Route path='/activities' component={ActivityDashboard} />
                <Route
                  path={['/createActivity', '/manage/:id']}
                  component={ActivityForm}
                />
                <Route
                  path='/profile/:userName'
                  component={ProfilePage}
                />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </Fragment>
  );
};

export default observer(App);
