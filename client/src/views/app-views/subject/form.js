import React, { useState, useEffect } from 'react';
import { Form, Input, message, Spin, Select } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { ALL_SUB_SCHOOLS, ALL_SCHOOLS } from 'graphql/all'
import { CREATE_SUBJECT } from 'graphql/create'
import { UPDATE_SUBJECT } from 'graphql/update'
import IntlMessage from 'components/util-components/IntlMessage';
import { subjectNames } from 'utils';

const { Option } = Select;

function SubjectForm({ editData, formType, setIsModalVisible, refetch }) {

    const [form] = Form.useForm();

    const [createSubject, { loading: createLoading }] = useMutation(CREATE_SUBJECT, {
        onCompleted: createData => {
            message.success('Амжилттай хадгаллаа');
            refetch();
            setIsModalVisible(false);
            form.resetFields();
        }
    });

    const [updateSubject, { loading: updateLoading }] = useMutation(UPDATE_SUBJECT, {
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            refetch();
            setIsModalVisible(false);
            form.resetFields();
        }
    })

    const { data: schoolData } = useQuery(ALL_SCHOOLS, {
    });

    const { data: subSchoolData } = useQuery(ALL_SUB_SCHOOLS, {
    });


    const [school, setSchool] = useState("");

    function schoolOnChange(value) {
        setSchool(value);
        form.setFieldsValue({ subSchool: null });
    }

    let schoolID = null;

    let subSchoolOption = null;

    if (school) {
        schoolID = school;
    }

    if (schoolID) {
        subSchoolOption = subSchoolData?.allSubSchools.filter(Subschool => Subschool.school.id === schoolID).map(filteredSubSchool => (
            <Option key={filteredSubSchool.id} value={filteredSubSchool.id}>{filteredSubSchool.name}</Option>
        ))
    }

    useEffect(() => {
        if (formType === "edit") {
            const newData = {
                subject: editData.subject,
                content: editData.content,
                school: editData.school.id,
                subSchool: editData.subSchool.id,
                credit: editData.credit,
                key: editData.id,
            }
            form.setFieldsValue(newData);
            setSchool(form.getFieldValue('school'));
        } else if (formType === "create") {
            form.resetFields();
        }
    }, [editData, form, formType]);

    const onFinish = values => {
        if (formType === "edit") {
            values.id = editData.id
            updateSubject({ variables: values });
        } else {
            createSubject({ variables: values });
        }
    };

    return (
        <Spin spinning={createLoading || updateLoading} tip="Ачааллаж байна...">
            <Form
                id="SubjectForm"
                layout={'vertical'}
                form={form}
                name="control-hooks"
                onFinish={onFinish}
            >
                <Form.Item name="subject" label={<IntlMessage id="subject" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    }
                ]}>
                    <Select>
                        {subjectNames.map((subject, index) => (
                            <Option
                                value={subject.label}
                                key={index}
                            >
                                {subject.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="content" label={<IntlMessage id="content" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    }
                ]}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="school" label={<IntlMessage id="school" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    }
                ]}>
                    <Select
                        onChange={schoolOnChange}
                    >
                        {schoolData?.allSchools.map((school, index) => (
                            <Option key={index} value={school.id}>{school.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="subSchool" label={<IntlMessage id="sub-school" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    }
                ]}>
                    <Select
                        placeholder="Заах аргын нэгдэл"
                    >
                        {subSchoolOption}
                    </Select>
                </Form.Item>
                <Form.Item name="credit" label={<IntlMessage id="credit" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    }
                ]}>
                    <Input />
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default SubjectForm