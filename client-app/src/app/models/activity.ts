export interface IActivity {
    id: string;
    title: string;
    description: string;
    category: string;
    date: Date;
    city: string;
    venue: string;
    isGoing: boolean;
    isHost: boolean;
    attendees: IAttendee[];
    comments: IComment[];
}

export interface IComment {
    id: string;
    body: string;
    createdAt: Date;
    displayName: string;
    userName: string;
    image: string;
}

export interface IAttendee {
    userName: string;
    displayName: string;
    image: string;
    isHost: boolean;
}

export interface IActivityFormValues extends Partial<IActivity> {
    time?: Date;
}

export class ActivityFormValues implements IActivityFormValues {
    id?: string = undefined;
    title: string = '';
    description: string = '';
    category: string = '';
    date?: Date = undefined;
    time?: Date = undefined;
    city: string = '';
    venue: string = '';

    constructor(init?: IActivityFormValues) {
        if (init && init.date) {
            init.time = init.date;
        }

        Object.assign(this, init);
    }
}