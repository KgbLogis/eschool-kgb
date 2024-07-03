import { gql } from "@apollo/client";

export const ALL_DIPLOM = gql`
    query allDiploms {
        allDiploms {
            id
            name
            mainMid
            mainBottom1
            mainBottom2
            mainBottom3
            mglMainMid
            mglMainBottom1
            mglMainBottom2
            mglMainBottom3
            mglMainBottom1Sub
            mglMainBottom2Sub
            mglMainBottom3Sub
            markBottom1
            markBottom2
            mglMarkBottom1
            mglMarkBottom2
        }
    }
`;

export const CREATE_DIPLOM = gql`
    mutation createDiplom (
        $mainBottom1: String!, 
        $mainBottom2: String!, 
        $mainBottom3: String!, 
        $mainMid: String!, 
        $markBottom1: String!, 
        $markBottom2: String!, 
        $mglMainBottom1: String!, 
        $mglMainBottom1Sub: String!, 
        $mglMainBottom2: String!, 
        $mglMainBottom2Sub: String!, 
        $mglMainBottom3: String!, 
        $mglMainBottom3Sub: String!, 
        $mglMainMid: String!, 
        $mglMarkBottom1: String!, 
        $mglMarkBottom2: String!, 
        $name: String!
    ) 
    {
        createDiplom (
            mainBottom1: $mainBottom1, 
            mainBottom2: $mainBottom2, 
            mainBottom3: $mainBottom3, 
            mainMid: $mainMid, 
            markBottom1: $markBottom1, 
            markBottom2: $markBottom2, 
            mglMainBottom1: $mglMainBottom1, 
            mglMainBottom1Sub: $mglMainBottom1Sub, 
            mglMainBottom2: $mglMainBottom2, 
            mglMainBottom2Sub: $mglMainBottom2Sub, 
            mglMainBottom3: $mglMainBottom3, 
            mglMainBottom3Sub: $mglMainBottom3Sub, 
            mglMainMid: $mglMainMid, 
            mglMarkBottom1: $mglMarkBottom1, 
            mglMarkBottom2: $mglMarkBottom2, 
            name: $name
        ) 
        {
            diplom 
            {
                name
            }
        }
    }
`;

export const UPDATE_DIPLOM = gql`
    mutation updateDiplom (
        $mainBottom1: String, 
        $mainBottom2: String, 
        $mainBottom3: String, 
        $mainMid: String, 
        $markBottom1: String, 
        $markBottom2: String, 
        $mglMainBottom1: String, 
        $mglMainBottom1Sub: String, 
        $mglMainBottom2: String, 
        $mglMainBottom2Sub: String, 
        $mglMainBottom3: String, 
        $mglMainBottom3Sub: String, 
        $mglMainMid: String, 
        $mglMarkBottom1: String, 
        $mglMarkBottom2: String, 
        $name: String,
        $id: ID
    ) 
    {
        updateDiplom (
            mainBottom1: $mainBottom1, 
            mainBottom2: $mainBottom2, 
            mainBottom3: $mainBottom3, 
            mainMid: $mainMid, 
            markBottom1: $markBottom1, 
            markBottom2: $markBottom2, 
            mglMainBottom1: $mglMainBottom1, 
            mglMainBottom1Sub: $mglMainBottom1Sub, 
            mglMainBottom2: $mglMainBottom2, 
            mglMainBottom2Sub: $mglMainBottom2Sub, 
            mglMainBottom3: $mglMainBottom3, 
            mglMainBottom3Sub: $mglMainBottom3Sub, 
            mglMainMid: $mglMainMid, 
            mglMarkBottom1: $mglMarkBottom1, 
            mglMarkBottom2: $mglMarkBottom2, 
            name: $name,
            id: $id
        ) 
        {
            diplom 
            {
                name
            }
        }
    }
`;

export const DELETE_DIPLOM = gql`
    mutation deleteDiplom ($id: ID) {
        deleteDiplom (id: $id) {
            diplom {
                name
            }
        }
    }
`;