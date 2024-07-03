import { gql } from '@apollo/client';

export const ALL_PROGRAM_SUBJECT_BY_PROGRAM = gql`
    query allProgramSubjectByProgram ($id: Int!) {
        allProgramSubjectByProgram (id: $id) {
            id
            program {
                id
                program
            }
            subject {
                id
                subject
                content
                createUserid {
                    firstName
                    lastName
                }
            }
        }
    }
`;

export const PROGRAM_BY_ID = gql`
    query programById ($id: Int!) {
        programById (id: $id) {
            id
        }
    }

`;

export const CREATE_PROGRAM_SUBJECT = gql`
    mutation createProgramSubject ($program: Int, $subject: Int) {
        createProgramSubject (program: $program, subject: $subject) {
            programSubject {
                id
            }
        }
    }
`;

export const DELETE_PROGRAM_SUBJECT = gql`
    mutation deleteProgramSubject ($id: ID) {
        deleteProgramSubject (id: $id) {
            programSubject {
                program {
                    program
                }
            }
        }
    }
`;
