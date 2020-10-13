export interface StudentData {
    name: string | null | undefined,
    info: PersonInfo | null | undefined,
    subjects: Subject[] | null | undefined
}

export interface PersonInfo {
    email: string,
    homeAddress: string,
    mailAddress: string,
    phone: string
}

export interface Subject {
    name: string,
    sections: Section[]
}

export interface Section {
    section: string,
    component: string,
    classes: Class[]
}

export interface Class {
    date: string,
    daytime: string,
    room: string,
    instructor: string
}
