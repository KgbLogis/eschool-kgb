import React, { useEffect, useState } from 'react';
import { Form, Input, message, Spin, Select, Empty } from 'antd';
import { useMutation, useLazyQuery } from '@apollo/client';
import { SECTION_BY_CLASSES } from 'graphql/all';
import { CREATE_SECTION } from 'graphql/create'
import { UPDATE_SECTION } from 'graphql/update'
import IntlMessage from 'components/util-components/IntlMessage';
import { SELECT_TEACHER } from 'graphql/select';
import Loading from 'components/shared-components/Loading';

function SectionForm({ editData, formType, setIsModalVisible, classData }) {

    const { Option } = Select;

    const [form] = Form.useForm();

    const [teachers, setTeachers] = useState([]);

    const [createSection, { loading }] = useMutation(CREATE_SECTION, {
        refetchQueries: [
            {
                query: SECTION_BY_CLASSES,
                variables: { classes: classData.classes }
            }
        ],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
        }
    });

    const [fetchTeacher, { loading: loadingTeacher }] = useLazyQuery(SELECT_TEACHER, {
        onCompleted: data => {
            setTeachers(data.allTeachers);
        }
    });

    const [updateSection, { loading: updateLoading }] = useMutation(UPDATE_SECTION, {
        refetchQueries: [
            {
                query: SECTION_BY_CLASSES,
                variables: { classes: classData.classes }
            }
        ],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
        }
    })

    // end useQuery

    useEffect(() => {
        if (formType === "edit") {
            form.setFieldsValue({
                section: editData.section,
                teacher: editData.teacher?.id,
                maxStudentNum: editData.maxStudentNum,
                id: editData.id,
            });
            fetchTeacher({ variables: { filter: editData.teacher?.name } })
        } else if (formType === "create") {
            form.resetFields();
        }
    }, [editData, form, formType, fetchTeacher]);



    const onFinish = values => {
        if (formType === "edit") {
            values.id = editData.id;
            const finalResult = Object.assign(values, classData);
            updateSection({ variables: finalResult });
        } else {
            const finalResult = Object.assign(values, classData);
            createSection({ variables: finalResult, });
        }
    };

    const onTeacherSearch = value => {
        if (value === '') {
            setTeachers([]);
        } else {
            fetchTeacher({ variables: { offset: 0, limit: 99999999, filter: value } });
        }
    }

    // const onSectionTeacherSearch = value => {
    //     if (value === '') {
    //         setSectionTeacher([]);
    //     } else {
    //         fetchsectionTeacher({ variables: { offset: 0, limit: 99999999, filter: value } });
    //     }
    // }



    return (
        <Spin spinning={loading || updateLoading} tip="Ачааллаж байна...">
            <Form
                id="SectionForm"
                layout={'vertical'}
                form={form}
                name="control-hooks"
                onFinish={onFinish}
            >
                <Form.Item name="section" label={<IntlMessage id="name" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Input />
                </Form.Item>
                <Form.Item name="teacher" label={<IntlMessage id="teacher" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Select
                        showSearch
                        filterOption={false}
                        notFoundContent={
                            loadingTeacher ? <Loading cover='content' />
                                : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        }
                        onSearch={onTeacherSearch}>
                        {teachers.map((item, index) => (
                            <Option value={item.id} key={index} >{item.familyName} {item.name} / {item.teacherCode} </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="maxStudentNum" label={<IntlMessage id="maxStudentNum" />} rules=
                    {[
                        {
                            required: true,
                            message: <IntlMessage id="form.required" />
                        },
                        {
                            pattern: new RegExp(/^[0-9]+$/),
                            message: 'Зөвхөн тоон утга оруулна'
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default SectionForm