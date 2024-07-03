import { useLazyQuery } from "@apollo/client";
import { ME } from "graphql/user";
import React, { createContext, useState, useEffect } from "react";
import {
	AUTH_TOKEN,
} from 'redux/constants/Auth';
import Loading from 'components/shared-components/Loading';

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    
    const [user, setUser] = useState();
    
    const [currentUser, { refetch }] = useLazyQuery(ME, {
        onCompleted: data => {
            setUser(data.me)
            if (data.me === null) {
                localStorage.clear()
            }
        }
    });

    const token = localStorage.getItem(AUTH_TOKEN)

    useEffect(() => {
        const fetchUser  = () => {
            currentUser();
        }
        if (token) {
            fetchUser();
        }
        return () => {
        
        };
    }, [currentUser, token]);

    if (!user && token) {
        return <Loading cover='content' />
    }

    return (
        <UserContext.Provider value={{ 
            user: user,
            refetch: refetch
         }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserContextProvider };