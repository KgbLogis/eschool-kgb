import { Result } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Form from './form';

const Index = () => {

    const location = useLocation();

    const [type, setType] = useState('');
    const [data, setData] = useState({});

    useEffect(() => {
        if (location.state) {
            setType(location.state.type);
            setData(location.state.data);
        }
    }, [location])
    
    if (location.state === undefined) {
        return (
            <Result
                status="404"
                title="404"
                subTitle="Уучлаарай, таны зочилсон хуудас байхгүй байна."
            />
        );
    }

    return (
        <>
            <Form type={type} diplom={data}/>
        </>
    )
}

export default Index;
