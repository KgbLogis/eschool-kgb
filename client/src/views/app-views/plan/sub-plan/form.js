import React, { useEffect } from 'react';
import { Col, Form, Input, message, Row, Select, Spin } from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import { useMutation } from '@apollo/client';
import { ALL_SUB_PLANS, CREATE_SUB_PLAN, UPDATE_SUB_PLAN } from 'graphql/plan';
import BraftEditor from 'braft-editor';
import { subjectNames } from 'utils';

const { Option } = Select

function SubPlanForm({ closeModal, selectedData, plan }) {

    const [form] = Form.useForm();

    const [create, { loading: createLoading }] = useMutation(CREATE_SUB_PLAN, {
        refetchQueries: [{
            query: ALL_SUB_PLANS,
            variables: { plan: plan }
        }],
        onCompleted: data => {
            closeModal();
            message.success("Амжилттай хадгаллаа")
        }
    })

    const [update, { loading: updateLoading }] = useMutation(UPDATE_SUB_PLAN, {
        refetchQueries: [{
            query: ALL_SUB_PLANS,
            variables: { plan: plan }
        }],
        onCompleted: data => {
            closeModal();
            message.success("Амжилттай хадгаллаа")
        }
    })

    useEffect(() => {
        if (selectedData.id) {
            const formData = {
                subjectName: selectedData.subjectName,
                hand: selectedData.hand,
                jumping: selectedData.jumping,
                running: selectedData.running,
                shoot: selectedData.shoot,
                body: selectedData.body,
                walk: selectedData.walk,
                game: selectedData.game,
                consumables: BraftEditor.createEditorState(selectedData.consumables),
                teachingMethods: BraftEditor.createEditorState(selectedData.teachingMethods),
                goal: BraftEditor.createEditorState(selectedData.goal),
                content: BraftEditor.createEditorState(selectedData.content)
            }
            form.setFieldsValue(formData);
        } else {
            form.resetFields()
        }
    }, [selectedData, form])

    const onFinish = values => {
        values.plan = plan
        values.consumables = values.consumables.toHTML();
        values.content = values.content.toHTML();
        values.goal = values.goal.toHTML();
        values.teachingMethods = values.teachingMethods.toHTML();
        if (selectedData.id) {
            values.id = selectedData.id
            update({ variables: values })
        } else {
            create({ variables: values })
        }
    };

    return (
        <Spin spinning={createLoading || updateLoading} tip="Ачааллаж байна...">
            <Form
                id="subPlanForm"
                layout={'vertical'}
                form={form}
                name="subPlanForm"
                onFinish={onFinish}
            >
                <Row gutter={[24, 24]}>
                    <Col xs={24} xl={12}>
                        <Form.Item name="subjectName" label={<IntlMessage id="subject" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            }
                        ]}>
                            <Select>
                                {subjectNames.map((subject, index) => (
                                    <Option
                                        value={subject.value}
                                        key={index}
                                    >
                                        {subject.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} xl={12}>
                        <Form.Item name="hand" label={<IntlMessage id="hand" />} rules={[
                            {
                                max: 150,
                                message: <IntlMessage id="form.max" />
                            }
                        ]}>
                            <Input.TextArea rows={1} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} xl={12}>
                        <Form.Item name="jumping" label={<IntlMessage id="jumping" />} rules={[
                            {
                                max: 150,
                                message: <IntlMessage id="form.max" />
                            }
                        ]}>
                            <Input.TextArea rows={1} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} xl={12}>
                        <Form.Item name="running" label={<IntlMessage id="running" />} rules={[
                            {
                                max: 150,
                                message: <IntlMessage id="form.max" />
                            }
                        ]}>
                            <Input.TextArea rows={1} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} xl={12}>
                        <Form.Item name="shoot" label={<IntlMessage id="shoot" />} rules={[
                            {
                                max: 150,
                                message: <IntlMessage id="form.max" />
                            }
                        ]}>
                            <Input.TextArea rows={1} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} xl={12}>
                        <Form.Item name="body" label={<IntlMessage id="body" />} rules={[
                            {
                                max: 150,
                                message: <IntlMessage id="form.max" />
                            }
                        ]}>
                            <Input.TextArea rows={1} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} xl={12}>
                        <Form.Item name="walk" label={<IntlMessage id="walk" />} rules={[
                            {
                                max: 150,
                                message: <IntlMessage id="form.max" />
                            }
                        ]}>
                            <Input.TextArea rows={1} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} xl={12}>
                        <Form.Item name="game" label={<IntlMessage id="game" />} rules={[
                            {
                                max: 150,
                                message: <IntlMessage id="form.max" />
                            }
                        ]}>
                            <Input.TextArea rows={1} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} xl={12}>
                        <Form.Item name="consumables" label={<IntlMessage id="consumables" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            }
                        ]}>
                            <BraftEditor
                                className='border rounded-2'
                                language="en"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} xl={12}>
                        <Form.Item name="content" label={<IntlMessage id="content" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            }
                        ]}>
                            <BraftEditor
                                className='border rounded-2'
                                language="en"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} xl={12}>
                        <Form.Item name="goal" label={<IntlMessage id="goal" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            }
                        ]}>
                            <BraftEditor
                                className='border rounded-2'
                                language="en"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} xl={12}>
                        <Form.Item name="teachingMethods" label={<IntlMessage id="teachingMethods" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            }
                        ]}>
                            <BraftEditor
                                className='border rounded-2'
                                language="en"
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Spin>
    );
};

export default SubPlanForm