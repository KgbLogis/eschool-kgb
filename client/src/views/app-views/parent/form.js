import React, { useState, useEffect } from 'react';
import { Form, Input, message, Spin, Row, Col, Select, Empty } from 'antd';
import { useLazyQuery, useMutation } from '@apollo/client';
import { ALL_PARENTS } from 'graphql/all';
import { CREATE_PARENT } from 'graphql/create';
import { UPDATE_PARENT } from 'graphql/update';
import IntlMessage from 'components/util-components/IntlMessage';
import { SELECT_STUDENT } from 'graphql/select';
import Loading from 'components/shared-components/Loading';

const { Option } = Select;

function StudentForm ({ editData, formType, setIsModalVisible, setTableLoading }) {

    const [form] = Form.useForm();
    const { TextArea } = Input;

    const [studentData, setStudentData] = useState([]);

    const [fetchStudent, { loading: studentLoading }] = useLazyQuery(SELECT_STUDENT, {
        onCompleted: data => {
            setStudentData(data.allStudents)
        }
    });

    const [createParent, { loading: createLoading }] = useMutation(CREATE_PARENT, {
        refetchQueries: [ALL_PARENTS],
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            form.resetFields();
            setIsModalVisible(false);
            setTableLoading(true);
		}
	});

    const [updateParent, { loading: editLoading }] = useMutation(UPDATE_PARENT, {
        refetchQueries: [ALL_PARENTS],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            form.resetFields();
            setIsModalVisible(false);
            setTableLoading(true);
		}
    })

    useEffect(() => {
        
        if (formType === 'edit') {
            const newData ={
                name: editData.name,
				familyName: editData.familyName,
				// username: editData.user.username,
				// email: editData.user.email,
				address: editData.address,
				// addressLive: editData.addressLive,
				phone: editData.phone,
				profession: editData.profession,
				student: editData.student.id,
			}
            form.setFieldsValue(newData);
        }
    }, [editData, formType, form, fetchStudent])

    // function userExists(username) {
    //     return allUsers?.allUsers.some(function(el) {
    //         if (formType === "edit" && editData.user.username === username) {
    //             return false;
    //         } else {
    //             return el.username === username;
    //         }
    //     }); 
    // }

    const phoneRegEx = new RegExp(/^[7-9][0-9]{3}[0-9]{4}$/u);

    function onFinish (values) {
        if (formType === 'edit') {
            values.id = editData.id
            updateParent({ variables: values})
        } else {
            createParent({ variables: values});
        }
    };

    const onSearch = value => {
        if (value !== '') {
            fetchStudent({ variables: { offset: 0, limit: 99999999, filter: value } })
        }
    }

    return (
        <Spin spinning={createLoading || editLoading} tip="Ачааллаж байна...">
            <Form  
                id="StudentForm"
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
                        <Form.Item name="profession" label={<IntlMessage id="profession" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
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
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Form.Item name="name" label={<IntlMessage id="name" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name="student" label={<IntlMessage id="student" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select
                                showSearch
                                filterOption={false}
                                notFoundContent={
                                    studentLoading ? <Loading cover='content' /> 
                                    : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                }
                                onSearch={onSearch}
                            >
                                { studentData.map((item, index) => (
                                    <Option value={item.id} key={index} > {item.familyName} {item.name} / {item.studentCode} </Option>
                                ))}
                            </Select>
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
                    </Col>
                </Row>
            </Form>
        </Spin>
    );
};

export default StudentForm