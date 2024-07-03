import React, { useEffect } from 'react';
import { Form, Input, message, Spin } from 'antd';
import { useMutation } from '@apollo/client';
import { CREATE_SCHOOL } from 'graphql/create'
import { ALL_SCHOOLS } from 'graphql/all'
import { UPDATE_SCHOOL } from 'graphql/update'
import IntlMessage from 'components/util-components/IntlMessage';

function SchoolForm ({editData, formType, setIsModalVisible}) {

    const [form] = Form.useForm();

    const [createSchool, { loading: createLoading }] = useMutation(CREATE_SCHOOL, {
        refetchQueries: [ALL_SCHOOLS,
			'allSchools'
		],
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
		}
	});

    const [updateSchool, { loading: updateLoading }] = useMutation(UPDATE_SCHOOL, {
        refetchQueries: [ALL_SCHOOLS, 
            'allSchools'
        ],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
        }
    })

    useEffect(() => {
        if(formType === "edit") {
            form.setFieldsValue(editData);
        } else if(formType === "create") {
            form.resetFields();
        }
    }, [editData, form, formType]);

    


    const onFinish = values => {
        if (formType === "edit") {
            values.id = editData?.id
            updateSchool({ variables: values})
        } else {
            createSchool({ variables: values })
        }
    };

    return (
        <Spin spinning={createLoading || updateLoading} tip="Ачааллаж байна...">
            <Form  
                id="SchoolForm"
                                layout={'vertical'}
                form={form}
                name="school" 
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
                <Form.Item name="nameMgl" label={<IntlMessage id="nameMgl" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Input />
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default SchoolForm