import { gql } from '@apollo/client';

export const ALL_SUBJECTS = gql`
    query allSubjects ($offset: Int!, $limit: Int!, $filter: String) {
        allSubjects (offset: $offset, limit: $limit, filter: $filter) {
            id
            school {
                id
                name
            }
            subSchool {
                id
                name
            }
            subject 
            credit
            content
            createUserid{
                teacher{
                    familyName
                    name
                }
            }
        }
    }
`;

export const ALL_SUBJECTS_PAGINATION = gql`
    query allSubjectsPagination ($page: Int!, $perPage: Int!, $filter: String) {
        allSubjectsPagination (page: $page, perPage: $perPage, filter: $filter) {
            page
            perPage
            pageCount
            totalCount
            records {
                id
                school {
                    id
                    name
                }
                subSchool {
                    id
                    name
                }
                subject 
                credit
                content
                createUserid{
                    teacher{
                        familyName
                        name
                    }
                }
            }
        }
    }
`;

export const TEACHER_STATUS = gql`
    query allTeacherStatuss {
        allTeacherStatuss {
            id
            name
        }
    }
`

export const STUDENT_STATUS = gql`
    query allStudentStatuss {
        allStudentStatuss {
            id
            name
        }
    }
`

export const STUDENT_STATUS_EXTRA = gql`
    query allStudentStatusExtras {
        allStudentStatusExtras {
            id
            name
        }
    }
`

export const ALL_USERS = gql`
    query allUsers {
        allUsers {
            id
            username
            email
        }
    }
`;

export const USER_BY_USERNAME = gql`
    query userByUsername($username: String!) {
        userByUsername(username: $username) {
            id
            username
        }
    }
`;

export const ALL_EMPLOYEES_ATTANDANCE_BY_RANGE = gql`
    query employeesAttandanceByRange ($startDate: DateTime!, $endDate: DateTime!) {
        employeesAttandanceByRange (startDate: $startDate, endDate: $endDate) {
            id
            isIn
            isOut
            timeIn
            timeOut
            user {
                id
                isTeacher
                isEmployee
                teacher {
                    familyName
                    name
                    teacherCode
                }
                employee {
                    familyName
                    name
                    employeeCode
                }
                groups {
                    name
                }
            }
        }
    }
`

export const ALL_TEACHER_AND_EMPLOYESS = gql`
    query allAttendaceEmployees {
        allAttendaceEmployees {
            username
            email
            isTeacher
            isEmployee
            teacher {
                teacherCode
                familyName
                name
            }
            employee {
                employeeCode
                familyName
                name
            }
        }
    }
`;

export const ALL_EMPLOYEES_COMPARTMENT = gql`
    query allEmployeesCompartment {
        allEmployeesCompartment {
            id
            name
        }
    }
`

export const ALL_EMPLOYEES = gql`
    query allEmployees ($filter: String) {
        allEmployees (filter: $filter) {
            id
            user {
                id
                username
                email
                groups {
                    name
                }
            }
            compartment {
                id
                name
            }
            employeeCode
            familyName
            name
            registerNo
            photo
            phone
            phone2
            address
            sex
            birthdate
            birthCity {
                id
            }
            birthDistrict {
                id
            }
            status {
                id
            }
        }
    }
`

export const ALL_TEACHERS = gql`
  	query allTeachers ($offset: Int!, $limit: Int!, $filter: String) {
        allTeachers (offset: $offset, limit: $limit, filter: $filter) {
            id
            user {
                id
                username
                email
            }
            teacherCode
            degree{
                id
            }
            access
            familyName
            name
            registerNo
            photo
            phone
            phone2
            address
            joinDate
            joinBefore
            sex
            birthdate
            birthCity {
                id
                name
            }
            birthDistrict {
                id
                name
            }
            status {
                id
                name
            }
            school {
                id
                name
            }
            subSchool {
                id
                name
            }
        }
	}
`;

export const ALL_STUDENTS = gql`
  	query allStudents ($filter: String, $program: Int, $classes: Int, $section: Int) {
        allStudents (filter: $filter, program: $program, classes: $classes, section: $section) {
            id
            user {
                id
                username
                email
            }
            studentCode
            surname
            familyName
            name
            religion
            registerNo
            nationality
            state
            photo
            phone
            address
            activity {
                id
                name
            }
            joinDate
            sex
            birthdate
            classtime {
                id
                name
            }
            birthCity {
                id
                name
            }
            birthDistrict {
                id
                name
            }
            status {
                id
                name
            }
            statusExtra {
                id
                name
            }
            school {
                id
                name
            }
            classes {
                id
                classes
            }
            section {
                id
                section
            }
            program {
                id
                program
            }
            joinSchoolyear {
                id
                schoolyear
            }
        }
    }
`;

