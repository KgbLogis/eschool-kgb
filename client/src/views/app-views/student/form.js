import React, { useState, useEffect } from 'react';
import { Form, Input, message, Spin, Row, Col, Select } from 'antd';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import {
    ALL_PROGRAMS, ALL_SCHOOLS,
    ALL_CLASSTIME, ALL_SCHOOL_YEAR
} from 'graphql/all';
import { ALL_ACTIVITY, ALL_STUDENT_STATUS, ALL_STUDENT_STATUS_EXTRA } from 'graphql/core'
import { CREATE_STUDENT } from 'graphql/create'
import { UPDATE_STUDENT } from 'graphql/update'
import IntlMessage from 'components/util-components/IntlMessage';
// import { ImageSvg } from 'assets/svg/icon';
// import CustomIcon from 'components/util-components/CustomIcon';
// import { BASE_SERVER_URL } from 'configs/AppConfig';
import { SELECT_CLASSES, SELECT_SECTION } from 'graphql/select';

// const { Dragger } = Upload;

function StudentForm({ editData, formType, setIsModalVisible, refetch }) {

    const { Option } = Select;
    const [form] = Form.useForm();
    const { TextArea } = Input;

    const [error, setError] = useState({})

    // const [selectedImage, setSelectedImage] = useState();

    // const dateFormat = "YYYY-MM-DD";

    const [createStudent, { loading: studentLoading }] = useMutation(CREATE_STUDENT, {
        onCompleted: data => {
            refetch();
            message.success('Амжилттай хадгаллаа');
            form.resetFields();
            setIsModalVisible(false);
        },
        onError: err => {
            setError({
                email: err.graphQLErrors[0].extensions.errors.email,
                phone: err.graphQLErrors[0].extensions.errors.phone
            })
        }
    });

    // const imageProps = {
    //     accept: '.jpg',
    //     name: 'file',
    //     multiple: false,
    //     listType: "picture-card",
    //     showUploadList: false,
    //     beforeUpload: file => {
    //         return false
    //     }
    // };

    // const onImageChange = (file) => {
    //     if (file) {
    //         setSelectedImage(file.file)
    //     }
    // }

    // const normFile = (e) => {
    //     if (Array.isArray(e)) {
    //         return e;
    //     }
    //     return e && e.fileList;
    // };

    const [updateStudent, { loading: editLoading }] = useMutation(UPDATE_STUDENT, {
        onCompleted: data => {
            refetch();
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
        },
        onError: err => {
            setError({
                email: err.graphQLErrors[0].extensions.errors.email,
                phone: err.graphQLErrors[0].extensions.errors.phone
            })
        }
    })

    // start useQuery
    const { data: activityData } = useQuery(ALL_ACTIVITY);
    const [allClassess, { data: classessData }] = useLazyQuery(SELECT_CLASSES);
    const { data: programData } = useQuery(ALL_PROGRAMS);
    const { data: schoolsData } = useQuery(ALL_SCHOOLS);
    const { data: statusData } = useQuery(ALL_STUDENT_STATUS);
    const { data: extraStatusData } = useQuery(ALL_STUDENT_STATUS_EXTRA);
    const { data: classtimeData } = useQuery(ALL_CLASSTIME);
    const [fetchSection, { data: sectionData }] = useLazyQuery(SELECT_SECTION);
    const { data: schoolYearData } = useQuery(ALL_SCHOOL_YEAR);

    // end useQuery

    useEffect(() => {
        if (formType === "edit") {
            const newData = {
                username: editData.user.username,
                email: editData.user.email,
                studentCode: editData.studentCode,
                surname: editData.surname,
                familyName: editData.familyName,
                // familyNameMgl: editData.familyNameMgl,
                name: editData.name,
                // nameMgl: editData.nameMgl,
                phone: editData.phone,
                // phone2: editData.phone2,
                address: editData.address,
                citizen: editData.citizen,
                // degree: editData.degree.id,
                activity: editData.activity.id,
                // joinBefore: editData.joinBefore,
                sex: editData.sex,
                classtime: editData.classtime.id,
                status: editData.status.id,
                statusExtra: editData.statusExtra.id,
                school: editData.school?.id,
                classes: editData.classes?.id,
                section: editData.section?.id,
                program: editData.program?.id,
                joinSchoolyear: editData.joinSchoolyear?.id
            }
            allClassess({ variables: { program: newData.program, offset: 1, limit: 1, filter: '' } });
            setClasses(newData.program);
            form.setFieldsValue(newData);
        } else if (formType === "create") {
            form.resetFields();
        }
        setError({})
    }, [allClassess, form, editData, formType])

    const [classes, setClasses] = useState("");

    const programOnChange = (value) => {
        allClassess({ variables: { program: value, offset: 1, limit: 1, filter: '' } });
        setClasses(value);
    }

    let programType = null;

    let classesOption = null;

    if (classes) {
        programType = classes;
    }

    if (programType) {
        classesOption = classessData?.allClassess.map(filteredClass => (
            <Option key={filteredClass.id} value={filteredClass.id}>{filteredClass.classes}</Option>
        ))
    }

    // end change BirthDistrict

    const phoneRegEx = new RegExp(/^[7-9][0-9]{3}[0-9]{4}$/u);
    // const registerNumRegEx = new RegExp(/[А-ЯӨҮЁ]{2}(\d){8}$/u);

    function onFinish(values) {
        if (formType === 'edit') {
            values.id = editData.id
            updateStudent({ variables: values })
        } else {
            createStudent({ variables: values });
        }
    };

    return (
        <Spin spinning={studentLoading || editLoading} tip="Ачааллаж байна...">
            <Form
                id="StudentForm"
                layout={'vertical'}
                form={form}
                name="control-hooks"
                onFinish={onFinish}
                size="small"
            >
                <Row gutter={[16, 24]}>
                    <Col className="gutter-row" span={12}>
                        <Form.Item name="familyName" label={<IntlMessage id="familyName" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="sex" label={<IntlMessage id="sex" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                <Option key="0" value="Эрэгтэй"><IntlMessage id="sex.male" /></Option>
                                <Option key="1" value="Эмэгтэй"><IntlMessage id="sex.female" /></Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="school" label={<IntlMessage id="school" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                {schoolsData?.allSchools.map((school, index) => (
                                    <Option key={index} value={school.id}>{school.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="classes" label={<IntlMessage id="classes" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select onChange={e => fetchSection({ variables: { classes: e } })}>
                                {classesOption}
                            </Select>
                        </Form.Item>
                        <Form.Item name="status" label={<IntlMessage id="status" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                {statusData?.allStudentStatuss.map((status, index) => (
                                    <Option key={index} value={status.id}>{status.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="phone" label={<IntlMessage id="phone" />}
                            help={error.phone}
                            validateStatus={error.phone && "error"}
                            rules={[
                                {
                                    required: true,
                                    message: <IntlMessage id="form.required" />
                                },
                                {
                                    validator(rule, value) {
                                        if (phoneRegEx.test(value)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('Утасны дугаар буруу байна!');
                                    },
                                }
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="classtime" label={<IntlMessage id="classtime" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                {classtimeData?.allClasstimes.map((classtime, index) => (
                                    <Option key={index} value={classtime.id}>{classtime.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="address" label={<IntlMessage id="address" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <TextArea rows={2} />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Form.Item name="name" label={<IntlMessage id="name" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="joinSchoolyear" label={<IntlMessage id="joinSchoolyear" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                {schoolYearData?.allSchoolyears.map((year, index) => (
                                    <Option key={index} value={year.id}>{year.schoolyear} {year.season}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="program" label={<IntlMessage id="program" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select onChange={programOnChange}>
                                {programData?.allPrograms.map((program, index) => (
                                    <Option key={index} value={program.id}>{program.program}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="section" label={<IntlMessage id="section" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                {sectionData?.sectionsByClasses.map((section, index) => (
                                    <Option key={index} value={section.id}>{section.section}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="statusExtra" label={<IntlMessage id="student-status-extra" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                {extraStatusData?.allStudentStatusExtras.map((extra, index) => (
                                    <Option key={index} value={extra.id}>{extra.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="email" label={<IntlMessage id="email" />}
                            help={error.email}
                            validateStatus={error.email && "error"}
                            rules={[
                                {
                                    required: true,
                                    message: <IntlMessage id="form.required" />
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="activity" label={<IntlMessage id="activity" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                {activityData?.allActivitys.map((activity, index) => (
                                    <Option key={index} value={activity.id}>{activity.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        {formType === 'create' &&
                            <Form.Item name="password" label={<IntlMessage id="password" />} rules={[
                                {
                                    required: true,
                                    message: <IntlMessage id="form.required" />
                                },
                                {
                                    min: 8,
                                    message: 'Нууц үг 8-аас урттай дээш байх ёстой'
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('username') === value) {
                                            return Promise.reject('Нэвтрэх нэр нууц үг хоёр ижил байх боломгүй!');
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}>
                                <Input.Password />
                            </Form.Item>
                        }
                    </Col>
                </Row>
            </Form>
        </Spin>
    );
};

export default StudentForm