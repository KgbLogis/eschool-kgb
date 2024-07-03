import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLazyQuery, useQuery } from "@apollo/client";
import { Button, Card, Col, Empty, Form, Row, Select, Skeleton } from 'antd';
import { useReactToPrint } from "react-to-print";
import { STUDENT_REPORT, STUDENT_REPORT_SECTION } from 'graphql/report';
import { PrinterOutlined } from '@ant-design/icons';
import PrintCard from './print';
import IntlMessage from 'components/util-components/IntlMessage';
import { UserContext } from 'hooks/UserContextProvider';
import { SECTIONS_BY_PROGRAM, SELECT_PROGRAM, SELECT_STUDENT } from 'graphql/select';
import Loading from 'components/shared-components/Loading';

const { Option } = Select;

const Index = () => {

    const [datas, setDatas] = useState();
    
    const contextData = useContext(UserContext)
    const [user] = useState(contextData.user);

    const [formSection] = Form.useForm();
    const [formStudent] = Form.useForm();

    const [programs, setPrograms] = useState([]);
    const [sections, setSections] = useState([]);
    const [students, setStudents] = useState([]);

    const { loading: programLoading } = useQuery(SELECT_PROGRAM, {
        onCompleted: data => {
            setPrograms(data.allPrograms);
        }
    })

    const [fetchSection, { loading: sectionLoading}] = useLazyQuery(SECTIONS_BY_PROGRAM, {
        onCompleted: data => {
            setSections(data.sectionsByProgram);
        }
    })

    const [fetchStudent, { loading: studentLoading }] = useLazyQuery(SELECT_STUDENT, {
        onCompleted: data => {
            setStudents(data.allStudents)
        }
    })

    const [getReport, { loading: getReportLoading }] = useLazyQuery(STUDENT_REPORT, {
        onError: error => {
            setDatas();
        },
        onCompleted: data => {
            setDatas([data.studentReport]);
        }
    });
    const [getSectionReport, { loading: getSectionReportLoading }] = useLazyQuery(STUDENT_REPORT_SECTION, {
        onError: error => {
            setDatas();
        },
        onCompleted: data => {
            setDatas(data.studentReportSection);
        }
    });

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const onFinish = (values) => {
        if (!values.hasOwnProperty("studentCode")) {
            getSectionReport({ variables: { section: values.section } })
        } else {
            getReport({ variables: { studentCode: values.studentCode } })
        }
    }

    useEffect(() => {
      
        if (user.isStudent === true) {
            getReport({ variables: { studentCode: user.student.studentCode } })
        }
        
    }, [getReport, user]);

    const onProgramSelect = (program) => {
        formSection.setFieldsValue({
            section: "",
        });
        fetchSection({ variables: { program: program } })
    }

    const onStudentSearch = (value) => {
        if (value === '') {
            setStudents([]);
        } else {
            fetchStudent({ variables: { offset: 0, limit: 99999999, filter: value } });
        }
    }
    

    return (
        <div>
            { user.isStudent === false &&
                <Skeleton active loading={programLoading} >
                    <Row gutter={16}>
                        <Col xs={24} xl={12}>
                            <Card 
                                className='mt-4'
                                title={<IntlMessage id="by-section" />}
                            >
                                <Form  
                                    id="section"
                                    layout={'vertical'}
                                    form={formSection}
                                    name="control-hooks" 
                                    onFinish={onFinish}
                                >
                                    <Form.Item 
                                        name="program" 
                                        label={<IntlMessage id="program" />} 
                                        rules={[
                                            { 
                                                required: true,
                                                message: <IntlMessage id="form.required" /> 
                                            }
                                        ]}
                                    >
                                        <Select
                                            onSelect={onProgramSelect}
                                            allowClear
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            { programs.map((program, index) => (
                                                <Option value={program.id} key={index}>{program.program} / {program.programNumeric}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item 
                                        name="section" 
                                        label={<IntlMessage id="section" />} 
                                        rules={[
                                            { 
                                                required: true,
                                                message: <IntlMessage id="form.required" /> 
                                            }
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            notFoundContent={
                                                sectionLoading ? <Loading cover='content' /> 
                                                : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                            }
                                        >
                                            { sections.map((section, index) => (
                                                <Option value={section.id} key={index}>{section.classes.classes} / {section.section}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item className='text-right'>
                                        <Button className="mr-2" type="primary" htmlType="submit" loading={getSectionReportLoading}>
                                            Сонгох
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                        <Col xs={24} xl={12}>
                            <Card 
                                className='mt-4'
                                title={<IntlMessage id="by-student-code" />}
                            >
                                <Form  
                                    id="student"
                                    layout={'vertical'}
                                    form={formStudent}
                                    name="control-hooks" 
                                    onFinish={onFinish}
                                >
                                    <Form.Item 
                                        name="studentCode" 
                                        label={<IntlMessage id="studentCode" />} 
                                        rules={[
                                            { 
                                                required: true,
                                                message: <IntlMessage id="form.required" /> 
                                            }
                                        ]}
                                    >
                                        <Select
                                            showSearch
                                            filterOption={false}
                                            notFoundContent={
                                                studentLoading ? <Loading cover='content' /> 
                                                : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                            }
                                            onSearch={onStudentSearch}
                                        >
                                            { students.map((student, index) => (
                                                <Option value={student.studentCode} key={index}> {student.familyName} {student.name} / {student.studentCode}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item className='text-right'>
                                        <Button className="mr-2" type="primary" htmlType="submit" loading={getReportLoading}>
                                            Сонгох
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </Skeleton>
            }
            { datas &&
                    <>
                        <div className='text-right'>
                            <Button onClick={handlePrint} type="primary" icon={<PrinterOutlined />} > <IntlMessage id="print" /></Button>
                        </div>
                        <PrintCard ref={componentRef} datas={datas} />
                    </>
            }
        </div>
    )
}

export default Index
