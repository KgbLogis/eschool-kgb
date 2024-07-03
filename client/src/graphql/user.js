import { gql } from "@apollo/client";

export const ME = gql `
    query me {
        me {
            pk
            groups {
                name
            }
            isStaff
            isStudent
            isTeacher
            email
            firstName
            lastName
            student {
                isPaid
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
            teacher {
                teacherCode
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
                    name
                }
                birthDistrict {
                    name
                }
                status {
                    name
                }
                school {
                    name
                }
                subSchool {
                    name
                }
            }
        }
    }
`;

export const CHANGE_PASSWORD = gql `
    mutation passwordChange ($oldPassword: String!, $newPassword1: String!, $newPassword2: String!) {
        passwordChange (oldPassword: $oldPassword, newPassword1: $newPassword1, newPassword2: $newPassword2) {
            success
            errors
            token
        }
    }
`;

export const MY_PROFILE = gql `
    query accountSelf {
        accountSelf {
            email
            familyName
            name
            phone
            phone2
            address
        }
    }
`;

export const UPDATE_PROFILE = gql`
    mutation updateMyAccount ($address: String, $email: String, $familyName: String, $name: String, $phone: String, $phone2: String) {
        updateMyAccount (address: $address, email: $email, familyName: $familyName, name: $name, phone: $phone, phone2: $phone2) {
            account {
                name
            }
        }
    }
`;

export const CHANGE_USER_PASSWORD = gql`
    mutation changeUserPassword ($id: Int, $password: String) {
        changeUserPassword (id: $id, password: $password) {
            user {
                id
            }
        }
    }
`