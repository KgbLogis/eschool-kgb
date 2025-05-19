import React, { useEffect } from 'react';
import { Form, Input, message, Spin, Row, Col, Select } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { ALL_SCHOOLS, ALL_PROGRAMS } from 'graphql/all';
import { ALL_ACTIVITY } from 'graphql/core';
import { CREATE_CLASSES } from 'graphql/create';
import { UPDATE_CLASSES } from 'graphql/update';
import IntlMessage from 'components/util-components/IntlMessage';

const { Option } = Select;

function SchoolForm(props) {

    const [form] = Form.useForm();

    const { data: schoolsData } = useQuery(ALL_SCHOOLS);
    const { data: activityData } = useQuery(ALL_ACTIVITY);
    const { data: programsData } = useQuery(ALL_PROGRAMS);

    const [createClasses, { loading }] = useMutation(CREATE_CLASSES, {
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            props.setIsModalVisible(false);
            props.refetch();
        }
    });
    const [updateClasses, { loading: updateLoading }] = useMutation(UPDATE_CLASSES, {
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            props.setIsModalVisible(false);
            props.refetch();
        }
    })
    useEffect(() => {
        if (props.formType === "edit") {
            const newData = {
                classes: props.editData.classes,
                activity: props.editData.activity.id,
                program: props.editData.program.id,
                school: props.editData.school.id,
                status: props.editData.status,
                course: props.editData.course,
                endCourse: props.editData.endCourse,
            }
            form.setFieldsValue(newData);
        } else if (props.formType === "create") {
            form.resetFields();
        }
    }, [form, props]);

    const onFinish = values => {
        if (props.formType === "edit") {
            values.id = props.editData.id;
            updateClasses({ variables: values });
        } else {
            createClasses({ variables: values });
        }
    };

    return (
        <Spin spinning={loading || updateLoading} tip="Ачааллаж байна...">
            <Form
                id="SchoolForm"
                layout={'vertical'}
                form={form}
                name="control-hooks"
                onFinish={onFinish}
            >
                <Row gutter={[16, 24]}>
                    <Col className="gutter-row" span={12}>
                        <Form.Item name="school" label={<IntlMessage id="school" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                {schoolsData?.allSchools.map((school, index) => (
                                    <Option key={index} value={school.id}>{school.name}</Option>
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
                                {activityData?.allActivitys.map((activity, index) => (
                                    <Option key={index} value={activity.id}>{activity.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="status" label={<IntlMessage id="status" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                <Option value="OPEN">Суралцаж буй</Option>
                                <Option value="CLOSED">Төгссөн</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Form.Item name="classes" label={<IntlMessage id="classes" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="program" label={<IntlMessage id="program" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                {programsData?.allPrograms.map((program, index) => (
                                    <Option value={program.id} key={index}>{program.program}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Spin>
    );
};

export default SchoolForm