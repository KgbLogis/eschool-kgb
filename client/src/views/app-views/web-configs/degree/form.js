import React, { useEffect } from 'react';
import { Form, Input, message, Spin } from 'antd';
import { useMutation } from '@apollo/client';
import { ALL_DEGREES, CREATE_DEGREE, UPDATE_DEGREE } from 'graphql/core';
import IntlMessage from 'components/util-components/IntlMessage';

function DegreeForm ({formType, editData, setIsModalVisible}) {

    const [form] = Form.useForm();

    const [createSchool, { loading: createLoading }] = useMutation(CREATE_DEGREE, {
        refetchQueries: [ALL_DEGREES,
			'allSchools'
		],
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
		}
	});

    const [updateDegree, { loading: updateLoading }] = useMutation(UPDATE_DEGREE, {
        refetchQueries: [ALL_DEGREES, 
            'allDegrees'
        ],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
        }
    });

    useEffect(() => {
        if(formType === "edit") {
            form.setFieldsValue(editData);
        } else if(formType === "create") {
            form.resetFields();
        }
    }, [editData, form, formType]);

    

    const onFinish = values => {
        if (formType === "edit") {
            values.id = editData.id;
            updateDegree({ variables: values });
            form.resetFields();
        } else {
            createSchool({ variables: { name: values.name } });
            form.resetFields();
        }
    };
        
    return (
        <Spin spinning={createLoading || updateLoading} tip="Ачааллаж байна...">
            <Form  
                id="DegreeForm"
                layout={'vertical'}
                form={form}
                name="control-hooks" 
                onFinish={onFinish}
            >
                <Form.Item name="name" label={<IntlMessage id="name" />} rules={[
                    { 
                        required: true,
                        message: "Хоосон орхих боломжгүй"
                    }
                ]}>
                    <Input />
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default DegreeForm