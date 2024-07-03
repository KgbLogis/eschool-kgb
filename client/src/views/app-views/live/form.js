import React, { useState, useEffect } from 'react';
import { Col, DatePicker, Empty, Form, Input, InputNumber, message, Row, Select, Spin } from 'antd';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import IntlMessage from 'components/util-components/IntlMessage';
import { CREATE_LIVE, UPDATE_LIVE } from 'graphql/live';
import { ALL_PROGRAMS, ALL_SECTIONS } from 'graphql/all';
import moment from 'moment';
import { SELECT_CLASSES, SELECT_TEACHER } from 'graphql/select';
import Loading from 'components/shared-components/Loading';

const { Option } = Select;

function SchoolForm ({editData, formType, setIsModalVisible, refetch}) {

    const [form] = Form.useForm();

    const [allSections, setAllSections] = useState([]);

    const [teacherData, setTeacherData] = useState([]);

    const [fetchTeacher, { loading: teacherLoading }] = useLazyQuery(SELECT_TEACHER, {
        onCompleted: data => {
            setTeacherData(data.allTeachers)
        }
    });
    const [fetchClasses, { data: allClasses }] = useLazyQuery(SELECT_CLASSES);
    const { data: allPrograms } = useQuery(ALL_PROGRAMS);

    const { data } = useQuery(ALL_SECTIONS);

    const [createSchool, { loading: createLoading }] = useMutation(CREATE_LIVE, {
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
            refetch();
		}
	});

    const [updateSchool, { loading: updateLoading }] = useMutation(UPDATE_LIVE, {
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
            refetch();
        }
    });

    useEffect(() => {
        fetchTeacher({ variables: { offset: 0, limit: 9, filter: ''} })
        if(formType === "edit") {
            form.setFieldsValue({
                title: editData.title,
                description: editData.description,
                duration: editData.duration,
                status: editData.status,
                teacher: editData.teacher.id,
                date: moment(editData.date),
                type: editData.type,
                section: editData.section.id
            });
        } else if(formType === "create") {
            form.resetFields();
        }
    }, [editData, fetchTeacher, form, formType, data]);

    const onFinish = values => {
        if (formType === "edit") {
            values.id = editData?.id
            updateSchool({ variables: values})
        } else {
            createSchool({ variables: values })
        }
    };

    const onProgramChange = (value) => {
        fetchClasses({ variables: { program: value, offset: 1, limit: 1, filter: '' } })
    }

    const onClassesChange = (value) => {
        const datas = data?.allSections.filter(section => section.classes.id === value).map(filteredSection => (
            filteredSection
        ));
        setAllSections(datas);
    }

    // teacher select

    const onSearch = value => {
        if (value !== '') {
            fetchTeacher({ variables: { offset: 0, limit: 99999999, filter: value } })
        }
    }

    // end teacher select

    return (
        <Spin spinning={createLoading || updateLoading} tip="Ачааллаж байна...">
            <Form  
                id="SchoolForm"
                layout={'vertical'}
                form={form}
                name="school"
                onFinish={onFinish}
            >
                <Row gutter={[16, 24]}>
                    <Col className="gutter-row" span={12}>
                        <Form.Item name="title" label={<IntlMessage id="title" />} rules={[
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
                            <Select
                                onChange={onProgramChange}
                            >
                                { allPrograms?.allPrograms.map((program, index) => (
                                    <Option key={index} value={program.id} >{program.program}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="section" label={<IntlMessage id="section" />} rules={[
                            { 
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <Select>
                                { allSections.map((section, index) => (
                                    <Option key={index} value={section.id} >{section.section}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="date" label={<IntlMessage id="date" />} rules={[
                            { 
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <DatePicker 
                                showTime
                                style={{ width: '100%' }} 
                            />
                        </Form.Item>
                        <Form.Item name="status" label={<IntlMessage id="status" />} rules={[
                            { 
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <Select>
                                <Option key={0} value={'OPEN'} >Нээлттэй</Option>
                                <Option key={1} value={'CLOSED'} >Хаалттай</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
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
                                    teacherLoading ? <Loading cover='content' /> 
                                    : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                }
                                onSearch={onSearch}
                            >
                                { teacherData.map((item, index) => (
                                    <Option key={item.id} value={item.id} > {item.familyName} {item.name} / {item.teacherCode} </Option>
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
                                onChange={onClassesChange}
                            >
                                { allClasses?.allClassess.map((classes, index) => (
                                    <Option key={index} value={classes.id} >{classes.classes}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="type" label={<IntlMessage id="onlineType" />} rules={[
                            { 
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <Select>
                                <Option value={'WEBINAR'} ><IntlMessage id="WEBINAR" /></Option>
                                <Option value={'ZOOM'} ><IntlMessage id="ZOOM" /></Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="duration" label={<IntlMessage id="duration" />} rules={[
                            { 
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="description" label={<IntlMessage id="description" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input.TextArea rows={4} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Spin>
    );
};

export default SchoolForm