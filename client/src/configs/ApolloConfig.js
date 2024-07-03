import { ApolloClient, from, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from '@apollo/client/link/context';
import { API_BASE_URL } from "./AppConfig";
import {
    AUTH_TOKEN,
} from 'redux/constants/Auth';
import { message } from "antd";

const httpLink = createUploadLink({
    uri: API_BASE_URL,
});

const errorLink = onError(({ graphQLErrors, networkError, response, operation }) => {
    // if (networkError) {
    //     if (networkError.message === 'NetworkError when attempting to fetch resource.') {
    //         message.error('Сервер холбодоно уу')
    //     }
    // } else if (graphQLErrors) {
    //     if (graphQLErrors[0]['message'] === "You do not have permission to perform this action") {
    //         message.warning('Хандах эрх байхгүй байна!')
    //     } else if (graphQLErrors[0]['message'].includes('Expected a value of type')) {
    //         message.warning('Алдаатай өгөгдөлтэй байна')
    //     } else if (operation.operationName !== 'markCon') {
    //         message.error('Алдаа гарлаа')
    //     }
    // }
});

const authLink = setContext((_, { headers }) => {

    const token = localStorage.getItem(AUTH_TOKEN);

    return {
        headers: {
            ...headers,
            authorization: token ? `JWT ${token}` : "",
        }
    }
});

export const client = new ApolloClient({
    link: from([errorLink, authLink.concat(httpLink)]),
    cache: new InMemoryCache({
        addTypename: false
    }),
});