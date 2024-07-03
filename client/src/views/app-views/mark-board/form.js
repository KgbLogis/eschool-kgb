import React, { useState, useEffect } from 'react';
import { Form, message, Spin, Row, Col, Select, DatePicker, Empty } from 'antd';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { ALL_SCHOOL_YEAR } from 'graphql/all';
import { CREATE_MARK_BOARD, UPDATE_MARK_BOARD } from 'graphql/mark';
import moment from 'moment';
import IntlMessage from 'components/util-components/IntlMessage';
import { SELECT_SUBJECT, SELECT_TEACHER } from 'graphql/select';
import Loading from 'components/shared-components/Loading';

function MarkBoardForm ({formType, editData, setIsModalVisible, refetch}) {

    const [form] = Form.useForm();
    const { Option } = Select;
    const { RangePicker } = DatePicker;

    const [createMarkBoard, { loading: createLoading }] = useMutation(CREATE_MARK_BOARD, {
		onCompleted: data => {
            refetch();
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
		}
	});

    const [updateMarkBoard, { loading: updateLoading }] = useMutation(UPDATE_MARK_BOARD, {
		onCompleted: data => {
            refetch();
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
		}
    })

    const { data: schoolYearData } = useQuery(ALL_SCHOOL_YEAR, {
    });

    const [teachers, setTeachers] = useState ([]);
    const [fetchTeacher, { loading: loadingTeacher }] = useLazyQuery(SELECT_TEACHER, {
        onCompleted: data => {
            setTeachers(data.allTeachers)
        }
    });

    const [subjects, setSubjects] = useState([]);
    const [fetchSubject, { loading: loadingSubject }] = useLazyQuery(SELECT_SUBJECT, {
        onCompleted: data => {
            setSubjects(data.allSubjects);
        }
    });

    useEffect(() => {
        if(formType === "edit") {
            const formData = {
                date: [moment(editData.startAt), moment(editData.endAt)],
                schoolyear: editData.schoolyear.id,
                subject: editData.subject.id,
                teacher: editData.teacher.id,
                status: editData.status,
            }
            fetchTeacher({ variables: { offset: 0, limit: 99999999, filter: editData.teacher.name } });
            fetchSubject({ variables: { offset: 0, limit: 99999999, filter: editData.subject.subject } });
            form.setFieldsValue(formData);
        } else if(formType === "create") {
            form.resetFields();
        }
    }, [editData, fetchTeacher, fetchSubject, form, formType]);

    const onFinish = values => {
        if (formType === 'create') {
            values.date.map(function (date, index) {
                if (index === 0) {
                    values.startAt = moment(date).format("YYYY-MM-DD HH:mm:ss")
                } else {
                    values.endAt = moment(date).format("YYYY-MM-DD HH:mm:ss") 
                }
                return null
            })
    
            if (values.hasOwnProperty('endAt')) {
                createMarkBoard({ variables: values})
            }
        } else {
            values.id = editData.id;
            values.date.map(function (date, index) {
                if (index === 0) {
                    values.startAt = moment(date).format("YYYY-MM-DD HH:mm:ss")
                } else {
                    values.endAt = moment(date).format("YYYY-MM-DD HH:mm:ss") 
                }
                return null
            })
            if (values.hasOwnProperty('endAt')) {
                updateMarkBoard({ variables: values})
            }
        }
    };
    
    const onTeacherSearch = value => {
        if (value === '') {
            setTeachers([]);
        } else {
            fetchTeacher({ variables: { offset: 0, limit: 99999999, filter: value } });
        }
    }

    const onSubjectSearch = value => {
        if (value === '') {
            setSubjects([]);
        } else {
            fetchSubject({ variables: { offset: 0, limit: 99999999, filter: value } });
        }
    }

    return (
        <Spin spinning={createLoading || updateLoading} tip="Ачааллаж байна...">
            <Form  
                id="MarkBoardForm"
                layout='vertical'
                form={form}
                name="control-hooks" 
                onFinish={onFinish}
            >
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            name="schoolyear"
                            label={<IntlMessage id="schoolyear" />}
                            rules={[
                                { 
                                    required: true,
                                    message: "Хоосон орхих боломжгүй"
                                }
                            ]}
                        >
                            <Select>
                                {schoolYearData?.allSchoolyears.map((schoolYear, index) => (
                                    <Option key={index} value={schoolYear.id}>{schoolYear.schoolyear} / {schoolYear.season} </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="teacher"
                            label={<IntlMessage id="teacher" />}
                            rules={[
                                { 
                                    required: true,
                                    message: "Хоосон орхих боломжгүй"
                                }
                            ]}
                        >
                            <Select
                                showSearch
                                filterOption={false}
                                notFoundContent={
                                    loadingTeacher ? <Loading cover='content' /> 
                                    : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                }
                                onSearch={onTeacherSearch}
                            >
                                { teachers.map((item, index) => (
                                    <Option value={item.id} key={index} >{item.familyName} {item.name} / {item.teacherCode} </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="date"
                            label={<IntlMessage id="date" />}
                            rules={[
                                { 
                                    required: true,
                                    message: "Хоосон орхих боломжгүй"
                                }
                            ]}
                        >
                            <RangePicker
                                showTime 
                                placeholder={['Эхлэх хугацаа', 'Дуусах хугацаа']}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="subject"
                            label={<IntlMessage id="subject" />}
                            rules={[
                                { 
                                    required: true,
                                    message: "Хоосон орхих боломжгүй"
                                }
                            ]}
                        >
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
                                    <Option value={item.id} key={index} > {item.subject}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label={<IntlMessage id="status" />}
                            rules={[
                                { 
                                    required: true,
                                    message: "Хоосон орхих боломжгүй"
                                }
                            ]}
                        >
                            <Select>
                                <Option key={0} value="OPEN"><IntlMessage id="status.open" /></Option>
                                <Option key={1} value="CLOSED"><IntlMessage id="status.closed" /></Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Spin>
    );
};

export default MarkBoardForm