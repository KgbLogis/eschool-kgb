import React, { useState, useEffect } from 'react';
import { Form, Input, message, Spin, Select, Empty } from 'antd';
import { useLazyQuery, useMutation } from '@apollo/client';
import { ALL_ONLINE_TESTS, UPDATE_ONLINE_TEST, CREATE_ONLINE_TEST } from 'graphql/test';
import IntlMessage from 'components/util-components/IntlMessage';
import { SELECT_SUBJECT } from 'graphql/select';
import Loading from 'components/shared-components/Loading';

const { TextArea } = Input;
const { Option } = Select;

function TestForm ({editData, formType, setIsModalVisible}) {

    const [form] = Form.useForm();

    const [subjects, setSubjects] = useState([]);
    const [fetchSubject, { loading: loadingSubject }] = useLazyQuery(SELECT_SUBJECT, {
        onCompleted: data => {
            setSubjects(data.allSubjects);
        }
    });

    const [create, { loading: createLoading }] = useMutation(CREATE_ONLINE_TEST, {
        refetchQueries: [ALL_ONLINE_TESTS],
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
		}
	});

    const [update, { loading: updateLoading }] = useMutation(UPDATE_ONLINE_TEST, {
        refetchQueries: [ALL_ONLINE_TESTS],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
        }
    })

    useEffect(() => {
        if(formType === "edit") {
            const newData ={
				title: editData.title,
				description: editData.description,
				subject: editData.subject.id,
			}
            fetchSubject({ variables: { offset: 0, limit: 99999999, filter: editData.subject.subject } });
            form.setFieldsValue(newData);
        } else if(formType === "create") {
            form.resetFields();
        }
    }, [editData, fetchSubject, form, formType]);
    
    const onSubjectSearch = value => {
        if (value === '') {
            setSubjects([]);
        } else {
            fetchSubject({ variables: { offset: 0, limit: 99999999, filter: value } });
        }
    }

    const onFinish = values => {
        if (formType === "edit") {
            values.id = editData.id
            update({ variables: values})
        } else {
            create({ variables: values })
        }
    };

    return (
        <Spin spinning={createLoading || updateLoading} tip="Ачааллаж байна...">
            <Form  
                id="TestForm"
                layout={'vertical'}
                form={form}
                name="school" 
                onFinish={onFinish}
            >
                <Form.Item name="title" label={<IntlMessage id="name" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="description" label={<IntlMessage id="description" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item name={'subject'} label={<IntlMessage id="subject" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    }
                ]}>
                    <Select
                        showSearch
                        filterOption={false}
                        notFoundContent={
                            loadingSubject ? <Loading cover='content' /> 
                            : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        }
                        onSearch={onSubjectSearch}
                    >
                        { subjects.map((item, index) => (
                            <Option value={item.id} key={index} > {item.subject} / {item.subjectCode} </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default TestForm