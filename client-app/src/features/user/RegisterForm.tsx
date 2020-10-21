import React, { useContext } from 'react';
import { IUserFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';
import { FORM_ERROR } from 'final-form';
import { combineValidators, isRequired } from 'revalidate';
import { Field, Form as FinalForm } from 'react-final-form';
import { Button, Form, Header } from 'semantic-ui-react';
import TextInput from './../../app/common/form/TextInput';
import ErrorMessage from '../../app/common/form/ErrorMessage';
import { observer } from 'mobx-react-lite';

const RegisterForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { register } = rootStore.userStore;

  const handleSubmitForm = (values: IUserFormValues) =>
    register(values).catch((error) => {
      return { [FORM_ERROR]: error };
    });

  const validate = combineValidators({
    email: isRequired('Email'),
    password: isRequired('Password'),
    userName: isRequired('UserName'),
    displayName: isRequired('DisplayName'),
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
            content='Sign Up to Reactivities'
            color='teal'
            textAlign='center'
          />
          <Field name='email' placeholder='Email' component={TextInput} />
          <Field name='password' placeholder='Password' component={TextInput} />
          <Field name='userName' placeholder='UserName' component={TextInput} />
          <Field
            name='displayName'
            placeholder='DisplayName'
            component={TextInput}
          />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage error={submitError} />
          )}
          <Button
            loading={submitting}
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            color='teal'
            content='Register'
            fluid
          />
        </Form>
      )}
    />
  );
};

export default observer(RegisterForm);
