import React, { useEffect } from 'react';
import { DatePicker, Empty, Form, message, Select, Spin } from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { ALL_PLANS, CREATE_PLAN, UPDATE_PLAN } from 'graphql/plan';
import { SECTIONS_BY_PROGRAM, SELECT_PROGRAM } from 'graphql/select';
import Loading from 'components/shared-components/Loading';
import moment from 'moment';

const { Option } = Select

function PlanForm ({ setIsModalVisible, editData }) {

    const [form] = Form.useForm();

    const [create, { loading: createLoading }] = useMutation(CREATE_PLAN, {
        refetchQueries: [ALL_PLANS],
        onCompleted: data => {
            setIsModalVisible(false);
            message.success("Амжилттай хадгаллаа")
        }
    })

    const [update, { loading: updateLoading }] = useMutation(UPDATE_PLAN, {
        refetchQueries: [ALL_PLANS],
        onCompleted: data => {
            setIsModalVisible(false);
            message.success("Амжилттай хадгаллаа")
        }
    })

    const { data: programs } = useQuery(SELECT_PROGRAM)

    const [fetchSection, { data: sections, loading: sectionLoading }] = useLazyQuery(SECTIONS_BY_PROGRAM)

    function onProgramSelect (program) {
        form.setFieldsValue({
            section: "",
            subject: ""
        });
        fetchSection({ variables: { program: program } })
    }

    useEffect(() => {
        if (editData.id) {
            const formData = {
                program: editData.section.program.id,
                section: editData.section.id,
                startDate: moment(editData.startDate),
                endDate: moment(editData.endDate)
            }
            fetchSection({ variables: { program: editData.section.program.id } })
            form.setFieldsValue(formData);
        } else {
            form.resetFields()
        }
    }, [editData])
    

    const onFinish = values => {
        values.startDate = moment(values.startDate).format("YYYY-MM-DD")
        values.endDate = moment(values.endDate).format("YYYY-MM-DD") 
        if (editData.id) {
            values.id = editData.id
            update({ variables: values })
        } else {
            create({ variables: values })
        }
    };

    return (
        <Spin spinning={createLoading || updateLoading} tip="Ачааллаж байна...">
            <Form  
                id="PlanForm"
                layout={'vertical'}
                form={form}
                name="school" 
                onFinish={onFinish}
            >
                <div className='grid grid-cols-2 gap-4'>
                    <Form.Item 
                        name="program" 
                        label={<IntlMessage id="program" />} 
                        rules={[
                            { 
                                required: true,
                                message: <IntlMessage id="form.required" /> 
                            }
                        ]}
                    >
                        <Select
                            onSelect={onProgramSelect}
                            allowClear
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            { programs?.allPrograms.map((program, index) => (
                                <Option value={program.id} key={index}>{program.program}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item 
                        name="section" 
                        label={<IntlMessage id="section" />} 
                        rules={[
                            { 
                                required: true,
                                message: <IntlMessage id="form.required" /> 
                            }
                        ]}
                    >
                        <Select
                            allowClear
                            notFoundContent={
                                sectionLoading ? <Loading cover='content' /> 
                                : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            }
                        >
                            { sections?.sectionsByProgram.map((section, index) => (
                                <Option value={section.id} key={index}>{section.classes.classes} / {section.section}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item 
                        name="startDate" 
                        label={<IntlMessage id="startAt" />} 
                        rules={[
                            { 
                                required: true,
                                message: <IntlMessage id="form.required" /> 
                            }
                        ]}
                    >
                        <DatePicker className='w-full'/>
                    </Form.Item>
                    <Form.Item 
                        name="endDate" 
                        label={<IntlMessage id="endAt" />} 
                        rules={[
                            { 
                                required: true,
                                message: <IntlMessage id="form.required" /> 
                            }
                        ]}
                    >
                        <DatePicker className='w-full'/>
                    </Form.Item>
                </div>
            </Form>
        </Spin>
    );
};

export default PlanForm