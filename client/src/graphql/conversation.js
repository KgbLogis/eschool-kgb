import { gql } from "@apollo/client";

export const MY_INBOX = gql`
    query myInbox ($filter: String) {
        myInbox (filter: $filter) {
            id
            sender {
                firstName
                lastName
                groups {
                    name
                }
            }
            recipient {
                firstName
                lastName
            }
            subject
            body
            createdAt
        }
    }
`

export const MY_SENT = gql`
    query mySent ($filter: String) {
        mySent (filter: $filter) {
            id
            sender {
                firstName
                lastName
                groups {
                    name
                }
            }
            recipient {
                firstName
                lastName
            }
            subject
            body
            createdAt
        }
    }
`

export const CREATE_CONVERSATION = gql`
    mutation createConversationReply ($body: String, $groups: [Int], $recipient: Int, $subject: String, $files: [Upload]) {
        createConversation (body: $body, groups: $groups, recipient: $recipient, subject: $subject, files: $files) {
            conversation {
                id
            }
        }
    }
`

export const DELETE_CONVERSATION = gql`
    mutation deleteConversation ($deleteType: ConversationDeleteType, $id: ID) {
        deleteConversation (deleteType: $deleteType, id: $id) {
            conversation {
                id
            }
        }
    }
`

export const CONVERSATION_BY_ID = gql`
    query conversationById ($id: ID!) {
        conversationById (id: $id) {
            sender {
                firstName
                lastName
                student {
                    familyName
                    name
                }
                teacher {
                    familyName
                    name
                }
                employee {
                    familyName
                    name
                }
                groups {
                    name
                }
                isTeacher
                isEmployee
                isStudent
            }
            recipient {
                firstName
                lastName
            }
            subject
            body
            createdAt
        }
    }
` 

export const ALL_CONVERSATION_FILES = gql`
    query allConversationFiles ($conversation: ID!) {
        allConversationFiles (conversation: $conversation) {
            file
        }
    }
`

export const ALL_CONVERSATION_REPLY = gql`
    query allConversationReply ($conversation: ID!) {
        allConversationReply (conversation: $conversation) {
            body
            user {
                firstName
                lastName
            }
            conversationreplyfileSet {
                file
            }
            createdAt
        }
    }
`


export const CREATE_CONVERSATION_REPLY = gql`
    mutation createConversationReply ($conversation: ID, $body: String, $files: [Upload]) {
        createConversationReply (conversation: $conversation, body: $body, files: $files) {
            conversationReply {
                id
            }
        }
    }
`