export const ALL_CITYS = gql`
  	query allCitys{
        allCitys {
            id
            name
            code
        }
	}
`;

export const ALL_DISTRICTS = gql`
    query allDistricts {
        allDistricts {
            id
            code
            name
            cityID {
                id
                name
            }
        }
    }
`

export const ALL_PROGRAMS = gql`
  	query allPrograms{
        allPrograms {
            id
            program
            programMgl
            maxStudentNum
            school {
                id
                name
            }
            subSchool {
                id
                name
            }
            status
            createdAt
            updatedAt
        }
	  }
`;

export const ALL_SCHOOLS = gql`
  	query allSchools {
        allSchools {
            id
            name
            nameMgl
        }
	}
`;

export const ALL_SUB_SCHOOLS = gql`
  	query allSubSchools{
        allSubSchools {
            id
            name
            nameMgl
            school {
                id
                name
            }
		}
	}
`;

export const ALL_SECTIONS = gql`
    query allSections {
        allSections {
            id
            section
            classes {
                id
                classes
            }
            program {
                id
                program
            }
            teacher{
                id
            }
            program {
                id
                program
            }
            subSchool {
                id
                name
            }
            school {
                id
                name
            }
            createdAt
            updatedAt
        }
    }
`

export const ALL_CLASSESS = gql`
    query allClassess ($program: Int!, $offset: Int!, $limit: Int!, $filter: String) {
        allClassess (program: $program, offset: $offset, limit: $limit, filter: $filter) {
            id
            classes
            activity {
                id
                name
            }
            program {
                id
                program
            }
            school {
                id
                name
            }
            status
        }
    }
`
export const ALL_CLASSTIME = gql`
    query allClasstimes {
        allClasstimes {
            id
            name
        }
    }
`
export const ALL_SCHOOL_YEAR = gql`
    query allSchoolyears {
        allSchoolyears {
            id
            schoolyear
        }
    }
`;

export const ALL_PARENTS = gql`
    query allParents ($offset: Int!, $limit: Int!, $filter: String) {
        allParents (offset: $offset, limit: $limit, filter: $filter) {
            id
            familyName
            name
            profession
            phone
            address
            student {
                id
                studentCode
                familyName
                name
            }
        }
    }
`;

export const SECTION_BY_CLASSES = gql`
    query sectionsByClasses ($classes: Int!) {
        sectionsByClasses (classes: $classes) {
            id
            section
            maxStudentNum
            teacher{
                name
                id
            }
            classes {
                id
                classes
            }
            program {
                id
                program
            }
            school {
                id
                name
            }
        }
    }
`;

export const TRANSFER_BY_STUDENT = gql`
    query transfersByStudent ($student: Int!) {
        transfersByStudent (student: $student) {
            id
            student {
                familyName
                name
                photo
                studentCode
            }
            school {
                id
                name
            }
            program {
                id
                program
            }
            classes {
                id
                classes
            }
            section {
                id
                section
            }
            status {
                id
                name
            }
            statusExtra {
                id
                name
            }
            classtime {
                id
                name
            }
            activity {
                id
                name
            }
            docDate
            docNum
            description
            oldData
        }
    }
`;

export const ALL_EVENT_TYPES = gql`
    query allEventTypes {
        allEventTypes {
            id
            name
            color
        }
    }
`;

export const ALL_EVENTS = gql`
    query allEvents {
        allEvents {
            id
            title
            description
            content
            startAt
            endAt
            eventType {
                id
                name
                color
            }
        }
    } 
`;

export const ALL_EVENTS_BY_DATE = gql `
    query allEventsByDate ($date: Date) {
        allEventsByDate (date: $date) {
            id
            title
            description
            content
            startAt
            endAt
            eventType {
                id
                name
                color
            }
        }
    } 
`;

export const ALL_EVENTS_BY_TYPE = gql`
    query allEventsByType ($id: Int!) {
        allEventsByType (id: $id) {
            id
            title
            description
            content
            startAt
            endAt
            eventType
        }
    }
`;