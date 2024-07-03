import { gql } from '@apollo/client';

export const ALL_ROUTINE_TIMES = gql`
    query allRoutineTimes ($date: Date){
        allRoutineTimes (date: $date) {
            id
            type
            time
            date
            room
            routine {
                classes {
                    classes
                    program {
                        program
                    }
                }
                section {
                    section
                }
                subject {
                    subject
                    content
                }
                teacher {
                    familyName
                    name
                }
            }
        }
    }
`;

export const ALL_ROUTINES = gql`
    query routines {
        routines {
            id
            schoolyear {
                id
                schoolyear
            }
            program {
                id
                program
            }
            classes {
                id
                classes
                program {
                    program
                }
            }
            section {
                id
                section
            }
            subject {
                id
                subject
                # subjectMgl
            }
            teacher {
                id
                familyName
                name
            }
        }
    }
`

export const DELETE_ROUTINE_STUDENT = gql`
    mutation deleteRoutineStudent ($id: ID) {
        deleteRoutineStudent (id: $id) {
            routineStudent {
                routine
            }
        }
    }
`;