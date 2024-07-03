import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLazyQuery, useQuery } from "@apollo/client";
import { Button, Card, Col, Empty, Form, Result, Row, Select, Skeleton } from 'antd';
import { useReactToPrint } from "react-to-print";
import { STUDENT_MARK_REPORT, STUDENT_MARK_REPORT_SECTION } from 'graphql/report';
import { PrinterOutlined } from '@ant-design/icons';
import PrintCard from './print';
import IntlMessage from 'components/util-components/IntlMessage';
import { ALL_MARK_SETTING } from 'graphql/mark';
import { SECTIONS_BY_PROGRAM, SELECT_PROGRAM, SELECT_STUDENT } from 'graphql/select';
import Loading from 'components/shared-components/Loading';
import { UserContext } from 'hooks/UserContextProvider';

const { Option } = Select;

const Index = () => {

    const [formSection] = Form.useForm();
    const [formStudent] = Form.useForm();

    const [programs, setPrograms] = useState([]);
    const [sections, setSections] = useState([]);
    const [students, setStudents] = useState([]);
    
    const contextData = useContext(UserContext)
    const [user] = useState(contextData.user);

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

    const [datas, setDatas] = useState([]);

    const [getReport, { error: reportError, loading: getReportLoading }] = useLazyQuery(STUDENT_MARK_REPORT, {
        onError: error => {
            setDatas([]);
        },
        onCompleted: data => {
            setDatas([data.studentMarkReport]);
        }
    });

    const [getSectionReport, { error, loading }] = useLazyQuery(STUDENT_MARK_REPORT_SECTION, {
        onError: error => {
            setDatas([]);
        },
        onCompleted: data => {
            setDatas(data.studentMarkReportSection);
        }
    });

    const [settings, setSettings] = useState([]);

    useQuery(ALL_MARK_SETTING, {
        onCompleted: data => {
            setSettings(data.allMarkSettings)
        }
    });

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const onFinish = (values) => {
        if (values.hasOwnProperty("studentCode")) {
            getReport({ variables: { studentCode: values.studentCode } })
        } else {
            getSectionReport({ variables: { section: values.section } })
        }
    }

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

    useEffect(() => {
      
        if (user.isStudent === true) {
            getReport({ variables: { studentCode: user.student.studentCode } })
        }
        
    }, [getReport, user]);

    const ReportView = () => {
        if (reportError || error) {
            return (
                <Result
                    status="404"
                    title="404"
                    subTitle="Мэдээлэл олдсонгүй"
                />
            )
        }
        return (
            datas.length > 0 &&
                <>
                    <div className='text-right'>
                        <Button onClick={handlePrint} type="primary" icon={<PrinterOutlined />} > <IntlMessage id="print" /> </Button>
                    </div>
                    <div ref={componentRef} className='mt-4'>
                        { datas.map((data, index) => (
                            <PrintCard key={index} data={data} settings={settings} />
                        ))}
                    </div>
                </>
        )
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
                                        <Button className="mr-2" type="primary" htmlType="submit" loading={loading}>
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
            <ReportView />
        </div>
    )
}

export default Index
