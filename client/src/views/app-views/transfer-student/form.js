import React from 'react';
import { Button, Col, DatePicker, Form, Input, message, Row, Select, Spin } from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import { ALL_CLASSTIME, ALL_SCHOOLS, ALL_PROGRAMS, ALL_STUDENTS, TRANSFER_BY_STUDENT } from 'graphql/all';
import { TRANSFER_STUDENT } from 'graphql/update';
import { SECTION_BY_CLASSES } from 'graphql/all';
import { ALL_STUDENT_STATUS, ALL_STUDENT_STATUS_EXTRA, ALL_ACTIVITY } from 'graphql/core';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { SELECT_CLASSES } from 'graphql/select';

const { Option } = Select;
const { TextArea } = Input;

const TransferForm = ({student}) => {

    const [form] = Form.useForm();

    const { data: schoolData, loading: schoolLoading } = useQuery(ALL_SCHOOLS);
    const { data: programData, loading: programLoading } = useQuery(ALL_PROGRAMS);
    const { data: classtimeData, loading: classtimeLoading } = useQuery(ALL_CLASSTIME);
    const { data: statusData, loading: statusLoading } = useQuery(ALL_STUDENT_STATUS);
    const { data: activityData, loading: activityLoading } = useQuery(ALL_ACTIVITY);
    const { data: statusExtraData, loading: statusExtraLoading } = useQuery(ALL_STUDENT_STATUS_EXTRA);
    const [fetchClasses, { data: classesData, loading: classesLoading }] = useLazyQuery(SELECT_CLASSES);
    const [fetchSections, { data: sectionsData, sectionsLoading }] = useLazyQuery(SECTION_BY_CLASSES);

    const [update, { loading: updateLoading }] = useMutation(TRANSFER_STUDENT, {
        refetchQueries: [
            {
                query: ALL_STUDENTS
            },
            {
                query: TRANSFER_BY_STUDENT,
                variables: { student:  student.id }
            }
        ],
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            form.resetFields();
		}
    })

    const onFinish = values => {
        values.student = student.id
        update({ variables: values })
    };

    return (
        <Spin 
            spinning={
                schoolLoading || 
                programLoading || 
                classtimeLoading || 
                classesLoading || 
                sectionsLoading || 
                statusLoading || 
                statusExtraLoading ||
                activityLoading ||
                updateLoading
            } 
            tip="Ачааллаж байна..."
        >
            <Form  
                id="TransferForm"
                layout={'vertical'}
                form={form}
                name="transfer" 
                onFinish={onFinish}
            >
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item name="school" label={<IntlMessage id="school" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                { schoolData?.allSchools.map((school, index) => (
                                    <Option value={school.id} key={index} >{school.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="program" label={<IntlMessage id="program" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select
                                onChange={(e) => fetchClasses({ variables: { program: e, offset: 0, limit: 0, filter: '', } })}
                            >
                                { programData?.allPrograms.map((program, index) => (
                                    <Option value={program.id} key={index} >{program.program}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="classes" label={<IntlMessage id="classes" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select
                                onChange={(e) => fetchSections({ variables: { classes: e } })}
                            >
                                { classesData?.allClassess.map((classes, index) => (
                                    <Option key={index} value={classes.id} >{classes.classes}</Option>
                                ))}
                                <Option>aa</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="section" label={<IntlMessage id="section" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                { sectionsData?.sectionsByClasses.map((section, index) => (
                                    <Option key={index} value={section.id} >{section.section}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="classtime" label={<IntlMessage id="classtime" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                { classtimeData?.allClasstimes.map((classtime, index) => (
                                    <Option value={classtime.id} key={index} >{classtime.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="activity" label={<IntlMessage id="activity" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                { activityData?.allActivitys.map((activity, index) => (
                                    <Option value={activity.id} key={index} >{activity.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="docNum" label={<IntlMessage id="docNum" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="docDate" label={<IntlMessage id="docDate" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item name="description" label={<IntlMessage id="description" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item name="status" label={<IntlMessage id="status" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                { statusData?.allStudentStatuss.map((status, index) => (
                                    <Option value={status.id} key={index} >{status.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="statusExtra" label={<IntlMessage id="student-status-extra" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                { statusExtraData?.allStudentStatusExtras.map((statusExtra, index) => (
                                    <Option value={statusExtra.id} key={index} >{statusExtra.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit">
                            <IntlMessage id="main.okText" />
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Spin>
    );
};

export default TransferForm