import { gql } from '@apollo/client';

export const ALL_ONLINE_TYPE = gql `
    query allOnlineTypes {
        allOnlineTypes {
            id
            name
        }
    }

`;

export const ALL_ONLINE_FILE = gql `
    query allOnlineFiles ($folder: Int){
        allOnlineFiles (folder: $folder){
            id
            file
        }
    }
`;

export const ALL_FOLDERS = gql `
    query allFolders ($folder: Int){
        allFolders(folder: $folder){
            id
            name
        }
    }
    `

export const CREATE_ONLINE_FILE = gql `
    mutation createOnlineFile($file: Upload!, $folder: Int) {
        createOnlineFile(file: $file, folder: $folder) {
            onlineFile {
                id
                file
            }
        }
    }
`;

export const CREATE_ONLINE_FILE_FOLDER = gql `
    mutation createOnlineFileFolder($name: String, $subFolder: Int){
        createOnlineFileFolder(name: $name, subFolder: $subFolder){
            onlineFileFolder{
                id
            }
        }
    }
`;

export const DELETE_ONLINE_FILE = gql `
    mutation deleteOnlineFile ($id: ID) {
        deleteOnlineFile (id: $id) {
            onlineFile {
                file
            }
        }
    }
`;

export const DELETE_ONLINE_FILE_FOLDER = gql`
    mutation deleteOnlineFileFolder ($id: Int){
        deleteOnlineFileFolder (id: $id){
            onlineFileFolder {
                name
            }
        }
    }
`

export const CREATE_ONLINE_LESSON = gql`
    mutation createOnlineLesson ($description: String, $schoolyear: Int, $status: String, $subject: Int) {
        createOnlineLesson (description: $description, schoolyear: $schoolyear, status: $status, subject: $subject) {
            onlineLesson {
                id
            }
        }
    }
`;

export const UPDATE_ONLINE_LESSON = gql`
    mutation updateOnlineLesson ($description: String, $id: ID, $schoolyear: Int, $status: String, $subject: Int) {
        updateOnlineLesson (description: $description, id: $id, schoolyear: $schoolyear, status: $status, subject: $subject) {
            onlineLesson {
                id
            }
        }
    }
`;

export const ALL_ONLINE_LESSON = gql`
    query allOnlineLessonsPagination ($page: Int, $perPage: Int) {
        allOnlineLessonsPagination (page: $page, perPage: $perPage) {
            page
            perPage
            pageCount
            totalCount
            records{
                id
                schoolyear {
                    id
                    schoolyear
                }
                subject {
                    id
                    subject
                }
                description
                createdAt
                status
                createUserid {
                    isTeacher
                    teacher {
                        name
                        photo
                    }
                }
            }
        }
    }
`;

export const LESSON_BY_ID = gql `
    query onlineLessonById ($id: Int!) {
        onlineLessonById (id: $id) {
            id
            schoolyear {
                schoolyear
                id
            }
            description
            status
        }
    }
`;

export const DELETE_ONLINE_LESSON = gql `
    mutation deleteOnlineLesson ($id: ID) {
        deleteOnlineLesson (id: $id) {
            onlineLesson {
                status
            }
        }
    }
`;

export const ALL_SUB_LESSON_BY_LESSON = gql `
    query allOnlineSubByLesson ($onlineLesson: Int!) {
        allOnlineSubByLesson (onlineLesson: $onlineLesson) {
            id
            title
            description
            createUserid {
                isTeacher
                teacher {
                    name
                }
            }
            onlineType {
                id
                name
            }
            onlineSubFileSet {
                onlineFile {
                    id
                    file
                }
            }
            status
        }
    }
`;

export const CREATE_SUB_LESSON = gql`
    mutation createOnlineSub ($description: String, $onlineLesson: Int, $status: String, $title: String, $onlineType: Int) {
        createOnlineSub (description: $description, onlineLesson: $onlineLesson, status: $status, title: $title, onlineType: $onlineType) {
            onlineSub {
                id
            }
        }
    }
`;

export const UPDATE_SUB_LESSON = gql `
    mutation updateOnlineSub ( $description: String, $id: ID, $onlineLesson: Int, $status: String, $title: String, $onlineType: Int) {
        updateOnlineSub (description: $description, id: $id, onlineLesson: $onlineLesson, status: $status, title: $title, onlineType: $onlineType) {
            onlineSub {
                id
            }
        }
    }
`;

export const DELETE_SUB_LESSON = gql `
    mutation deleteOnlineSub ($id: ID) {
        deleteOnlineSub (id: $id) {
            onlineSub {
                title
            }
        }
    }
`;

export const SUB_BY_ID = gql `
    query onlineSubById ($id: Int!) {
        onlineSubById (id: $id) {
            title
            description
            onlineSubFileSet {
                onlineFile {
                    id
                    file
                }
            }
            onlineType {
                id
                name
            }
            onlineAttendanceSet {
                student {
                    id
                    studentCode
                    name
                    familyName
                    photo
                }
            }
            status
            createdAt
        }
    } 
`;

export const CREATE_ONLINE_STUDENT = gql `
    mutation createOnlineStudent ($onlineLesson: Int, $studentCode: String, $section: Int) {
        createOnlineStudent (onlineLesson: $onlineLesson, studentCode: $studentCode, section: $section) {
            onlineStudent {
                id
            }
        }
    }
`;

export const DELETE_ONLINE_STUDENT = gql `
    mutation deleteOnlineStudent ($id: ID) {
        deleteOnlineStudent (id: $id) {
            onlineStudent {
                student {
                    name
                }
            }
        }
    }
`;

export const ALL_ONLINE_STUDENT_BY_LESSON = gql `
    query allOnlineStudentByLesson ($onlineLesson: Int!) {
        allOnlineStudentByLesson (onlineLesson: $onlineLesson) {
            id
            student {
                id
                familyName
                name
                studentCode
            }
        }
    }
`;

export const ALL_ONLINE_SUB_FILES = gql`
    query allOnlineSubFiles ($onlineSub: Int) {
        allOnlineSubFiles (onlineSub: $onlineSub) {
            id
            onlineFile {
                id
                file
            }
        }
    }
`

export const CREATE_ONLINE_SUB_FILE = gql`
    mutation createOnlineSubFile ($onlineFile: Int, $onlineSub: Int) {
        createOnlineSubFile (onlineFile: $onlineFile, onlineSub: $onlineSub) {
            onlineSubFile {
                id
            }
        }
    }
`

export const DELETE_ONLINE_SUB_FILE = gql`
    mutation deleteOnlineSubFile ($id: Int) {
        deleteOnlineSubFile (id: $id) {
            onlineSubFile {
                id
            }
        }
    }
`

export const LESSONS_NAV = gql`
    query lessonsNav {
        allOnlineLessons {
            id
            subject {
            subject
            }
        }
        allOnlineTypes {
            id
            name
        }
    }
`