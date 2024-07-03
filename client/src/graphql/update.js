import { gql } from '@apollo/client'

export const UPDATE_SUBJECT = gql `
    mutation updateSubject ($credit: String, $id: ID, $school: Int, $subSchool: Int, $content: String, $subject: String) {
        updateSubject (credit: $credit id: $id, school: $school, content: $content, subSchool: $subSchool, subject: $subject) {
            subject {
                subject
            }
        }
    }
`

export const UPDATE_SCHOOL = gql `
    mutation updateSchool($id: ID, $name: String, $nameMgl: String){
        updateSchool (id: $id, name: $name, nameMgl: $nameMgl){
            school {
                name
                nameMgl
            }
        }
    }
`;

export const UPDATE_SUB_SCHOOL = gql `
    mutation updateSubSchool($id: ID, $name: String, $nameMgl: String, $school: Int) {
        updateSubSchool (id: $id, name: $name, nameMgl: $nameMgl, school: $school) {
            subSchool {
                name
            }
        }
    }
`;

export const UPDATE_PROGRAM = gql `
    mutation updateProgram ($id: ID, $program: String, $programMgl: String, $status: String, $maxStudentNum: Int,
                            $school: Int, $subSchool: Int) {
        updateProgram (id: $id, program: $program, programMgl: $programMgl, status: $status, maxStudentNum: $maxStudentNum, 
                        school: $school, subSchool: $subSchool) {
            program {
                program
            }
        }
    }
`

export const UPDATE_CLASSES = gql `
    mutation updateClasses($id: ID, $activity: Int, $classes: String,
                          $program: Int, $school: Int, $status: String) {
        updateClasses(id: $id, activity: $activity, classes: $classes, 
                    program: $program, school: $school, status: $status) {
            classes {
                classes
            }
        }
    }
`

export const UPDATE_SECTION = gql `
    mutation updateSection($id: ID, $classes: Int, $maxStudentNum: Int, $program: Int, $school: Int, $teacher: Int, $section: String) {
        updateSection (id: $id, classes: $classes, program: $program, school: $school, teacher: $teacher, maxStudentNum: $maxStudentNum, section: $section) {
            section {
                id
            }
        }
    }
`

export const UPDATE_TEACHER = gql `
    mutation updateTeacher ($address: String, $birthCity: Int, $birthDistrict: Int, $birthdate: String, $degree: Int,
                            $familyName: String, $id: ID!, $joinBefore: String, $joinDate: String, $name: String, $phone: String, $phone2: String, $registerNo: String, 
                            $school: Int, $sex: String, $status: Int, $subSchool: Int, $teacherCode: String, $access: String!, $username: String, $email: String) {
        updateTeacher (address: $address, birthCity: $birthCity, birthDistrict: $birthDistrict, birthdate: $birthdate, degree: $degree
                        familyName: $familyName, id: $id, joinBefore: $joinBefore, joinDate: $joinDate, name: $name, phone: $phone, phone2: $phone2, 
                        registerNo: $registerNo, school: $school, sex: $sex, status: $status, subSchool: $subSchool, 
                        teacherCode: $teacherCode, access: $access, username: $username, email: $email) {
            teacher {
                id
            }
        }
    }
`;

export const UPDATE_EMPLOYEES = gql `
    mutation updateEmployee ($address: String, $birthCity: Int, $birthDistrict: Int, $birthdate: String, $employeeCode: String, $sex: String, $status: Int, 
                             $familyName: String, $group: Int, $id: Int, $name: String, $phone: String, $phone2: String, $registerNo: String, $compartment: Int,
                             $username: String, $email: String) {
        updateEmployee (address: $address, birthCity: $birthCity, birthDistrict: $birthDistrict, birthdate: $birthdate, employeeCode: $employeeCode, sex: $sex, status: $status,
                        familyName: $familyName, group: $group, id: $id, name: $name, phone: $phone, phone2: $phone2, registerNo: $registerNo, compartment: $compartment,
                        username: $username, email: $email) {
                            employee{
                                id
                            }
                        }
                    }
`

export const UPDATE_PARENT = gql `
    mutation updateParent ($address: String, $familyName: String, $id: ID, $name: String, $phone: String, $profession: String, $student: Int) {
        updateParent (address: $address, familyName: $familyName, id: $id, name: $name, phone: $phone, profession: $profession, student: $student) {
            parent {
                name
            }
        }
    }
`;

export const TRANSFER_STUDENT = gql `
    mutation transferStudent ($activity: Int, $classes: Int, $classtime: Int, $description: String, $docDate: String, $docNum: String, $program: Int, $school: Int, 
                                $section: Int, $status: Int, $statusExtra: Int, $student: Int) {
        transferStudent (activity: $activity, classes: $classes, classtime: $classtime, description: $description, docDate: $docDate, docNum: $docNum, program: $program, 
                        school: $school, section: $section, status: $status, statusExtra: $statusExtra, student: $student) {
            transfer {
                id
            }
        }
    }
`;

export const UPDATE_STUDENT = gql `
    mutation updateStudent ($section: Int, $activity: Int, $classtime: Int, $statusExtra: Int, $status: Int, $school: Int, $program: Int, $address: String, $birthCity: Int, $birthDistrict: Int, $birthdate: String,
                            $familyName: String, $id: ID, $joinDate: String, 
                            $joinSchoolyear: String, $name: String, $nationality: String, $phone: String,
                            $registerNo: String, $religion: String, $sex: String, $state: String, $studentCode: String, $surname: String, $username: String) {
        updateStudent (section: $section, activity: $activity, classtime: $classtime, address: $address, birthCity: $birthCity, birthDistrict: $birthDistrict, birthdate: $birthdate, 
                        familyName: $familyName, id: $id, joinDate: $joinDate, statusExtra: $statusExtra, status: $status, school: $school, program: $program,
                        joinSchoolyear: $joinSchoolyear, name: $name, nationality: $nationality, phone: $phone, 
                        registerNo: $registerNo, religion: $religion, sex: $sex, state: $state, studentCode: $studentCode, surname: $surname, username: $username, email: "test@test.mn") {
            student {
                id
            }
        }    
    }
`;

export const UPDATE_EVENT_TYPE = gql `
    mutation updateEventType ($color: String, $id: ID, $name: String) {
        updateEventType (color: $color, id: $id, name: $name) {
            eventType {
                name
            }
        }
    }
`;

export const UPDATE_EVENT = gql `
    mutation updateEvent ($content: String, $description: String, $endAt: String, $eventType: Int, $id: ID, $startAt: String, $title: String) {
        updateEvent (content: $content, description: $description, endAt: $endAt, eventType: $eventType, id: $id, startAt: $startAt, title: $title) {
            event {
                title
            }
        }
    }
`;