import React, { useState, useEffect } from 'react';
import { Form, Input, message, Spin, Select, InputNumber } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { ALL_PROGRAMS, ALL_SCHOOLS, ALL_SUB_SCHOOLS } from 'graphql/all'
import { CREATE_PROGRAM } from 'graphql/create'
import { UPDATE_PROGRAM } from 'graphql/update'
import IntlMessage from 'components/util-components/IntlMessage';

const { Option } = Select;

function ProgramForm({ formType, editData, setIsModalVisible }) {

    const [form] = Form.useForm();

    const [createSchool, { loading }] = useMutation(CREATE_PROGRAM, {
        refetchQueries: [ALL_PROGRAMS,
            'allPrograms'
        ],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
        }
    });

    const [updateProgram, { loading: updateLoading }] = useMutation(UPDATE_PROGRAM, {
        refetchQueries: [ALL_PROGRAMS,
            'allPrograms'
        ],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
        }
    })

    const { data: schoolsData } = useQuery(ALL_SCHOOLS, {
    });

    const { data: subSchoolsData, loading: subSchoolsLoading } = useQuery(ALL_SUB_SCHOOLS, {
    });

    const [subSchoolList, setSubSchoolList] = useState(undefined);

    useEffect(() => {
        if (subSchoolsLoading === false && subSchoolsData) {
            setSubSchoolList(subSchoolsData.allSubSchools);
        }
    }, [subSchoolList, subSchoolsData, subSchoolsLoading])



    useEffect(() => {
        if (formType === "edit") {
            const newData = {
                program: editData.program,
                programMgl: editData.programMgl,
                maxStudentNum: editData.maxStudentNum,
                school: editData.school.id,
                subSchool: editData.subSchool.id,
                status: editData.status,
                key: editData.id,
            }
            form.setFieldsValue(newData);
            setSelected(form.getFieldValue('school'));
        } else if (formType === "create") {
            form.resetFields();
        }
    }, [editData, form, formType]);

    const onFinish = values => {
        if (formType === "edit") {
            values.id = editData.id;
            updateProgram({ variables: values });
        } else {
            createSchool({ variables: values });
        }
    };

    const [selected, setSelected] = useState("");

    const onSchoolChange = (value) => {
        setSelected(value);
    };

    let type = null;

    let options = null;

    if (selected) {
        type = selected;
    }

    if (type) {
        options = subSchoolList?.filter(Subschool => Subschool.school.id === type).map(filteredSubSchool => (
            <Option key={filteredSubSchool.id} value={filteredSubSchool.id}>{filteredSubSchool.name}</Option>
        ))
    }

    return (
        <Spin spinning={loading || updateLoading} tip="Ачааллаж байна...">
            <Form
                id="ProgramForm"
                layout={'vertical'}
                form={form}
                name="control-hooks"
                onFinish={onFinish}
            >
                <Form.Item name="program" label={<IntlMessage id="name" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Input />
                </Form.Item>
                <Form.Item name="programMgl" label={<IntlMessage id="nameMgl" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Input />
                </Form.Item>
                <Form.Item name="school" label={<IntlMessage id="school" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Select
                        onChange={onSchoolChange}
                    >
                        {schoolsData?.allSchools.map((school, index) => (
                            <Option key={index} value={school.id}>{school.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="subSchool" label={<IntlMessage id="sub-school" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Select
                        placeholder="Тэнхим сонгох"
                    >
                        {options}
                    </Select>
                </Form.Item>
                <Form.Item name="maxStudentNum" label={<IntlMessage id="maxStudentNum" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name="status" label={<IntlMessage id="status" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Select
                        placeholder={<IntlMessage id="status" />}
                    >
                        <Option key="1" value="OPEN">Нээлттэй</Option>
                        <Option key="2" value="CLOSED">Хаалттай</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default ProgramForm