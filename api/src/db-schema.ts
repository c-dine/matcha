export interface Tag {
    id: number;
    label?: string;
}

export interface Profile {
    id: number;
    gender?: string;
    birth_date?: Date;
    sexual_preferences?: string;
    biography?: string;
    location?: string;
    fame_rate?: number;
}

export interface ProfileTag {
    profile_id: number;
    tag_id: number;
}

export interface Picture {
    id: number;
    profile_id: number;
    url?: string;
}

export interface ProfileDefaultPicture {
    profile_id: number;
    picture_id: number;
}

export interface Like {
    id: number;
    profile_id: number;
    liked_profile_id: number;
    date?: Date;
}

export interface View {
    id: number;
    profile_id: number;
    viewed_profile_id: number;
    date?: Date;
}

export interface Blacklist {
    id: number;
    profile_id: number;
    blacklisted_profile_id: number;
    date?: Date;
}

export interface FakeReport {
    id: number;
    profile_id: number;
    fake_reported_profile_id: number;
    date?: Date;
}

export interface User {
    id: number;
    last_name?: string;
    first_name?: string;
    email?: string;
    password?: string;
    profile_id?: number;
}

export interface Message {
    id: number;
    from: number;
    to: number;
    message: string;
    date: Date;
}

export interface Notification {
    id: number;
    is_viewed?: boolean;
    from?: number;
    to?: number;
    type?: string;
    date?: Date;
}
