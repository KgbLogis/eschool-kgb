import React, { useEffect } from 'react';
import { Form, Input, message, Spin, Select } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { ALL_SUB_SCHOOLS, ALL_SCHOOLS } from 'graphql/all'
import { CREATE_SUB_SCHOOL } from 'graphql/create'
import { UPDATE_SUB_SCHOOL } from 'graphql/update'
import IntlMessage from 'components/util-components/IntlMessage';

const { Option } = Select;

function SchoolForm ({editData, formType, setIsModalVisible, setReFill, setTableLoading}) {

    const [form] = Form.useForm();

    const [createSubSchool, { loading: createLoading }] = useMutation(CREATE_SUB_SCHOOL, {
		refetchQueries: [ALL_SUB_SCHOOLS,
			'allSubSchools'
		],
		onCompleted: createData => {
            message.success('Амжилттай хадгаллаа');
            setReFill(true);
            setIsModalVisible(false);
            form.resetFields();
		}
	});

    const [updateSubSchool, { loading: updateLoading }] = useMutation(UPDATE_SUB_SCHOOL, {
        refetchQueries: [ALL_SUB_SCHOOLS, 
            'allSubSchools'
        ],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setReFill(true);
            setIsModalVisible(false);
            form.resetFields();
            setTableLoading(true);
        }
    })

    const { data, loading } = useQuery(ALL_SCHOOLS);

    
    
    useEffect(() => {
        if(formType === "edit") {
            const newData ={
				name: editData.name,
				nameMgl: editData.nameMgl,
				school: editData.school.id,
				key: editData.id,
			}
            form.setFieldsValue(newData);
        } else if(formType === "create") {
            form.resetFields();
        }
    }, [editData, form, formType]);

    const onFinish = values => {
        if (formType === "edit") {
            values.id = editData?.key
            updateSubSchool({ variables: values });
        } else {
            createSubSchool({ variables: { name: values.name, nameMgl: values.nameMgl, school: values.school } });
        }
    };

    if (loading) return <IntlMessage id="main.loading" />;

    return (
        <Spin spinning={createLoading || updateLoading} tip={<IntlMessage id="main.submitting" />}>
            <Form  
                id="SchoolForm"
                                layout={'vertical'}
                form={form}
                name="control-hooks" 
                onFinish={onFinish}
            >
                <Form.Item name="name" label={<IntlMessage id="name" />} rules={[
                    { 
                        required: true,
                        message: <IntlMessage id="form.required" />
                    }
                ]}>
                    <Input />
                </Form.Item>
                <Form.Item name="nameMgl" label={<IntlMessage id="nameMgl" />} rules={[
                    { 
                        required: true,
                        message: <IntlMessage id="form.required" />
                    }
                ]}>
                    <Input />
                </Form.Item>
                
                <Form.Item name="school" label={<IntlMessage id="school" />} rules={[
                    { 
                        required: true,
                        message: <IntlMessage id="form.required" />
                    }
                ]}>
                    <Select
                        placeholder={<IntlMessage id="school" />}
                    >
                        {data?.allSchools.map((school, index) => (  
                            <Option key={index} value={school.id}>{school.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default SchoolForm