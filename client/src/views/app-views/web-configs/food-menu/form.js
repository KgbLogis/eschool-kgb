import React, { useEffect } from 'react';
import { Form, Input, message, Select, Spin } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import IntlMessage from 'components/util-components/IntlMessage';
import { ALL_FOOD_MENUS, CREATE_FOOD_MENU, UPDATE_FOOD_MENU } from 'graphql/food';
import { ALL_PROGRAMS } from 'graphql/all';

const { Option } = Select

function DegreeForm({ formType, editData, setIsModalVisible }) {

    const [form] = Form.useForm();

    const [create, { loading: createLoading }] = useMutation(CREATE_FOOD_MENU, {
        refetchQueries: [
            { query: ALL_FOOD_MENUS },
            'allFoodMenus'
        ],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
        }
    });

    const [update, { loading: updateLoading }] = useMutation(UPDATE_FOOD_MENU, {
        refetchQueries: [
            { query: ALL_FOOD_MENUS },
            'allFoodMenus'
        ],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
        }
    });

    const { data: programs } = useQuery(ALL_PROGRAMS)

    useEffect(() => {
        if (formType === "edit") {
            const newData = {
                program: editData.program.id,
                name: editData.name
            }
            form.setFieldsValue(newData);
        } else if (formType === "create") {
            form.resetFields();
        }
    }, [editData, form, formType]);



    const onFinish = values => {
        if (formType === "edit") {
            values.id = editData.id;
            update({ variables: values });
        } else {
            create({ variables: values });
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
                <Form.Item name="program" label={<IntlMessage id="program" />} rules={[
                    {
                        required: true,
                        message: "Хоосон орхих боломжгүй"
                    }
                ]}>
                    <Select>
                        {programs?.allPrograms.map((item, index) => (
                            <Option key={index} value={item.id}>{item.program}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default DegreeForm