import { Col, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import TableRow from './table-row'

const SchoolYearTable = ({ columns, data, settings, credit, setNumTotalDiam }) => {

    const [yearTotalCredit, setYearTotalCredit] = useState(0);
    const [yearTotalDiam, setYearTotalDiam] = useState(0);

    const setTotalCredit = credit.setTotalCredit

    const [numDiam, setNumDiam] = useState(0);

    useEffect(() => {
        setYearTotalDiam(numDiam / yearTotalCredit)
    }, [numDiam, yearTotalCredit])

    useEffect(() => {
        if (yearTotalDiam !== 0 && yearTotalCredit !== 0 && !isNaN(yearTotalDiam)) {
            setNumTotalDiam(prevDiam => prevDiam + (yearTotalDiam * Math.floor(yearTotalCredit)))
        }
    }, [setNumTotalDiam, yearTotalCredit, yearTotalDiam])
    
    useEffect(() => {
        const addCredit = async() => {
            setTotalCredit(prevCredit => Math.floor(prevCredit) + Math.floor(yearTotalCredit))
        }
        addCredit();
    }, [setTotalCredit, yearTotalCredit])
    

    return (
        <Row className="mt-4">
            <Col span={24}>
                 <table style={{ width: '100%' }} >
                    <thead>
                        <tr >
                            { columns.map((col, index) => (
                                <th  key={index} >{col.title}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map(function (item, index) 
                            {   
                                return (
                                    <TableRow 
                                        key={index} 
                                        credit={{ yearTotalCredit, setYearTotalCredit }} 
                                        setNumDiam={setNumDiam} 
                                        settings={settings} 
                                        data={item} 
                                    />
                                )
                            })
                        }
                    </tbody>
                </table> 
                <div style={{ border: '1px solid black', borderTop: 'none' }}>
                    <Row gutter={[8, 8]}>
                        <Col span={8}>
                            <span style={{ marginLeft: '5px' }}> НИЙТ</span> 
                        </Col>
                        <Col span={8} style={{ textAlign: 'center' }}> 
                            <span>Кредит: {yearTotalCredit}</span> 
                        </Col>
                        <Col span={8} style={{ textAlign: 'end' }} > 
                            <span style={{ marginRight: '5px' }}>Үн.Голч: {yearTotalDiam.toFixed(2)}</span> 
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    )
}

export default SchoolYearTable