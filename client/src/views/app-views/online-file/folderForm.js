import React, { useEffect } from 'react'
import { Form, Input, message } from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import { CREATE_ONLINE_FILE_FOLDER, UPDATE_ONLINE_FILE_FOLDER } from 'graphql/lesson'
import { useMutation } from '@apollo/client';


const FolderForm = ({ refetch, currentFolder, handleCancel, folderId }) => {

    const [form] = Form.useForm();

    const [createFolder] = useMutation(CREATE_ONLINE_FILE_FOLDER, {
        onCompleted: res => {
            refetch()
            handleCancel()
            form.resetFields()
            message.success(`Хавтас амжилттай үүслээ`)
        }
    })

    const [updateFolder] = useMutation(UPDATE_ONLINE_FILE_FOLDER, {
        onCompleted: res => {
            refetch()
            handleCancel()
            form.resetFields()
            message.success(`Хавтас амжилттай солигдлоо`)
        }
    })

    useEffect(() => {
        if (folderId) {
            form.setFieldsValue({ name: folderId.name })
        }
        return () => {
            form.resetFields()
        }
    }, [folderId, form])

    const onFinish = values => {
        values.subFolder = currentFolder
        if (folderId) {
            values.id = folderId.id
            return updateFolder({ variables: values })
        } else {
            createFolder({ variables: values })
        }
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