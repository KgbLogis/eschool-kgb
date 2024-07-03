import React, { useEffect, useState } from 'react';
import { Form, message, Input, Spin, Select } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { ATTACH_OR_DETACH_SUPPORT_GROUP, CREATE_SUPPORT, UPDATE_SUPPORT } from 'graphql/support'
import IntlMessage from 'components/util-components/IntlMessage';
import { ALL_GROUPS } from 'graphql/role';

function DevTeacherForm ({ refetch, handleCancel, type, formDatas }) {
    
    const [form] = Form.useForm();
    const { Option } = Select;
    const { TextArea } = Input;

    const [groups, setGroups] = useState([])

    const [selectedGroups, setSelectedGroups] = useState([])

    const [attachOrDetachSupportGroup] = useMutation(ATTACH_OR_DETACH_SUPPORT_GROUP, {
        onCompleted: data => {
            refetch()
        }
    })

    const [createSupport, { loading: createLoading }] = useMutation(CREATE_SUPPORT, {
        onCompleted: data => {
            handleCancel()
            message.success('Амжилттай хадгаллаа');
            selectedGroups.map(item => (
                attachOrDetachSupportGroup({ variables: { group: item, support: data.createSupport.support.id } })
            ))
        }
    })

    const [updateSupport] = useMutation(UPDATE_SUPPORT, {
        onCompleted: data => {
            handleCancel()
            message.success('Амжилттай хадгаллаа');
        }
    })
    
    useQuery(ALL_GROUPS, {
        onCompleted: data => {
            setGroups(data.allGroups);
        }
    })

    useEffect(() => {
        if (type === "edit") {
            const formData = {
                description: formDatas.description,
                title: formDatas.title,
                group: formDatas.supportgroupSet.map(item => (
                    item.group.id
                )),
            }
            form.setFieldsValue(formData)
        } else {
            form.resetFields()
        }
    }, [formDatas, type, form])
    

    const onFinish = values => {
        setSelectedGroups(values.group);
        if (type === "create") {
            createSupport({ variables: values })
        } else if (type === "edit") {
            values.id = formDatas.id
            updateSupport({ variables: values })
        }
    };

    function onGroupDeselect(value) {
        if (type === "edit") {
            attachOrDetachSupportGroup({ variables: { group: value, support: formDatas.id } })
        }
    }

    return (
        <Spin spinning={createLoading} tip="Ачааллаж байна...">
            <Form  
                id="SupportForm"
                layout={'vertical'}
                form={form}
                name="lesson" 
                onFinish={onFinish}
            >
                <Form.Item name="title" label={<IntlMessage id="title" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Input />
                </Form.Item>
                <Form.Item name="group" label={<IntlMessage id="group" />} rules={[
                    {
                        required: true,
                        message: `Хоосон орхих боломжгүй`
                    }
                ]}>
                    <Select
                        mode="multiple"
                        onDeselect={e => onGroupDeselect(e)}
                        onSelect={e => onGroupDeselect(e)}
                    >
                        { groups.map((item, index) => (
                            <Option key={index} value={item.id} >{item.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="description" label={<IntlMessage id="description" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <TextArea rows={4} />
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default DevTeacherForm