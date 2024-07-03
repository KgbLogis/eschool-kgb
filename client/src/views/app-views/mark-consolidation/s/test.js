import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Form, Select, Row, Col } from 'antd';
import { useQuery, useLazyQuery, gql } from '@apollo/client';
import IntlMessage from "components/util-components/IntlMessage";
import { ALL_SCHOOL_YEAR, SECTION_BY_CLASSES, ALL_PROGRAMS } from 'graphql/all';
import { MARK_CON_QUERY } from 'graphql/report';
import { SELECT_CLASSES } from 'graphql/select';

const { Option } = Select;

const MarkConsolidationTable = (props) => {

    const [list, setList] = useState([]);

    const [student, setStudent] = useState([]);
    const [subject, setSubject] = useState([]);
    const [classesData, setClassesData] = useState([]);
    const [sectionData, setSectionData] = useState([]);
    const [programsData, setProgramsData] = useState([]);
    const [schoolYear, setSchoolYear] = useState();

    const [studentIndex, setStudentIndex] = useState();
    const [subjectIndex, setSubjectIndex] = useState();

    const [isLoading, setIsLoading] = useState(true);
    const [isMarkConFinish, setIsMarkConFinish] = useState(false);

    const [markConQuery, setMarkConQuery] = useState(undefined);

    const [fetchTest] = useLazyQuery(gql`
        query markCon {
            ${markConQuery}
        }
    `, {
        onCompleted: data => {
            console.log('com', data);
        },
        onError: error => {
            console.log('err', error.data);
        }
    })

	const { data: schoolyearData } = useQuery(ALL_SCHOOL_YEAR);

    const [testFetch] = useLazyQuery(MARK_CON_QUERY, {
        onCompleted: data => {
            const generateQuery = async(subjects, students) => {
                let query = ""

                await subjects.map((subject) => (
                    students.map((student) => (
                        query += `${student.studentCode}_${subject.subjectId}: markCon (subject: ${subject.subjectId}, schoolyear: ${schoolYear}, student: ${student.studentId}) {
                            percentage
                            type
                            diam
                        }`
                    ))
                ))

                return query
            }

            generateQuery(data.markconSubject, data.markconStudent).then(response => {
                return setMarkConQuery(response);
            })
        }
    })

    useEffect(() => {
        if (markConQuery !== undefined) {
            fetchTest();
        }
    }, [fetchTest, markConQuery])
    

    useQuery(ALL_PROGRAMS, {
        onCompleted: result => {
            setProgramsData(result.allPrograms);
        }
	});

    const [fetchClasses] = useLazyQuery(SELECT_CLASSES, {
        onCompleted: result => {
            setClassesData(result.allClassess)
        }
    })

    const [fetchSections] = useLazyQuery(SECTION_BY_CLASSES, {
        onCompleted: result => {
            setSectionData(result.sectionsByClasses);
        }
    })
    
    const [form] = Form.useForm();

	const tableColumns = [
        {
            title: '№',
            key: 'index',
            render: (text, record, index) => ++index,
        },
		{
			key: 'familyName',
			title: 'Эцэг/эхийн нэр',
			dataIndex: 'familyName',
		},
		{
			key: 'name',
            title: 'Нэр',
            dataIndex: 'name', 
		},
		{
			key: 'studentCode',
            title: 'Оюутны код',
            dataIndex: 'studentCode', 
		},
		{
			key: 'registerNo',
            title: 'Регистр',
            dataIndex: 'registerNo', 
		},
	];

    subject?.map(function(item) {
        return tableColumns.push({
            width: '25px',
            key: `${item.subjectCode}`,
            title: `${item.subject} - ${item.subjectCode} (${item.subjectCredit})`,
            dataIndex: ['markCon', `${item.subjectId}`, 'percentage'], 
        })
    })

    tableColumns.push(
        {
            key: `A`,
            title: `A`,
            dataIndex: 'A', 
        },
        {
            key: `B`,
            title: `B`,
            dataIndex: 'B', 
        },
        {
            key: `C`,
            title: `C`,
            dataIndex: 'C', 
        },
        {
            key: `D`,
            title: `D`,
            dataIndex: 'D', 
        },
        {
            key: `F`,
            title: `F`,
            dataIndex: 'F', 
        },
        {
            key: `totalSubject`,
            title: `Судалсан хичээлийн тоо`,
            dataIndex: 'totalSubject', 
        },
        {
            key: `totalCredit`,
            title: `Судалсан кредит`,
            dataIndex: 'totalCredit', 
        },
        {
            key: `avgPercentage`,
            title: `Дундаж дүн`,
            dataIndex: 'avgPercentage', 
        },
        {
            key: `avgDiam`,
            title: `Голч`,
            dataIndex: 'avgDiam', 
        },
        
    )
    const onFinish = (values) => {
        if (!values.schoolyear) {
            values.schoolyear = 0
        }
        testFetch({ variables: values });
        form.resetFields();
        setList([]);
    }

	return (
		<>
            <Card>
                <Form
                    layout='vertical'
                    form={form}
                    onFinish={onFinish}
                >
                    <Row gutter={[16, 16]}>
                        <Col span={12} >
                            <Form.Item 
                                label={<IntlMessage id="schoolyear" />}
                                name='schoolyear'
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="form.required" />
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    // onChange={() => form.resetFields()}
                                    onSelect={(e) => setSchoolYear(e)}
                                >
                                    { schoolyearData?.allSchoolyears.map((schoolyear, index) => (
                                        <Option key={index} value={schoolyear.id} >{schoolyear.schoolyear} / {schoolyear.season}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                shouldUpdate={(prevValues, currentValues) => prevValues.program !== currentValues.program}
                            >
                                {({ getFieldValue }) => {
                                    return getFieldValue('program') ? (
                                        <Form.Item 
                                            label={<IntlMessage id="classes" />} 
                                            name='classes'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: <IntlMessage id="form.required" />
                                                },
                                            ]}
                                        >
                                            <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                onSelect={(e) => fetchSections({ variables: { classes: e} })}
                                            >
                                                { classesData.map((classes, index) => (
                                                    <Option key={index} value={classes.id} >{classes.classes}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    ) : null;
                                }}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item 
                                label={<IntlMessage id="program" />} 
                                name='program'
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="form.required" />
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    onSelect={(e) => fetchClasses({ variables: { program: e, offset: 0, limit: 0, filter: '' } })}
                                >
                                    { programsData.map((program, index) => (
                                        <Option key={index} value={program.id} >{program.program}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                shouldUpdate={(prevValues, currentValues) => prevValues.classes !== currentValues.classes}
                            >
                                {({ getFieldValue }) => {
                                    return getFieldValue('classes') ? (
                                        <Form.Item 
                                            label={<IntlMessage id="section" />} 
                                            name='section'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: <IntlMessage id="form.required" />
                                                },
                                            ]}
                                        >
                                            <Select
                                                showSearch
                                                filterOption={(input, option) =>
                                                    option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                { sectionData.map((section, index) => (
                                                    <Option key={index} value={section.id} >{section.section}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    ) : null;
                                }}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        shouldUpdate={(prevValues, currentValues) => prevValues.section !== currentValues.section}
                    >
                        {({ getFieldValue }) => {
                            return getFieldValue('section') ? (
                                <Form.Item>
                                    <Button type="primary" htmlType="submit"><IntlMessage id="show" /></Button>
                                </Form.Item>
                            ) : null;
                        }}
                    </Form.Item>
                </Form>
            </Card>
            { isLoading === false &&(
                <Card>
                    <div className="table-responsive">
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
                                        if (element.markCon.hasOwnProperty(elm.subjectId) && element.markCon[elm.subjectId].type?.includes("A")) {
                                            ++count
                                        }
                                    });
                                    return (count)
                                })

                                const totalB = subject?.map(function(elm, index) {
                                    let count = 0
                                    pageData.forEach(element => {
                                        if (element.markCon.hasOwnProperty(elm.subjectId) && element.markCon[elm.subjectId].type?.includes("B")) {
                                            ++count
                                        }
                                    });
                                    return (count)
                                })

                                const totalC = subject?.map(function(elm, index) {
                                    let count = 0
                                    pageData.forEach(element => {
                                        if (element.markCon.hasOwnProperty(elm.subjectId) && element.markCon[elm.subjectId].type?.includes("C")) {
                                            ++count
                                        }
                                    });
                                    return (count)
                                })

                                const totalD = subject?.map(function(elm, index) {
                                    let count = 0
                                    pageData.forEach(element => {
                                        if (element.markCon.hasOwnProperty(elm.subjectId) && element.markCon[elm.subjectId].type?.includes("D")) {
                                            ++count
                                        }
                                    });
                                    return (count)
                                })

                                const totalF = subject?.map(function(elm, index) {
                                    let count = 0
                                    pageData.forEach(element => {
                                        if (element.markCon.hasOwnProperty(elm.subjectId) && element.markCon[elm.subjectId].type?.includes("F")) {
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
                                            element.markCon[elm.subjectId].type?.includes("A") && ++count
                                            element.markCon[elm.subjectId].type?.includes("B") && ++count
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
                                            element.markCon[elm.subjectId].type?.includes("A") && ++count
                                            element.markCon[elm.subjectId].type?.includes("B") && ++count
                                            element.markCon[elm.subjectId].type?.includes("C") && ++count
                                            element.markCon[elm.subjectId].type?.includes("D") && ++count
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
                                                    {elm.toFixed(2)}
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
                                                    {elm.toFixed(2)}
                                                </Table.Summary.Cell>
                                            ))}
                                            <Table.Summary.Cell colSpan={9} />
                                        </Table.Summary.Row>
                                    </>
                                );
                            }}
                        />
                    </div>
                </Card>
            )}
		</>
	)
}

export default MarkConsolidationTable
