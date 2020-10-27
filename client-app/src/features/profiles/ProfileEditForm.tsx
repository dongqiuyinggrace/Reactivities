import React, { useContext } from 'react';
import { Field, Form as FinalForm } from 'react-final-form';
import { composeValidators, isRequired, combineValidators } from 'revalidate';
import { Button, Form } from 'semantic-ui-react';
import TextInput from './../../app/common/form/TextInput';
import { observer } from 'mobx-react-lite';
import { IEditProfile } from './../../app/models/profile';

interface IProps {
  editProfile: (profile: IEditProfile) => void;
  profile: IEditProfile;
}

const ProfileEditForm: React.FC<IProps> = ({ editProfile, profile }) => {
  const validate = combineValidators({
    displayName: isRequired({ message: 'displayName is required' }),
  });

  return (
    <FinalForm
      onSubmit={editProfile}
      validate={validate}
      initialValues={profile}
      render={({ handleSubmit, invalid, pristine, submitting }) => (
        <Form onSubmit={handleSubmit}>
          <Field
            name='displayName'
            component={TextInput}
            value={profile.displayName}
            placeholder='DisplayName'
          />
          <Field
            name='bio'
            component={TextInput}
            value={profile.bio}
            placeholder='Bio'
          />
          <Button
            disabled={invalid || pristine || submitting}
            type='submit'
            positive
            content='Update Profile'
            floated='right'
          />
        </Form>
      )}
    />
  );
};

export default observer(ProfileEditForm);
