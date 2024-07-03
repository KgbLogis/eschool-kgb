import { useQuery } from '@apollo/client';
import { MARK_PERCENTAGE } from 'graphql/report';
import React, { useEffect, useState } from 'react'

const centerStyle = { textAlign: 'center' };

const TableRow = ({ data, settings, credit, setNumDiam }) => {

    const [percentage, setPercentage] = useState({});

    const setYearTotalCredit = credit.setYearTotalCredit

    useQuery(MARK_PERCENTAGE, {
        variables: { percentage: data.numMarkVal },
        onCompleted: response => {
            setPercentage(response.markPercentage);
        }
    })

    useEffect(() => {
        const addCredit = async() => {
            setYearTotalCredit(prevCredit => Math.floor(prevCredit) + Math.floor(data.credit))
        }
        addCredit();
    }, [data.credit, setYearTotalCredit])

    useEffect(() => {
        const numDiam = async() => {
            setNumDiam(prevDiam => prevDiam +(percentage.diam * Math.floor(data.credit)))
        }
        if (percentage.diam) { 
        }
        if (percentage.diam && data.credit !== 0) {
            numDiam();
        }
    }, [data.credit, percentage.diam, setNumDiam])
    
    

    return (
        <tr>
            <td style={centerStyle}>{data.schoolYear}</td>
            <td style={centerStyle}>{data.season}</td>
            <td style={centerStyle}>{data.subjectCode}</td>
            <td>{data.subject}</td>
            <td style={centerStyle}>{Math.floor(data.credit)}</td>
            { settings.map((setting, idx) => (
                <td style={centerStyle} key={idx} >{data.markVal[setting.name]?.value}</td>
            ))}
            <td style={centerStyle}>{data.numMarkVal}</td>
            <td style={{ textAlign: 'center', width: '50px' }}>{percentage.type}</td>
            <td style={{ textAlign: 'center', width: '100px' }}>{percentage.diam}</td>
        </tr>        
    )
}

export default TableRow