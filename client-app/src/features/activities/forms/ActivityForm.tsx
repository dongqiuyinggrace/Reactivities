import React, { FormEvent, useContext, useState, useEffect } from 'react';
import { Button, Form, Grid, Segment } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import ActivityStore from '../../../app/stores/activityStore';
import { IActivity, IActivityFormValues } from './../../../app/models/activity';
import TextInput from './../../../app/common/form/TextInput';
import TextAreaInput from './../../../app/common/form/TextAreaInput';
import SelectInput from './../../../app/common/form/SelectInput';
import { category } from './../../../app/common/options/categoryOptions';
import DateInput from './../../../app/common/form/DateInput';
import { unescapeLeadingUnderscores } from 'typescript';
import { CombineDateAndTime } from './../../../app/common/util/util';

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
    activity: initialFormState,
    submitting,
    loadActivity,
    clearActivity,
  } = activityStore;

  const [activity, setActivity] = useState<IActivityFormValues>({
    id: undefined,
    title: '',
    category: '',
    description: '',
    date: undefined,
    time: undefined,
    city: '',
    venue: '',
  });

  useEffect(() => {
    if (match.params.id && !activity.id) {
      loadActivity(match.params.id).then(
        () => initialFormState && setActivity(initialFormState)
      );
    }

    return () => {
      clearActivity();
    };
  }, [
    loadActivity,
    match.params.id,
    clearActivity,
    initialFormState,
    activity.id,
  ]);

  const handleChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  // const handleSubmit = () => {
  //   if (activity.id) {
  //     let newActivity = {
  //       ...activity,
  //       id: uuid(),
  //     };
  //     createActivity(newActivity).then(() =>
  //       history.push(`/activities/${activity.id}`)
  //     );
  //   } else {
  //     activityStore
  //       .editActivity(activity)
  //       .then(() => history.push(`/activities/${activity.id}`));
  //   }
  // };

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = CombineDateAndTime(values.date, values.time);
    const {date, time, ...activity} = values;
    activity.date = dateAndTime;
    console.log(activity);
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
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
                />
                <Button
                  floated='right'
                  type='button'
                  content='Cancel'
                  onClick={() => history.push(`/activities/${activity.id}`)}
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
