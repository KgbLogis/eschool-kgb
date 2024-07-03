import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Form, Select, Row, Col } from 'antd';
import { useQuery, useLazyQuery } from '@apollo/client';
import IntlMessage from "components/util-components/IntlMessage";
import { ALL_SCHOOL_YEAR, SECTION_BY_CLASSES, ALL_PROGRAMS } from 'graphql/all';
import { MARK_CON_SUBJECT, MARK_CON_STUDENT, MARK_CON } from 'graphql/report';
import { SELECT_CLASSES } from 'graphql/select';

const { Option } = Select;

const MarkConsolidationTable = (props) => {

    const [list, setList] = useState([]);
    const [student, setStudent] = useState(undefined);
    const [subject, setSubject] = useState(undefined);
    const [classesData, setClassesData] = useState([]);
    const [sectionData, setSectionData] = useState([]);
    const [programsData, setProgramsData] = useState([]);
    const [schoolYear, setSchoolYear] = useState();

    const [studentIndex, setStudentIndex] = useState();
    const [subjectIndex, setSubjectIndex] = useState();

    const [isLoading, setIsLoading] = useState(true);
    const [isMarkConFinish, setIsMarkConFinish] = useState(false);

	const { data: schoolyearData } = useQuery(ALL_SCHOOL_YEAR, {
	});

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
    const [fetchMarkConSubject] = useLazyQuery(MARK_CON_SUBJECT, {
        fetchPolicy: 'network-only',
        onCompleted: result => {
            setSubject(result.markconSubject)
        }
    })

    const [fetchMarkConStudent] = useLazyQuery(MARK_CON_STUDENT, {
        fetchPolicy: 'network-only',
        onCompleted: result => {
            const newData = result.markconStudent.map(std => ({
                familyName: std.familyName,
                name: std.name,
                registerNo: std.registerNo,
                studentCode: std.studentCode,
                studentId: std.studentId,
                markCon: []
            }))
            setStudent(newData)
        }
    })
    const [fetchMarkCon, { networkStatus }] = useLazyQuery(MARK_CON, {
        onCompleted: result => {
            student[studentIndex].markCon = {
                ...student[studentIndex].markCon,
                [subject[subjectIndex].subjectId]: {
                    ...result.markCon, ...subject[subjectIndex]
                }
            }
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
        fetchMarkConSubject({ variables: values })
        fetchMarkConStudent({ variables: values })
        // testFetch({ variables: values });
        form.resetFields();
        setList([]);
    }

    useEffect(() => {

        if (subject && student) {
            student.forEach(function (std, stdIn) {
                setTimeout(function(){
                    setStudentIndex(stdIn)
                    subject.forEach(function (sub, subIn) {
                        setTimeout(function(){
                            if (subject.length === subIn + 1) {
                                setIsMarkConFinish(true)
                            }
                            setSubjectIndex(subIn)
                            fetchMarkCon({ variables: { subject: sub.subjectId, schoolyear: schoolYear, student: std.studentId } })
                        }, subIn * 500);
                    })
                }, stdIn * 1000)
            })
        }

    }, [fetchMarkCon, student, subject, schoolYear])

    useEffect(() => {

        const mergeData = () => {
            
            const fixedData = student.map(function (item, index) {

                let A = 0, B = 0, C = 0, D = 0, F = 0
                let totalCredit = 0;
                let totalSubject = 0;
                let avgDiam = 0;
                let numAvgDiam = 0;
                let avgPercentage = 0;
                let numAvgPercentage = 0;

                subject.forEach(sub => {
                    if (item.markCon.hasOwnProperty(sub.subjectId)) {
                        if (item.markCon[sub.subjectId].type) {
                            item.markCon[sub.subjectId].type.includes("A") && ++A
                            item.markCon[sub.subjectId].type.includes("B") && ++B
                            item.markCon[sub.subjectId].type.includes("C") && ++C
                            item.markCon[sub.subjectId].type.includes("D") && ++D
                            item.markCon[sub.subjectId].type.includes("F") && ++F
                        }
                        totalCredit += parseInt(item.markCon[sub.subjectId].subjectCredit)
                        ++totalSubject
                        numAvgPercentage = parseInt(item.markCon[sub.subjectId].percentage)+ numAvgPercentage
                        avgPercentage = numAvgPercentage / totalSubject
                        if (parseInt(item.markCon[sub.subjectId].subjectCredit) !== 0) {
                            numAvgDiam = (item.markCon[sub.subjectId].subjectCredit * item.markCon[sub.subjectId].diam) + numAvgDiam 
                            avgDiam = numAvgDiam / totalCredit
                        }
                    }
                })

                return (
                    {
                        familyName: item.familyName,
                        markCon: item.markCon,
                        name: item.name,
                        registerNo: item.registerNo,
                        studentCode: item.studentCode,
                        studentId: item.studentId,
                        A: A,
                        B: B,
                        C: C,
                        D: D,
                        F: F,
                        totalCredit: totalCredit,
                        totalSubject: totalSubject,
                        avgDiam: avgDiam,
                        avgPercentage: avgPercentage
                    }
                )
            })
            setList(fixedData);
            setIsLoading(false);
        }

        if (isMarkConFinish && student && subject && networkStatus === 7) {
            mergeData();
        }
    }, [isMarkConFinish, networkStatus, student, subject])

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
