import React, { useContext, useState, useEffect } from 'react';
import { Button, Form, Grid, Segment } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import ActivityStore from '../../../app/stores/activityStore';
import TextInput from './../../../app/common/form/TextInput';
import TextAreaInput from './../../../app/common/form/TextAreaInput';
import SelectInput from './../../../app/common/form/SelectInput';
import { category } from './../../../app/common/options/categoryOptions';
import DateInput from './../../../app/common/form/DateInput';
import { CombineDateAndTime } from './../../../app/common/util/util';
import { ActivityFormValues } from '../../../app/models/activity';
import {
  combineValidators,
  composeValidators,
  hasLengthGreaterThan,
  isRequired,
} from 'revalidate';

const validate = combineValidators({
  title: isRequired({ message: 'The activity title is required' }),
  category: isRequired({ message: 'The activity category is required' }),
  description: composeValidators(
    isRequired('Description is required'),
    hasLengthGreaterThan(4)({
      message: 'Description needs to be at least five characters',
    })
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time'),
});

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    submitting,
    loadActivity,
    editActivity,
  } = activityStore;

  const [activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      console.log(match.params.id);
      setLoading(true);
      loadActivity(match.params.id)
        .then(
          (activity) =>
            activity && setActivity(new ActivityFormValues(activity))
        )
        .finally(() => setLoading(false));
    }
  }, [loadActivity, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = CombineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;
    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            initialValues={activity}
            validate={validate}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name='title'
                  placeholder='Title'
                  value={activity.title}
                  component={TextInput}
                />
                <Field
                  name='category'
                  placeholder='Category'
                  value={activity.category}
                  component={SelectInput}
                  options={category}
                />
                <Field
                  name='description'
                  rows={3}
                  placeholder='Description'
                  value={activity.description}
                  component={TextAreaInput}
                />
                <Form.Group widths='equal'>
                  <Field
                    name='date'
                    placeholder='Date'
                    date={true}
                    value={activity.date}
                    component={DateInput}
                  />
                  <Field
                    name='time'
                    placeholder='time'
                    time={true}
                    value={activity.time}
                    component={DateInput}
                  />
                </Form.Group>

                <Field
                  name='city'
                  placeholder='City'
                  value={activity.city}
                  component={TextInput}
                />
                <Field
                  name='venue'
                  placeholder='Venue'
                  value={activity.venue}
                  component={TextInput}
                />
                <Button
                  loading={submitting}
                  positive
                  floated='right'
                  type='submit'
                  content='Submit'
                  disabled={loading || invalid || pristine}
                />
                <Button
                  floated='right'
                  type='button'
                  content='Cancel'
                  disabled={loading}
                  onClick={
                    activity.id
                      ? () => history.push(`/activities/${activity.id}`)
                      : () => history.push('/activities')
                  }
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
