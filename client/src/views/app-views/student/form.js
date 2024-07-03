import React, { useState, useEffect } from 'react';
import { Form, Input, message, Spin, Row, Col, Select, DatePicker } from 'antd';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import {
    ALL_PROGRAMS, ALL_USERS, ALL_CITYS, ALL_DISTRICTS, ALL_SCHOOLS,
    ALL_CLASSTIME, ALL_SCHOOL_YEAR
} from 'graphql/all';
import { ALL_ACTIVITY, ALL_STUDENT_STATUS, ALL_STUDENT_STATUS_EXTRA } from 'graphql/core'
import { CREATE_STUDENT } from 'graphql/create'
import { UPDATE_STUDENT } from 'graphql/update'
import moment from 'moment';
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

    // const [selectedImage, setSelectedImage] = useState();

    const dateFormat = "YYYY-MM-DD";

    const [createStudent, { loading: studentLoading }] = useMutation(CREATE_STUDENT, {
        onCompleted: data => {
            refetch();
            message.success('Амжилттай хадгаллаа');
            form.resetFields();
            setIsModalVisible(false);
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
        }
    })

    // start useQuery
    const { data: activityData } = useQuery(ALL_ACTIVITY);
    const [allClassess, { data: classessData }] = useLazyQuery(SELECT_CLASSES);
    const { data: programData } = useQuery(ALL_PROGRAMS);
    const { data: citysData } = useQuery(ALL_CITYS);
    const { data: districtsData } = useQuery(ALL_DISTRICTS);
    const { data: schoolsData } = useQuery(ALL_SCHOOLS);
    const { data: statusData } = useQuery(ALL_STUDENT_STATUS);
    const { data: extraStatusData } = useQuery(ALL_STUDENT_STATUS_EXTRA);
    const { data: usersData } = useQuery(ALL_USERS);
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
                religion: editData.religion,
                registerNo: editData.registerNo,
                nationality: editData.nationality,
                state: editData.state,
                phone: editData.phone,
                // phone2: editData.phone2,
                address: editData.address,
                citizen: editData.citizen,
                // degree: editData.degree.id,
                activity: editData.activity.id,
                // joinBefore: editData.joinBefore,
                sex: editData.sex,
                classtime: editData.classtime.id,
                birthCity: editData.birthCity.id,
                birthDistrict: editData.birthDistrict.id,
                status: editData.status.id,
                statusExtra: editData.statusExtra.id,
                school: editData.school.id,
                classes: editData.classes.id,
                section: editData.section.id,
                program: editData.program.id,
                joinSchoolyear: editData.joinSchoolyear.id,
                joinDate: moment(editData.joinDate),
                birthdate: moment(editData.birthdate)
            }
            setDistrict(newData.birthCity)
            allClassess({ variables: { program: newData.program, offset: 1, limit: 1, filter: '' } });
            setClasses(newData.program);
            setJoinDay(moment(newData.joinDate).format("YYYY-MM-DD"))
            setBDay(moment(newData.birthdate).format("YYYY-MM-DD"))
            form.setFieldsValue(newData);
        } else if (formType === "create") {
            form.resetFields();
        }
    }, [allClassess, form, editData, formType])

    // Change BirthDistrict

    const [district, setDistrict] = useState("");

    const onBirthCityChange = (value) => {
        setDistrict(value);
    };

    let districtType = null;

    let districtsOption = null;

    if (district) {
        districtType = district;
    }

    if (districtType) {
        districtsOption = districtsData?.allDistricts.filter(District => District.cityID.id === districtType).map(filteredDistrict => (
            <Option key={filteredDistrict.id} value={filteredDistrict.id}>{filteredDistrict.name}</Option>
        ))
    }

    // end change BirthDistrict

    // Change BirthDistrict


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



    const [joinDay, setJoinDay] = useState('');

    function joinDayOnChange(date) {
        setJoinDay(moment(date).format("YYYY-MM-DD"));
    }

    const [BDay, setBDay] = useState('');

    function joinBDayOnChange(date) {
        setBDay(moment(date).format("YYYY-MM-DD"));
    }

    function userExists(username) {
        return usersData?.allUsers.some(function (el) {
            if (formType === "edit" && editData.user.username === username) {
                return false;
            } else {
                return el.username === username;
            }
        });
    }

    const phoneRegEx = new RegExp(/^[7-9][0-9]{3}[0-9]{4}$/u);
    const registerNumRegEx = new RegExp(/[А-ЯӨҮЁ]{2}(\d){8}$/u);

    function onFinish(values) {
        if (formType === 'edit') {
            values.joinDate = joinDay
            values.birthdate = BDay
            values.id = editData.id
            updateStudent({ variables: values })
        } else {
            values.joinDate = joinDay
            values.birthdate = BDay
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
                        <Form.Item name="studentCode" label={<IntlMessage id="studentCode" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input />
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
                        <Form.Item name="joinDate" label={<IntlMessage id="joinDate" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <DatePicker style={{ width: '100%' }} onChange={joinDayOnChange} format={dateFormat} />
                        </Form.Item>
                        <Form.Item name="nationality" label={<IntlMessage id="nationality" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="phone" label={<IntlMessage id="parent_phone" />} rules={[
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
                        <Form.Item name="state" label={<IntlMessage id="state" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
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
                        <Form.Item name="religion" label={<IntlMessage id="religion" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="surname" label={<IntlMessage id="surname" />} rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="familyName" label={<IntlMessage id="familyName" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="name" label={<IntlMessage id="name" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="registerNo" label={<IntlMessage id="registerNo" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                            {
                                validator(rule, value) {
                                    if (!registerNumRegEx.test(value)) {
                                        return Promise.reject('Регистерийн дугаар буруу байна!');
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="birthdate" label={<IntlMessage id="birthdate" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <DatePicker style={{ width: '100%' }} onChange={joinBDayOnChange} format={dateFormat} />
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
                        <Form.Item name="birthCity" label={<IntlMessage id="birthCity" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select onChange={onBirthCityChange}>
                                {citysData?.allCitys.map((city, index) => (
                                    <Option key={index} value={city.id}>{city.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="birthDistrict" label={<IntlMessage id="birthDistrict" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                {districtsOption}
                            </Select>
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
                        <Form.Item name="username" label={<IntlMessage id="username" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                            {
                                validator(rule, value) {
                                    if (userExists(value)) {
                                        return Promise.reject('Нэвтрэх нэр бүртгэлтэй байна');
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}>
                            <Input />
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