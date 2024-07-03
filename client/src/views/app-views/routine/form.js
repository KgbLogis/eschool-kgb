import React, { useCallback, useState } from 'react';
import { Form, Input, message, Spin, Row, Col, Select, DatePicker, Empty, Pagination } from 'antd';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { CREATE_ROUTINE } from 'graphql/core';
import { ALL_PROGRAMS, ALL_SCHOOL_YEAR, ALL_SUBJECTS_PAGINATION } from 'graphql/all';
import { ALL_PROGRAM_SUBJECT_BY_PROGRAM } from "graphql/custom";
import moment from 'moment';
import IntlMessage from 'components/util-components/IntlMessage';
import Loading from 'components/shared-components/Loading';
import { SELECT_TEACHER, SELECT_CLASSES, SELECT_SECTION } from 'graphql/select';
import { debounce } from 'lodash';

function RoutineForm({ setIsModalVisible, refetch, refetchTimes }) {

    const [form] = Form.useForm();
    const { Option } = Select;
    const { RangePicker } = DatePicker;

    const [subjectPage, setSubjectPage] = useState(1)
    const [subjectFilter, setSubjectFilter] = useState('')
    const [teacherData, setTeacherData] = useState([])
    const [teacherFilter, setTeacherFilter] = useState('')

    const [createRoutine, { loading }] = useMutation(CREATE_ROUTINE, {
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            form.resetFields();
            setIsModalVisible(false);
            refetch();
            refetchTimes();
        }
    });

    const { data: programData } = useQuery(ALL_PROGRAMS);
    const { data: schoolYearData } = useQuery(ALL_SCHOOL_YEAR);
    const [allClassess, { data: classessData }] = useLazyQuery(SELECT_CLASSES);
    const [fetchSection, { data: sectionData }] = useLazyQuery(SELECT_SECTION);
    const { data: subjectData, loading: subjectLoading } = useQuery(ALL_SUBJECTS_PAGINATION, {
        variables: { page: subjectPage, perPage: 10, filter: subjectFilter }
    });
    const { loadint: teacherLoading } = useQuery(SELECT_TEACHER, {
        variables: { offset: 0, limit: 99999999, filter: teacherFilter },
        onCompleted: data => {
            setTeacherData(data.allTeachers);
        }
    });

    const onTeacherSearch = value => {
        setTeacherFilter(value)
    }

    const debouncedSetSubjectFilter = useCallback(
        debounce((filter) => setSubjectFilter(filter), 500),
        []
    );

    function onSubjectSearch(value) {
        debouncedSetSubjectFilter(value)
    }

    const programOnChange = (value) => {
        allClassess({ variables: { program: value, offset: 0, limit: 0, filter: '' } });
    }

    const classesOnChange = (value) => {
        fetchSection({ variables: { classes: value } });
    }

    const [forDate, setForDate] = useState(null);

    const forDateOnChange = (value) => {
        setForDate(value);
    }

    if (forDate) {
        disabledDate();
    }

    function disabledDate(current) {
        var date = parseInt(forDate);
        return (
            moment(current).day() !== date
        )
    }

    const onFinish = values => {

        values.dates.map(function (date, index) {
            if (index === 0) {
                values.startDate = moment(date).format("YYYY-MM-DD")
            } else {
                values.endDate = moment(date).format("YYYY-MM-DD")
            }
            return null
        })

        if (values.hasOwnProperty('endDate')) {
            createRoutine({ variables: values })
        }
    };

    return (
        <Spin spinning={loading} tip="Ачааллаж байна...">
            <Form
                id="RoutineForm"
                layout={'vertical'}
                form={form}
                name="control-hooks"
                onFinish={onFinish}
            >
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item name="schoolyear" label={<IntlMessage id="schoolyear" />} rules={[
                            {
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <Select>
                                {schoolYearData?.allSchoolyears.map((schoolyear, index) => (
                                    <Option key={index} value={schoolyear.id} >{schoolyear.schoolyear} {schoolyear.season}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="classes" label={<IntlMessage id="classes" />} rules={[
                            {
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <Select onChange={classesOnChange}>
                                {
                                    classessData?.allClassess.map(classes => (
                                        <Option key={classes.id} value={classes.id}>{classes.classes}</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item name="teacher" label={<IntlMessage id="teacher" />} rules={[
                            {
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <Select
                                showSearch
                                filterOption={false}
                                notFoundContent={
                                    teacherLoading ? <Loading cover='content' />
                                        : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                }
                                onSearch={onTeacherSearch}
                            >
                                {teacherData.map((item, index) => (
                                    <Option value={item.id} key={index} > {item.familyName} {item.name} / {item.teacherCode} </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="fordate" label={<IntlMessage id="class.day" />} rules={[
                            {
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <Select onChange={forDateOnChange}>
                                <Option key={0} value="1" >Даваа</Option>
                                <Option key={1} value="2" >Мягмар</Option>
                                <Option key={2} value="3" >Лхагва</Option>
                                <Option key={3} value="4" >Пүрэв</Option>
                                <Option key={4} value="5" >Баасан</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="time"
                            label={<IntlMessage id="class.time" />}
                            rules={[
                                {
                                    required: true,
                                    message: "Хоосон орхих боломжгүй"
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name="weekly" label={<IntlMessage id="weekly" />} rules={[
                            {
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <Select>
                                <Option key={0} value={0} ><IntlMessage id="weekly.all" /></Option>
                                <Option key={1} value={1} ><IntlMessage id="weekly.option" /></Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="program" label={<IntlMessage id="program" />} rules={[
                            {
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <Select onChange={programOnChange}>
                                {programData?.allPrograms.map((program, index) => (
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
                                {
                                    sectionData?.sectionsByClasses.map(section => (
                                        <Option key={section.id} value={section.id}>{section.section}</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item name="subject" label={<IntlMessage id="subject" />} rules={[
                            {
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <Select
                                notFoundContent={
                                    subjectLoading ? <Loading cover='content' />
                                        : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                }
                                showSearch
                                onSearch={onSubjectSearch}
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <Pagination
                                            className='my-2 flex justify-center'
                                            defaultCurrent={subjectPage}
                                            total={subjectData?.allSubjectsPagination.totalCount}
                                            onChange={pageIndex => setSubjectPage(pageIndex)}
                                            showSizeChanger={false}
                                        />
                                    </>
                                )}
                            >
                                {
                                    subjectData?.allSubjectsPagination.records.map((subject, index) => (
                                        <Option key={index} value={subject.id}>{subject.subject} / {subject.content}</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item name="room" label={<IntlMessage id="class.room" />} rules={[
                            {
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="dates" label={<IntlMessage id="start_end_date" />} rules={[
                            {
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <RangePicker
                                disabledDate={disabledDate}
                            />
                        </Form.Item>
                        <Form.Item name="type" label={<IntlMessage id="status" />} rules={[
                            {
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <Select>
                                <Option key={0} value="OPEN" >Нээлттэй</Option>
                                <Option key={1} value="CLOSED" >Хаалттай</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Spin>
    );
};

export default RoutineForm