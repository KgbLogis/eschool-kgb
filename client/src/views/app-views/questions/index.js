import React from 'react';
import { useParams } from 'react-router-dom';
import Question from './question';

function Index(props) {

    const slug = useParams();

    return ( 
        <Question test={slug.test} /> 
    );
}

export default Index;