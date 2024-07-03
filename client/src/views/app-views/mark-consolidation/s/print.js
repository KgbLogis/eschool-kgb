import { Table } from 'antd';
import React from 'react';

const PrintCard = React.forwardRef((tableColumns, list, subject, ref) => {

    return (
        <div ref={ref} >
            <style>
                {"table, th, td{border: 1px solid black }"}
            </style>
            <div className="page-break" >
                <Table
                    pagination={false}
                    columns={tableColumns} 
                    size="small"
                    dataSource={list}
                    rowKey='studentId'  
                    bordered
                    summary={pageData => {
                        const totalA = subject?.map(function(elm, index) {
                            let count = 0
                            pageData.forEach(element => {
                                if (element.markCon.hasOwnProperty(elm.subjectId) && element.markCon[elm.subjectId].type.includes("A")) {
                                    ++count
                                }
                            });
                            return (count)
                        })
                        const totalB = subject?.map(function(elm, index) {
                            let count = 0
                            pageData.forEach(element => {
                                if (element.markCon.hasOwnProperty(elm.subjectId) && element.markCon[elm.subjectId].type.includes("B")) {
                                    ++count
                                }
                            });
                            return (count)
                        })
                        const totalC = subject?.map(function(elm, index) {
                            let count = 0
                            pageData.forEach(element => {
                                if (element.markCon.hasOwnProperty(elm.subjectId) && element.markCon[elm.subjectId].type.includes("C")) {
                                    ++count
                                }
                            });
                            return (count)
                        })
                        const totalD = subject?.map(function(elm, index) {
                            let count = 0
                            pageData.forEach(element => {
                                if (element.markCon.hasOwnProperty(elm.subjectId) && element.markCon[elm.subjectId].type.includes("D")) {
                                    ++count
                                }
                            });
                            return (count)
                        })
                        const totalF = subject?.map(function(elm, index) {
                            let count = 0
                            pageData.forEach(element => {
                                if (element.markCon.hasOwnProperty(elm.subjectId) && element.markCon[elm.subjectId].type.includes("F")) {
                                    ++count
                                }
                            });
                            return (count)
                        })
                        
                        const totalCountStudent = subject?.map(function(elm, index) {
                            let count = 0
                            pageData.forEach(element => {
                                if (element.markCon.hasOwnProperty(elm.subjectId)) {
                                    ++count
                                }
                            });
                            return (count)
                        })
                        const totalQuality = subject?.map(function(elm, index) {
                            let count = 0
                            pageData.forEach(element => {
                                if (
                                    element.markCon.hasOwnProperty(elm.subjectId)
                                ) {
                                    element.markCon[elm.subjectId].type.includes("A") && ++count
                                    element.markCon[elm.subjectId].type.includes("B") && ++count
                                }
                            });
                            
                            return ((count * 100) / pageData.length)
                        })
                        const totalSuccess = subject?.map(function(elm, index) {
                            let count = 0
                            pageData.forEach(element => {
                                if (
                                    element.markCon.hasOwnProperty(elm.subjectId)
                                ) {
                                    element.markCon[elm.subjectId].type.includes("A") && ++count
                                    element.markCon[elm.subjectId].type.includes("B") && ++count
                                    element.markCon[elm.subjectId].type.includes("C") && ++count
                                    element.markCon[elm.subjectId].type.includes("D") && ++count
                                }
                            });
                            
                            return ((count / pageData.length) * 100)
                        })
                
                        return (
                            <>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell 
                                        colSpan={5}
                                    >
                                        A
                                    </Table.Summary.Cell>
                                    { totalA.map(elm => (
                                        <Table.Summary.Cell>
                                            {elm}
                                        </Table.Summary.Cell>
                                    ))}
                                    <Table.Summary.Cell colSpan={9} />
                                </Table.Summary.Row>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell 
                                        colSpan={5}
                                    >
                                        B
                                    </Table.Summary.Cell>
                                    { totalB.map(elm => (
                                        <Table.Summary.Cell>
                                            {elm}
                                        </Table.Summary.Cell>
                                    ))}
                                    <Table.Summary.Cell colSpan={9} />
                                </Table.Summary.Row>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell 
                                        colSpan={5}
                                    >
                                        C
                                    </Table.Summary.Cell>
                                    { totalC.map(elm => (
                                        <Table.Summary.Cell>
                                            {elm}
                                        </Table.Summary.Cell>
                                    ))}
                                    <Table.Summary.Cell colSpan={9} />
                                </Table.Summary.Row>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell 
                                        colSpan={5}
                                    >
                                        D
                                    </Table.Summary.Cell>
                                    { totalD.map(elm => (
                                        <Table.Summary.Cell>
                                            {elm}
                                        </Table.Summary.Cell>
                                    ))}
                                    <Table.Summary.Cell colSpan={9} />
                                </Table.Summary.Row>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell 
                                        colSpan={5}
                                    >
                                        F
                                    </Table.Summary.Cell>
                                    { totalF.map(elm => (
                                        <Table.Summary.Cell>
                                            {elm}
                                        </Table.Summary.Cell>
                                    ))}
                                    <Table.Summary.Cell colSpan={9} />
                                </Table.Summary.Row>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell 
                                        colSpan={5}
                                    >
                                        Дүгнэгдсэн оюутны тоо
                                    </Table.Summary.Cell>
                                    { totalCountStudent?.map(elm => (
                                        <Table.Summary.Cell>
                                            {elm}
                                        </Table.Summary.Cell>
                                    ))}
                                    <Table.Summary.Cell colSpan={9} />
                                </Table.Summary.Row>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell 
                                        colSpan={5}
                                    >
                                        Чанар /%/
                                    </Table.Summary.Cell>
                                    { totalQuality?.map(elm => (
                                        <Table.Summary.Cell>
                                            {elm}
                                        </Table.Summary.Cell>
                                    ))}
                                    <Table.Summary.Cell colSpan={9} />
                                </Table.Summary.Row>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell 
                                        colSpan={5}
                                    >
                                        Амжилт /%/
                                    </Table.Summary.Cell>
                                    { totalSuccess?.map(elm => (
                                        <Table.Summary.Cell>
                                            {elm}
                                        </Table.Summary.Cell>
                                    ))}
                                    <Table.Summary.Cell colSpan={9} />
                                </Table.Summary.Row>
                            </>
                        );
                    }}
                />
            </div>
        </div>
    )
});

export default PrintCard