import { gql } from '@apollo/client';

export const ALL_MARK = gql `
    query allMarks ($markBoard: Int!) {
        allMarks (markBoard: $markBoard) {
            id
            student {
                id
                familyName
                name
                studentCode
            }
            markRelSet {
                markVal
                markSetting {
                    id
                    name
                }
            }
            markBoard {
                subject {
                    subject
                }
            }
        }
    }
`;

export const CREATE_MARK = gql `
    mutation createMark ($section: Int, $studentCode: String, $markBoard: Int) {
        createMark (section: $section, studentCode: $studentCode, markBoard: $markBoard) {
            mark {
                id
            }
        }
    }
`;

export const DELETE_MARK = gql`
    mutation deleteMark ($id: ID) {
        deleteMark (id: $id) {
            mark {
                student {
                    id
                }
            }
        }
    }
`;

export const CREATE_MARK_REL = gql `
    mutation createMarkRel ($mark: Int, $markSetting: Int, $markVal: String) {
        createMarkRel (mark: $mark, markSetting: $markSetting, markVal: $markVal) {
            markRel {
                id
                markVal
                markSetting {
                    id
                    name
                }
            }
        }
    }
`;

export const ALL_MARK_RELS = gql `
    query allMarkRels ($mark: Int!) {
        allMarkRels (mark: $mark) {
            mark {
                student {
                    id
                    studentCode
                }
            }
            markSetting {
                name
                percentage
            }
            markVal
        }
    }
`;

export const ALL_MARK_PERCENTAGE = gql `
    query allMarkPercentages {
        allMarkPercentages {
            id
            type
            percentage
            diam
        }
    }
`;

export const CREATE_MARK_PERCENTAGE = gql `
    mutation createMarkPercentage ($diam: String, $percentage: Int, $type: String) {
        createMarkPercentage (diam: $diam, percentage: $percentage, type: $type) {
            markPercentage {
                type
            }
        }
    }
`;

export const UPDATE_MARK_PERCENTAGE = gql `
    mutation updateMarkPercentage ($diam: String, $percentage: Int, $type: String, $id: ID) {
        updateMarkPercentage (diam: $diam, percentage: $percentage, type: $type, id: $id) {
            markPercentage {
                type
            }
        }
    }
`;

export const DELETE_MARK_PERCENTAGE = gql `
    mutation deleteMarkPercentage ($id: ID) {
        deleteMarkPercentage (id: $id) {
            markPercentage {
                type
            }
        }
    }
`;

export const MARK_BOARD_BY_ID = gql `
    query markBoardById ($id: Int!) {
        markBoardById (id: $id) {
            id
            schoolyear {
                id
                schoolyear
            }
            subject {
                id
                subject
            }
            teacher {
                id
                name
            }
            startAt 
            endAt
            status
            createdAt
            updatedAt
        }
    }
`

export const ALL_MARK_BOARD = gql `
    query allMarkBoards ($offset: Int!, $limit: Int!, $filter: String) {
        count (appName: "mark", modelName: "Mark_board", filter: $filter) {
            count
        }
        allMarkBoards (offset: $offset, limit: $limit, filter: $filter) {
            id
            schoolyear {
                id
                schoolyear
            }
            subject {
                id
                subject
            }
            teacher {
                id
                name
            }
            startAt 
            endAt
            status
            createdAt
            updatedAt
        }
    }
`;

export const CREATE_MARK_BOARD_FROM_ROUTINE = gql `
    mutation createMarkBoardFromRoutine ($endAt: String, $routine: Int, $startAt: String, $status: String) {
        createMarkBoardFromRoutine (endAt: $endAt, routine: $routine, startAt: $startAt, status: $status) {
            markBoard {
                id
            }
        }
    }
`;

export const CREATE_MARK_BOARD = gql `
    mutation createMarkBoard ($endAt: String, $schoolyear: Int, $startAt: String, $status: String, $subject: Int, $teacher: Int) {
        createMarkBoard (endAt: $endAt, schoolyear: $schoolyear, startAt: $startAt, status: $status, subject: $subject, teacher: $teacher) {
            markBoard {
                id
            }
        }
    }
`;

export const UPDATE_MARK_BOARD = gql `
    mutation updateMarkBoard ($endAt: String, $schoolyear: Int, $startAt: String, $status: String, $subject: Int, $teacher: Int, $id: ID) {
        updateMarkBoard (endAt: $endAt, schoolyear: $schoolyear, startAt: $startAt, status: $status, subject: $subject, teacher: $teacher, id: $id) {
            markBoard {
                id
            }
        }
    }
`;

export const DELETE_MARK_BOARD = gql `
    mutation deleteMarkBoard ($id: ID) {
        deleteMarkBoard (id: $id) {
            markBoard {
                startAt
            }
        }
    }
`;

export const ALL_MARK_SETTING = gql `
    query allMarkSettings {
        allMarkSettings {
            id
            name
            percentage
            createdAt
            updatedAt
        }
    }
`;

export const CREATE_MARK_SETTING = gql `
    mutation createMarkSetting ($name: String, $percentage: Int) {
        createMarkSetting (name: $name, percentage: $percentage) {
            markSetting {
                id
            }
        }
    }
`;

export const UPDATE_MARK_SETTING = gql `
    mutation updateMarkSetting ($name: String, $percentage: Int, $id: ID) {
        updateMarkSetting (name: $name, percentage: $percentage, id: $id) {
            markSetting {
                id
            }
        }
    }
`;

export const DELETE_MARK_SETTING = gql `
    mutation deleteMarkSetting($id: ID) {
        deleteMarkSetting (id: $id) {
            markSetting {
                name
            }
        }
    }
`