import React, {FormEvent, useContext, useState, useEffect} from 'react'
import { Button, Form, Segment } from 'semantic-ui-react';
import { IActivity } from './../../../app/models/activity';
import {v4 as uuid} from 'uuid';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';
import { RouteComponentProps } from 'react-router-dom';

interface DetailParams {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({match, history}) => {
    const activityStore = useContext(ActivityStore);
    const {createActivity, activity: initialFormState, submitting, loadActivity, clearActivity} = activityStore;

    const [activity, setActivity] = useState<IActivity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        if (match.params.id && activity.id.length === 0) {
            loadActivity(match.params.id).then(
                () => initialFormState && setActivity(initialFormState));
        }

        return (() => {
            clearActivity();
        })
        
    }, [loadActivity, match.params.id, clearActivity, initialFormState, activity.id.length])

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
            createActivity(newActivity).then(() => history.push(`/activities/${activity.id}`));

        } else {
            activityStore.editActivity(activity).then(() => history.push(`/activities/${activity.id}`));
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
                <Button floated='right' type='button' content='Cancel' onClick={() => history.push(`/activities/${activity.id}`)}/>
            </Form>
        </Segment>
    )
}

export default observer(ActivityForm);
