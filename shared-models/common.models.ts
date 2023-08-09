export interface Tag {
    id?: number;
    label?: string;
}

export interface Profile {
    id?: number;
    gender?: string;
    birthDate?: Date;
    sexualPreferences?: string;
    biography?: string;
    location?: string;
    fameRate?: number;
}

export interface ProfileTag {
    profileId?: number;
    tagId?: number;
}

export interface Picture {
    id?: number;
    profileId?: number;
    url?: string;
}

export interface ProfileDefaultPicture {
    profileId?: number;
    pictureId?: number;
}

export interface Like {
    id?: number;
    profileId?: number;
    likedProfileId?: number;
    date?: Date;
}

export interface View {
    id?: number;
    profileId?: number;
    viewedProfileId?: number;
    date?: Date;
}

export interface Blacklist {
    id?: number;
    profileId?: number;
    blacklistedProfileId?: number;
    date?: Date;
}

export interface FakeReport {
    id?: number;
    profileId?: number;
    fakeReportedProfileId?: number;
    date?: Date;
}

export interface User {
    id?: number;
    lastName?: string;
    firstName?: string;
    email?: string;
    password?: string;
    profileId?: number;
}

export interface Message {
    id?: number;
    from: number;
    to: number;
    message: string;
    date: Date;
}

export interface Notification {
    id?: number;
    isViewed?: boolean;
    from?: number;
    to?: number;
    type?: string;
    date?: Date;
}
