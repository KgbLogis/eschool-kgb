import React, { useEffect } from 'react';
import { Form, Input, message, Spin, DatePicker, Switch } from 'antd';
import { useMutation } from '@apollo/client';
import moment from 'moment';
import { ALL_SCHOOLYEAR, CREATE_SCHOOLYEAR, UPDATE_SCHOOLYEAR } from 'graphql/core';
import IntlMessage from 'components/util-components/IntlMessage';


const { RangePicker } = DatePicker;

function DegreeForm ({formType, editData, setIsModalVisible}) {

    const [form] = Form.useForm();

    const [createSchoolYear, { loading: createLoading }] = useMutation(CREATE_SCHOOLYEAR, {
        refetchQueries: [ALL_SCHOOLYEAR],
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            form.resetFields();
            setIsModalVisible(false);
		}
	});

    const [updateSchoolYear, { loading: updateLoading }] = useMutation(UPDATE_SCHOOLYEAR, {
        refetchQueries: [ALL_SCHOOLYEAR],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            form.resetFields();
            setIsModalVisible(false);
        }
    });

    useEffect(() => {
        if(formType === "edit") {
            const newData ={
                schoolyear: editData.schoolyear,
                // season: editData.season,
                // semesterCode: editData.semesterCode,
                isCurrent: editData.isCurrent,
                dates: [moment(editData.startDate), moment(editData.endDate)],
			}
            form.setFieldsValue(newData);
        } else if(formType === "create") {
            form.resetFields();
        }
    }, [editData, form, formType]);

    

    const onFinish = values => {

        if (values.isCurrent === undefined) {
            values.isCurrent = false
        }

        values.dates.map(function (date, index) {
            if (index === 0) {
                values.startDate = moment(date).format("YYYY-MM-DD")
            } else {
                values.endDate = moment(date).format("YYYY-MM-DD") 
            }
            return null
        })

        if (values.hasOwnProperty('endDate')) {
            if (formType === "edit") {
                values.id = editData.id;
                updateSchoolYear({ variables: values });
            } else {
                createSchoolYear({ variables: values });
            }
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
                <Form.Item name="schoolyear" label={<IntlMessage id="schoolyear" />} rules={[
                    { 
                        required: true,
                        message: "Хоосон орхих боломжгүй"
                    }
                ]}>
                    <Input />
                </Form.Item>
                <Form.Item name="isCurrent" label={<IntlMessage id="isCurrent" />} valuePropName="checked">
                    <Switch checkedChildren={<IntlMessage id="current" />} unCheckedChildren={<IntlMessage id="!current" />} />
                </Form.Item>
                <Form.Item name="dates" label={<IntlMessage id="start_end_date" />} rules={[
                    { 
                        required: true,
                        message: "Хоосон орхих боломжгүй"
                    }
                ]}>
                    <RangePicker />
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default DegreeForm