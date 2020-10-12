export interface StudentData {
    name: string | null | undefined,
    subjects: Subject[] | undefined
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
