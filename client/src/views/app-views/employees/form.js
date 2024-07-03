import React, { useState, useEffect } from 'react';
import { Form, Input, message, Spin, Row, Col, Select, DatePicker } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { ALL_USERS, ALL_CITYS, ALL_DISTRICTS, ALL_EMPLOYEES_COMPARTMENT } from 'graphql/all';
import { CREATE_EMPLOYEE } from 'graphql/create'
import { UPDATE_EMPLOYEES } from 'graphql/update'
import { ALL_TEACHER_STATUS } from 'graphql/core'
import moment from 'moment';
import IntlMessage from 'components/util-components/IntlMessage';
import { ALL_GROUPS } from 'graphql/role';

function TeacherForm ({ editData, formType, setIsModalVisible, refetch }) {

    const [form] = Form.useForm();
    const { Option } = Select;
    const { TextArea } = Input;

    const dateFormat = "YYYY-MM-DD";

    const [createTeacher, { loading: createLoading }] = useMutation(CREATE_EMPLOYEE, {
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            form.resetFields();
            setIsModalVisible(false);
            refetch();
		}
	});

    const [updateTeacher, { loading: updateLoading }] = useMutation(UPDATE_EMPLOYEES, {
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            form.resetFields();
            setIsModalVisible(false);
            refetch();
		}
    })

    // start useQuery

    const { data: citysData } = useQuery(ALL_CITYS);
    
    const { data: districtsData } = useQuery(ALL_DISTRICTS);

    const { data: statusData } = useQuery(ALL_TEACHER_STATUS);

    const { data: usersData } = useQuery(ALL_USERS);

    const { data: groupData } = useQuery(ALL_GROUPS)

    const { data: compartmentData } = useQuery(ALL_EMPLOYEES_COMPARTMENT)

    useEffect(() => {
        if(formType === "edit") {
            const newData = {
                name: editData.name,
                employeeCode: editData.employeeCode,
                familyName: editData.familyName,
                registerNo: editData.registerNo,
                phone: editData.phone,
                phone2: editData.phone2,
                address: editData.address,
                sex: editData.sex,
                birthCity: editData.birthCity.id,
                birthDistrict: editData.birthDistrict.id,
                status: editData.status.id,
                id: editData.id,
                username: editData.user.username,
                email: editData.user.email, 
                compartment: editData.compartment?.id,
                birthdate: moment(editData.birthdate)
            }
            setDistrict(newData.birthCity)
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
            values.birthdate = BDay
            updateTeacher({ variables: values });
        } else {
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
                        {
                            formType === 'create' &&
                        
                        <Form.Item name="group" label={<IntlMessage id="group-permission" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                { groupData?.allGroups.filter(group => group.id !== "1" && group.id !== "2" && group.id !== "3").map((item, index) => (
                                    <Option key={index} value={item.id} >{item.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        }
                        <Form.Item name="compartment" label={<IntlMessage id="compartment" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            }
                        ]}>
                            <Select>
                                { compartmentData?.allEmployeesCompartment.map((item, index) => (
                                    <Option key={index} value={item.id} >{item.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
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
                        <Form.Item name="employeeCode" label={<IntlMessage id="employeeCode" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input/>
                        </Form.Item>
                    <Form.Item name="phone" label={<IntlMessage id="phone" />} rules={[
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
                        <Form.Item name="email" label={<IntlMessage id="email" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                            {
                                type: 'email',
                                message: 'И-мэйл утга буруу байна'
                            },
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