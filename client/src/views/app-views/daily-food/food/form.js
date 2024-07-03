import React from 'react';
import { Form, message, Select, Spin } from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { ALL_DAILY_MENU_FOODS, ALL_FOODS, ALL_FOOD_MENUS, CREATE_DAILY_MENU_FOOD } from 'graphql/food';
import { useParams } from 'react-router-dom';

const { Option } = Select

function DailyMenuForm ({ closeModal, selectedData = {} }) {

    const [form] = Form.useForm();

    const { dailyMenu } = useParams()

    const [create, { loading: createLoading }] = useMutation(CREATE_DAILY_MENU_FOOD, {
        refetchQueries: [{
            query: ALL_DAILY_MENU_FOODS,
            variables: { dailyMenu: dailyMenu }
        }],
        onCompleted: data => {
            closeModal();
            message.success("Амжилттай хадгаллаа")
        }
    })

	const { data: menus } = useQuery(ALL_FOOD_MENUS)
    const [fetchFoods, { data: foods }] = useLazyQuery(ALL_FOODS)

    function onMenuChange(value) {
        fetchFoods({ variables: { foodMenu: value } });
    }
    
    const onFinish = values => {
        values.dailyMenu = dailyMenu
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
                <Form.Item name="menus" label={'Цэс'} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    }
                ]}>
					<Select
                        onSelect={onMenuChange}
                    >
						{ menus?.allFoodMenus.map((item, index) => (
							<Option key={index} value={item.id} >{item.name}</Option>
						))}
					</Select>
                </Form.Item>
                <Form.Item name="food" label={'Хоол'} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    }
                ]}>
					<Select>
						{ foods?.allFoods.map((item, index) => (
							<Option key={index} value={item.id} >{item.name}</Option>
						))}
					</Select>
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default DailyMenuForm