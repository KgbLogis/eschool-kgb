import React, { useState } from 'react'
import { Button, Form, Input, message, Select, Spin, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import IntlMessage from 'components/util-components/IntlMessage'
import { gql, useMutation, useQuery } from '@apollo/client'
import { CREATE_CONVERSATION, MY_SENT } from 'graphql/conversation'

const { Option } = Select

const GROUPS_GQL = gql`
    query allGroups {
        allGroups {
            id
            name
            userSet {
                id
                firstName
                lastName
            }
        }
    }
`

const ConversationForm = ({ handleCancel }) => {

    const [form] = Form.useForm()

    const { data: groups } = useQuery(GROUPS_GQL)

    const [users, setUsers] = useState([])

    const [createConversation, { loading }] = useMutation(CREATE_CONVERSATION, {
        refetchQueries: [MY_SENT,
			'mySent'
		],
        onCompleted: data => {
            handleCancel()
            message.success("Амжилттай илгээлээ")
            form.resetFields()
        }
    })

    const uploadprops = {
        name: 'file',
        multiple: true,
        beforeUpload: file => {
            return false
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    function onGroupsSelect(selected) {
        const result = groups.allGroups.find(({ id }) => id === selected);
        setUsers(result.userSet);
    }

    function onGroupsDeselect(params) {
        form.setFieldsValue({ recipient: 0 })
    }

    function onFinish(values) {
        if (!values.files) {
            values.files = []
        }
        if (!values.recipient) {
            values.recipient = 0
        }
        createConversation({ variables: values });
    }

    return (
        <Spin spinning={loading} tip="Ачааллаж байна...">
            <Form
                name="form" 
                id="form" 
                layout={'vertical'}
                form={form}
                onFinish={onFinish}
            >
                <Form.Item name="createType" label={"Илгээх төрөл"} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Select>
                        <Option value={0}>Хэрэглэгчийн бүлгээр</Option>
                        <Option value={1}>Ганц хэрэглэгчрүү</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="subject" label={<IntlMessage id="title" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Input />
                </Form.Item>
                <Form.Item name="body" label={<IntlMessage id="conversation" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.createType !== currentValues.createType}
                >
                {({ getFieldValue }) =>
                    getFieldValue('createType') === 0 ? (
                        <Form.Item name="groups" label={<IntlMessage id="group" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select 
                                mode="multiple"
                                onSelect={onGroupsSelect}
                                onDeselect={onGroupsDeselect}
                            >
                                { groups?.allGroups.map((item, index) => (
                                    <Option key={index} value={item.id}>{item.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    ) : getFieldValue('createType') === 1 ?
                    <>
                        <Form.Item name="groups" label={<IntlMessage id="group" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select
                                onSelect={onGroupsSelect}
                                onDeselect={onGroupsDeselect}
                            >
                                { groups?.allGroups.map((item, index) => (
                                    <Option key={index} value={item.id}>{item.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="recipient" label={<IntlMessage id="user" />}>
                            <Select>
                                { users.map((item, index) => (
                                    <Option key={index} value={item.id} >{item.lastName} {item.firstName}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </> : null
                }
                </Form.Item>
                <Form.Item name="files" label="Хавсралт" valuePropName='fileList' getValueFromEvent={normFile}>
                    <Upload
                        {...uploadprops}
                    >
                        <Button icon={<UploadOutlined />}>Файл сонгох</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Spin>
    )
}

export default ConversationForm