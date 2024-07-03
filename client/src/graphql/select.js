import { gql } from '@apollo/client';

export const SELECT_STUDENT = gql`
    query allStudents ($filter: String) {
        allStudents (filter: $filter) {
            id
            familyName
            name
            studentCode
        }
	}
`;

export const SELECT_TEACHER = gql`
    query allTeachers ($filter: String) {
        allTeachers (filter: $filter) {
            id
            familyName
            name
            teacherCode
        }
    }
`;

// export const SELECT_SECTION_TEACHER = gql `
//     query allAssistantTeachers ($filter: String) {
//         allAssistantTeachers (filter: $filter) {
//             id
//             familyName
//             name 
//             teacherCode
//         }
//     }
// `

export const SELECT_CLASSES = gql`
    query allClassess ($filter: String, $program: Int) {
        allClassess (filter: $filter, program: $program) {
            id
            classes
        }
	}
`;

export const SELECT_SUBJECT = gql`
    query allSubjects ($offset: Int!, $limit: Int!, $filter: String) {
        count (appName: "subject", modelName: "Subject", filter: $filter) {
            count
        }
        allSubjects (offset: $offset, limit: $limit, filter: $filter) {
            id
            subject
            content
            createUserid {
                firstName
                lastName
            }
        }
    }
`;

export const SELECT_PROGRAM = gql`
    query selectProgram {
        allPrograms {
            id
            program
        }
    }
`;

export const SECTIONS_BY_PROGRAM = gql`
    query sectionsByProgram ($program: Int!) {
        sectionsByProgram (program: $program) {
            id
            section 
            classes {
                classes
            }
        }
    }
`;

export const SELECT_SECTION = gql`
    query sectionsByClasses ($classes: Int!){
        sectionsByClasses (classes: $classes) {
            id 
            section
        }
    }
`

export const SELECT_STUDENT_PAGINATION = gql`
    query allStudentsPagination (
        $page: Int
        $perPage: Int
        $filter: String = ""
    ) {
        allStudentsPagination (
            page: $page
            perPage: $perPage
            filter: $filter
        ) {
            page
            perPage
            pageCount
            totalCount
            records {
                id
                name
                familyName
            }
        }
    }
`