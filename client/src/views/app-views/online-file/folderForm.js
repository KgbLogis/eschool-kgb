import React from 'react'
import { Form, Input, message } from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import { CREATE_ONLINE_FILE_FOLDER } from 'graphql/lesson'
import { useMutation } from '@apollo/client';


const FolderForm = ({ refetch, currentFolder, handleCancel }) => {

    const [form] = Form.useForm();

    const [createFolder] = useMutation(CREATE_ONLINE_FILE_FOLDER, {
        onCompleted: res => {
            refetch()
            handleCancel()
            form.resetFields()
            message.success(`Хавтас амжилттай үүслээ`)
        }
    })

    const onFinish = values => {
        values.subFolder = currentFolder
        createFolder({ variables: values })
    };

    return (
        <div>
            <Form
                id="FolderForm"
                layout={'vertical'}
                form={form}
                name="title"
                onFinish={onFinish}
            >
                <Form.Item name="name" label={<IntlMessage id="name" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>

                    <Input />
                </Form.Item>
            </Form>
        </div>
    )
}

export default FolderForm