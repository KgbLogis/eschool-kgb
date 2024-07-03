import React from 'react';
import { Form, message, Spin, Select, Input } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_MARK } from 'graphql/mark';
import IntlMessage from 'components/util-components/IntlMessage';
import { ALL_SECTIONS } from 'graphql/all';

function StudentForm ({boardData, setStudentModalVisible}) {

    const [form] = Form.useForm();
    const { Option } = Select;

    const { data: sectionsData } = useQuery(ALL_SECTIONS);

    const [createMark, { loading: createLoading }] = useMutation(CREATE_MARK, {
        onError: error => {
            if (error.message === "Student matching query does not exist.") {
                message.warning('Суралцагч олдсонгүй!');
            }
        },
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setStudentModalVisible(false);
            form.resetFields();
		}
	});

    const onFinish = values => {
        values.markBoard = boardData.id
        createMark({ variables: values })
    };

    return (
        <Spin spinning={createLoading} tip="Ачааллаж байна...">
            <Form  
                id="StudentForm"
                layout={'vertical'}
                form={form}
                name="control-hooks" 
                onFinish={onFinish}
            >
                <Form.Item name="type" label={<IntlMessage id="select-type" />} rules={[{ required: true }]}>
                    <Select
                        allowClear
                    >
                        <Option value={0}><IntlMessage id="by-section" /></Option>
                        <Option value={1}><IntlMessage id="by-student-code" /></Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
                >
                    {({ getFieldValue }) => {
                        return getFieldValue('type') === 0 ? (
                            <Form.Item name="section" label={<IntlMessage id="section" />} rules={[{ required: true }]}>
                                <Select>
                                    { sectionsData.allSections.map((section, index) => (
                                        <Option value={section.id} key={index}> {section.program.program} / {section.section}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        ) : null;
                    }}
                </Form.Item>
                <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
                >
                    {({ getFieldValue }) => {
                        return getFieldValue('type') === 1 ? (
                            <Form.Item name="studentCode" label={<IntlMessage id="studentCode" />} rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        ) : null;
                    }}
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default StudentForm