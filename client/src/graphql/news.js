import { gql } from "@apollo/client";

export const ALL_NEWS = gql`
    query allNews ($offset: Int) {
        allNews (offset: $offset) {
            id
            title
            description
            image
            createdAt
        }
    }
`

export const NEWS_BY_ID = gql`
    query newsById($id: ID!) {
        newsById(id: $id) {
            id
            title
            description
            image
            createdAt
        }
    }
`

export const CREATE_NEWS = gql`
    mutation createNews($title: String, $description: String, $image: Upload) {
        createNews(title: $title, description: $description, image: $image) {
            news {
                id
                title
                description
                image
                createdAt
            }
        }
    }
`

export const UPDATE_NEWS = gql`
    mutation updateNews($id: ID, $title: String, $description: String, $image: Upload) {
        updateNews(id: $id, title: $title, description: $description, image: $image) {
            news {
                id
                title
                description
                image
                createdAt
            }
        }
    }
`

export const DELETE_NEWS = gql`
    mutation deleteNews($id: ID) {
        deleteNews(id: $id) {
            news {
                title
            }
        }
    }
`