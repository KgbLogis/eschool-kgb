import React, { useEffect, useState } from 'react';
import { Form, message, Select, Spin } from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import { useMutation, useQuery } from '@apollo/client';
import { ALL_DAILY_MENUS, CREATE_DAILY_MENU } from 'graphql/food';
import { ALL_PROGRAMS } from 'graphql/all';

const { Option } = Select

function DailyMenuForm ({ closeModal, selectedData = {} }) {

    const [form] = Form.useForm();

    const [create, { loading: createLoading }] = useMutation(CREATE_DAILY_MENU, {
        refetchQueries: [ALL_DAILY_MENUS],
        onCompleted: data => {
            closeModal();
            message.success("Амжилттай хадгаллаа")
        }
    })

	const { data: programs } = useQuery(ALL_PROGRAMS)
    
    const onFinish = values => {
		create({ variables: values })
    };

    return (
        <Spin spinning={createLoading} tip="Ачааллаж байна...">
            <Form  
                id="form"
                layout={'vertical'}
                form={form}
                name="form" 
                onFinish={onFinish}
            >
                <Form.Item name="name" label={<IntlMessage id="name" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    }
                ]}>
					<Select>
						<Option value={'MORNING'} >Өглөө</Option>
						<Option value={'AFTERNOON'} >Өдөр</Option>
						<Option value={'EVENING'} >Орой</Option>
					</Select>
                </Form.Item>
                <Form.Item name="program" label={<IntlMessage id="program" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    }
                ]}>
					<Select>
						{ programs?.allPrograms.map((item, index) => (
							<Option key={index} value={item.id} >{item.program}</Option>
						))}
					</Select>
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default DailyMenuForm