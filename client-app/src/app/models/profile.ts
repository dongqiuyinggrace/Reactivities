export interface IProfile {
    displayName: string;
    userName: string;
    image: string;
    bio: string;
    following: boolean;
    followingCount: number;
    followersCount: number;
    photos: IPhoto[];
}

export interface IPhoto {
    id: string;
    url: string;
    isMain: boolean;
}

export interface IEditProfile extends Partial<IProfile>{}