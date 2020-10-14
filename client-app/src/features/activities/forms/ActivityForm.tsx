import React, {FormEvent, useContext, useState} from 'react'
import { Button, Form, Segment } from 'semantic-ui-react';
import { IActivity } from './../../../app/models/activity';
import {v4 as uuid} from 'uuid';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';

const ActivityForm = () => {
    const activityStore = useContext(ActivityStore);
    const {createActivity, selectedActivity, submitting, setEditMode} = activityStore;

    const initializeForm = () => {
        if (selectedActivity) {
            return selectedActivity;
        } else {
            return {
                id: '',
                title: '',
                category: '',
                description: '',
                date: '',
                city: '',
                venue: ''
            };
        }
    }

    const [activity, setActivity] = useState<IActivity>(initializeForm);

    const handleChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.currentTarget;
        setActivity({...activity, [name]: value });
    }

    const handleSubmit = () => {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity);
        } else {
            activityStore.editActivity(activity);
        }
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input name='title' placeholder='Title' value={activity.title} onChange={handleChange}/>
                <Form.Input name='category' placeholder='Category' value={activity.category} onChange={handleChange}/>
                <Form.TextArea name='description' rows={2} placeholder='Description' value={activity.description} onChange={handleChange} />
                <Form.Input name='date' type='datetime-local' placeholder='Date' value={activity.date} onChange={handleChange}/>
                <Form.Input name='city' placeholder='City' value={activity.city} onChange={handleChange}/>
                <Form.Input name='venue' placeholder='Venue' value={activity.venue} onChange={handleChange}/>
                <Button loading={submitting} positive floated='right' type='submit' content='Submit'/>
                <Button floated='right' type='button' content='Cancel' onClick={() => setEditMode(false)}/>
            </Form>
        </Segment>
    )
}

export default observer(ActivityForm);
