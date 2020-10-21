import React, { useContext } from 'react';
import { Field, Form as FinalForm } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Form, Header } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import TextInput from './../../app/common/form/TextInput';
import { IUserFormValues } from '../../app/models/user';
import ErrorMessage from '../../app/common/form/ErrorMessage';
import { observer } from 'mobx-react-lite';

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login } = rootStore.userStore;

  const handleSubmitForm = (values: IUserFormValues) =>
    login(values).catch((error) => {
      return { [FORM_ERROR]: error };
    });

  const validate = combineValidators({
    email: isRequired('Email'),
    password: isRequired('Password'),
  });

  return (
    <FinalForm
      onSubmit={handleSubmitForm}
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit,
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header
            as='h2'
            content='Login to Reactivities'
            color='teal'
            textAlign='center'
          />
          <Field name='email' placeholder='Email' component={TextInput} />
          <Field name='password' placeholder='Password' component={TextInput} />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage
              error={submitError}
              text='Invalid Email or Password'
            />
          )}
          <Button
            loading={submitting}
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            color='teal'
            content='Login'
            fluid
          />
        </Form>
      )}
    />
  );
};

export default observer(LoginForm);
