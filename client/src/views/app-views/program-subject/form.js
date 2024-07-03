import React, { useState } from 'react';
import { Empty, Form, message, Select, Spin } from 'antd';
import { useLazyQuery, useMutation } from '@apollo/client';
import { CREATE_PROGRAM_SUBJECT, ALL_PROGRAM_SUBJECT_BY_PROGRAM } from 'graphql/custom';
import IntlMessage from 'components/util-components/IntlMessage';
import { SELECT_SUBJECT } from 'graphql/select';
import Loading from 'components/shared-components/Loading';

const { Option } = Select;

function SchoolForm({ program, setIsModalVisible }) {

    const [form] = Form.useForm();

    const [subjects, setSubjects] = useState([]);

    const [fetchData, { loading }] = useLazyQuery(SELECT_SUBJECT, {
        onCompleted: data => {
            setSubjects(data.allSubjects)
        }
    });

    const [create, { loading: createLoading }] = useMutation(CREATE_PROGRAM_SUBJECT, {
        refetchQueries: [{
            query: ALL_PROGRAM_SUBJECT_BY_PROGRAM,
            variables: { id: program }
        }],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
        }
    });

    const onFinish = values => {
        values.program = program;
        create({ variables: values })
    };

    const onSearch = value => {
        if (value === '') {
            setSubjects([]);
        } else {
            fetchData({ variables: { offset: 0, limit: 10000000, filter: value } })
        }
    }

    return (
        <Spin spinning={createLoading} tip="Ачааллаж байна...">
            <Form
                id="SchoolForm"
                layout={'vertical'}
                form={form}
                name="school"
                onFinish={onFinish}
            >
                <Form.Item name="subject" label={<IntlMessage id="subject" />} rules={[
                    {
                        required: true,
                        message: <IntlMessage id="form.required" />
                    },
                ]}>
                    <Select
                        showSearch
                        filterOption={false}
                        notFoundContent={
                            loading ? <Loading cover='content' />
                                : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        }
                        onSearch={onSearch}
                    >
                        {subjects.map((item, index) => (
                            <Option value={item.id} key={index} >
                                {item.subject} / {item.content} / {item.createUserid.lastName} {item.createUserid.firstName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default SchoolForm