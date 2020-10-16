import React from 'react';
import NavBar from '../../features/nav/NavBar';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { Route, Switch, useLocation } from 'react-router-dom';
import ActivityForm from '../../features/activities/forms/ActivityForm';
import HomePage from '../../features/home/HomePage';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from './NotFound';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const location = useLocation();
  return (
    <>
    <ToastContainer position='bottom-right'/>
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
                  component={NotFound}
                />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
};

export default App;
