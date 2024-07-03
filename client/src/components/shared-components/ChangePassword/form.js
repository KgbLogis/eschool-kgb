import { useMutation } from '@apollo/client'
import { Form, Input, message, Spin } from 'antd'
import IntlMessage from 'components/util-components/IntlMessage'
import { CHANGE_USER_PASSWORD } from 'graphql/user'
import React from 'react'

const PasswordForm = ({ user, closeModal }) => {

    const [updatePassword, { loading }] = useMutation(CHANGE_USER_PASSWORD, {
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            closeModal()
        }
    })

    function onFinish(values) {
        values.id = user
        updatePassword({ variables: values })
    }

    return (
        <Spin
            spinning={loading}
        >
            <Form
                layout='vertical'
                name="form"
                onFinish={onFinish}
            >
                <Form.Item name="password" label={<IntlMessage id="password" />} rules={[{ required: true, message: 'Хоосон орхих боломжгүй' }]}>
                    <Input.Password />
                </Form.Item>
            </Form>
        </Spin>
    )
}

export default PasswordForm