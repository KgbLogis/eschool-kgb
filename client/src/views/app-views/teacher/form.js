import React, { useState, useEffect } from 'react';
import { Form, Input, message, Spin, Row, Col, Select, DatePicker } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { ALL_USERS, ALL_CITYS, ALL_DISTRICTS, ALL_SCHOOLS, ALL_SUB_SCHOOLS } from 'graphql/all';
import { CREATE_TEACHER } from 'graphql/create'
import { UPDATE_TEACHER } from 'graphql/update'
import { ALL_TEACHER_STATUS, ALL_DEGREES } from 'graphql/core'
import moment from 'moment';
import IntlMessage from 'components/util-components/IntlMessage';

function TeacherForm ({ editData, formType, setIsModalVisible, refetch }) {

    const [form] = Form.useForm();
    const { Option } = Select;
    const { TextArea } = Input;

    const dateFormat = "YYYY-MM-DD";

    const [createTeacher, { loading: createLoading }] = useMutation(CREATE_TEACHER, {
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            form.resetFields();
            setIsModalVisible(false);
            refetch();
		}
	});

    const [updateTeacher, { loading: updateLoading }] = useMutation(UPDATE_TEACHER, {
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            form.resetFields();
            setIsModalVisible(false);
            refetch();
		}
    })

    // start useQuery
    const { data: degreesData } = useQuery(ALL_DEGREES, {
    });

    const { data: citysData } = useQuery(ALL_CITYS, {
    });
    
    const { data: districtsData } = useQuery(ALL_DISTRICTS, {
    });

    const { data: schoolsData } = useQuery(ALL_SCHOOLS, {
    });

    const { data: subSchoolsData } = useQuery(ALL_SUB_SCHOOLS, {
    });

    const { data: statusData } = useQuery(ALL_TEACHER_STATUS, {
    });

    const { data: usersData } = useQuery(ALL_USERS, {
    });

    useEffect(() => {
        if(formType === "edit") {
            const newData = {
                name: editData.name,
                teacherCode: editData.teacherCode,
                familyName: editData.familyName,
                access: editData.access.match(/\d+/g),
                registerNo: editData.registerNo,
                phone: editData.phone,
                phone2: editData.phone2,
                address: editData.address,
                degree: editData.degree.id,
                // degree2:editData.degree2.id,
                joinTeacherBefore: editData.joinTeacherBefore,
                sex: editData.sex,
                birthCity: editData.birthCity.id,
                birthDistrict: editData.birthDistrict.id,
                status: editData.status.id,
                school: editData.school.id,
                subSchool: editData.subSchool.id,
                id: editData.id,
                username: editData.user.username,
                email: editData.user.email,
                joinDate: moment(editData.joinDate), 
                birthdate: moment(editData.birthdate)
            }
            setDistrict(newData.birthCity)
            setSubSchool(newData.school)
            setJoinDay(moment(newData.joinDate).format("YYYY-MM-DD"))
            setBDay(moment(newData.birthdate).format("YYYY-MM-DD"))
            form.setFieldsValue(newData);
        } else if(formType === "create") {
            form.resetFields();
        }
    }, [form, editData, formType]);

    // end useQuery

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

    const [subSchool, setSubSchool] = useState("");

    const onSchoolChange = (value) => {
        setSubSchool(value);
    };
    
    let schoolType = null;
    
    let subSchoolOption = null;
    
    if (subSchool) {
        schoolType = subSchool;
    }
    
    if (schoolType) {
        subSchoolOption = subSchoolsData?.allSubSchools.filter(Subschool => Subschool.school.id === schoolType).map(filteredSubSchool => (
            <Option key={filteredSubSchool.id} value={filteredSubSchool.id}>{filteredSubSchool.name}</Option>
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
        return usersData?.allUsers.some(function(el) {
            if (formType === "edit" && editData.user.username === username) {
                return false;
            } else {
                return el.username === username;
            }
        }); 
    }

    const phoneRegEx = new RegExp(/^[7-9][0-9]{3}[0-9]{4}$/u);
    const registerNumRegEx = new RegExp(/[А-ЯӨҮЁ]{2}(\d){8}$/u);

    function onFinish (values) {

        if (formType === "edit") {
            values.id = editData.id;
            values.joinDate = joinDay
            values.birthdate = BDay
            updateTeacher({ variables: values });
        } else {
            values.joinDate = joinDay
            values.birthdate = BDay
            createTeacher({ variables: values});
        }
        
    };

    return (
        <Spin spinning={createLoading || updateLoading} tip="Ачааллаж байна...">
            <Form  
                id="TeacherForm"
                                layout={'vertical'}
                form={form}
                name="control-hooks"
                onFinish={onFinish}
            >
                <Row gutter={[16, 24]}>
                    <Col className="gutter-row" span={12}>
                    <Form.Item name="familyName" label={<IntlMessage id="familyName" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name="name" label={<IntlMessage id="name" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input/>
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
                            <Input/>
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
                                        <Option key="0" value="Эрэгтэй">{<IntlMessage id="sex.male" />}</Option>
                                        <Option key="1" value="Эмэгтэй">{<IntlMessage id="sex.female" />}</Option>
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
                        <Form.Item name="school" label={<IntlMessage id="main-school" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select onChange={onSchoolChange}>
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
                            <Select>
                                {subSchoolOption}
                            </Select>
                        </Form.Item>
                        <Form.Item name="teacherCode" label={<IntlMessage id="teacherCode" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name="status" label={<IntlMessage id="status" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                {statusData?.allTeacherStatuss.map((status, index) => (
                                    <Option key={index} value={status.id}>{status.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
                    <Form.Item name="joinBefore" label={<IntlMessage id="joinTeacherBefore" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <TextArea rows={4}/>
                        </Form.Item>
                        <Form.Item name="degree" label={<IntlMessage id="degree" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                {degreesData?.allDegrees.map((degree, index) => (
                                    <Option key={index} value={degree.id}>{degree.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="joinDate" label={<IntlMessage id="joinDate2" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <DatePicker style={{ width: '100%' }} onChange={joinDayOnChange} format={dateFormat} />
                        </Form.Item>
                        <Form.Item name="phone" label={<IntlMessage id="phone1" />} rules={[
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
                            <Input/>
                        </Form.Item>
                        <Form.Item name="phone2" label={<IntlMessage id="phone2" />} rules={[
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
                            <Input/>
                        </Form.Item>
                        <Form.Item name="access" label={<IntlMessage id="access" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                <Option value={'1'} ><IntlMessage id="teacher" /></Option>
                                <Option value={'2'} ><IntlMessage id="sectionTeacher"/></Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name='email' label={<IntlMessage id="email"/>} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required"/>
                            }
                        ]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name="address" label={<IntlMessage id="address" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <TextArea rows={2}/>
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
                            <Input/>
                        </Form.Item>
                        {/* <Form.Item name="degree2" label={<IntlMessage id="degree2" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                {degreesData?.allDegrees.map((degree2, index) => (
                                    <Option key={index} value={degree2.id}>{degree2.name}</Option>
                                ))}
                            </Select>
                        </Form.Item> */}
                        {
                            formType === 'create' ?
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
                                <Input.Password/>
                            </Form.Item> :
                            null
                        }
                    </Col>
                </Row>
            </Form>
        </Spin>
    );
};

export default TeacherForm