import { gql } from '@apollo/client';

export const ALL_LIVES = gql `
    query allLives ($offset: Int!, $limit: Int!, $filter: String) {
        count (appName: "live", modelName: "Live", filter: $filter) {
            count
        }
        allLives (offset: $offset, limit: $limit, filter: $filter) {
            id
            title
            date
            duration
            description
            status
            type
            section {
                id
                section
            }
            password
            teacher {
                id
                name
            }
            password
        }
    }
`;

export const CREATE_LIVE = gql `
    mutation createLive ($date: DateTime, $description: String, $duration: Int, $status: String, $teacher: Int, $title: String, $section: Int) {
        createLive (date: $date, description: $description, duration: $duration, status: $status, teacher: $teacher, title: $title, section: $section) {
            live {
                id
            }
        }
    }
`;

export const UPDATE_LIVE = gql `
    mutation updateLive ($date: DateTime, $description: String, $duration: Int, $id: ID, $status: String, $teacher: Int, $title: String, $section: Int) {
        updateLive (date: $date, description: $description, duration: $duration, id: $id, status: $status, teacher: $teacher, title: $title, section: $section) {
            live {
                id
            }
        }
    }
`;

export const DELETE_LIVE = gql `
    mutation deleteLive ($id: ID) {
        deleteLive (id: $id) {
            live {
                title
            }
        }
    }
`;

export const GET_LIVE_URL = gql `
    query getLiveurl ($liveId: Int) {
        getLiveurl (liveId: $liveId) {
            url
            password
        }
    }
`;
