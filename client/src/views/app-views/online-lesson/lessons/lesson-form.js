import React, { useEffect } from 'react';
import { Form, message, Input, Spin, Select } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { ALL_SCHOOL_YEAR, ALL_SUBJECTS } from 'graphql/all'
import { CREATE_ONLINE_LESSON, UPDATE_ONLINE_LESSON } from 'graphql/lesson'
import 'braft-editor/dist/index.css';
import IntlMessage from 'components/util-components/IntlMessage';

function LessonForm ({ formType, editData, setIsModalVisible, refetch }) {

    const [form] = Form.useForm();

    const { Option } = Select;
    const { TextArea } = Input;

    const { data: schoolyearData } = useQuery(ALL_SCHOOL_YEAR);
    const { data: subjectData } = useQuery(ALL_SUBJECTS, {
        variables: { offset: 0, limit: 500 }
    });

    const [createOnlineLesson, { loading: createLoading } ] = useMutation(CREATE_ONLINE_LESSON, {
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            form.resetFields();
            refetch()
            setIsModalVisible(false);
		}
    });

    const [updateOnlineLesson, { loading: updateLoading }] = useMutation(UPDATE_ONLINE_LESSON, {
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            form.resetFields();
            refetch()
            setIsModalVisible(false);
        }
    })

    useEffect(() => {
        if(formType === "edit") {
            const newData ={
                description: editData.description,
                schoolyear: editData.schoolyear.id,
                status: editData.status,
                subject: editData.subject?.id
			}
            form.setFieldsValue(newData);
        } else if(formType === "create") {
            form.resetFields();
        }
    }, [form, formType, editData]);


    const onFinish = values => {
        if (formType === 'edit') {
            values.id = editData.id;
            updateOnlineLesson({ variables: values });
        } else {
            createOnlineLesson({ variables: values })
        }
    };

    return (
        <Spin spinning={createLoading || updateLoading} tip="Ачааллаж байна...">
            <Form  
                id="LessonForm"
                layout={'vertical'}
                form={form}
                name="lesson" 
                onFinish={onFinish}
            >
                <Form.Item name="schoolyear" label={<IntlMessage id="schoolyear" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Select>
                        { schoolyearData?.allSchoolyears.map((schoolyear, index) => (
                            <Option value={schoolyear.id} key={index} >{schoolyear.schoolyear} {schoolyear.season}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="subject" label={<IntlMessage id="subject" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Select>
                        { subjectData?.allSubjects.map((subject, index) => (
                            <Option value={subject.id} key={index} >{subject.subject}</Option>
                        ))}
                    </Select>
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
                        <Option value="OPEN" key={0} >{<IntlMessage id="status.open" />}</Option>
                        <Option value="CLOSED" key={1} >{<IntlMessage id="status.closed" />}</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default LessonForm