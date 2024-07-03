import React, { useState } from 'react'
import { Button, Card, Form, InputNumber, message, Modal, Select, Table } from 'antd'
import { PlusCircleOutlined, DeleteTwoTone } from '@ant-design/icons'
import IntlMessage from 'components/util-components/IntlMessage'
import { ALL_ONLINE_TESTS, ALL_QUESTION_LEVELS, ALL_TAKE_LEVEL, CREATE_TAKE_LEVEL, DELETE_TAKE_LEVEL } from 'graphql/test';
import { useMutation, useQuery } from '@apollo/client';

const { Option } = Select;
const { confirm } = Modal;

const TakeLevel = ({ takeTest }) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [data, setData] = useState([]);

    const { data: testsData } = useQuery(ALL_ONLINE_TESTS);
    const { data: levelsData } = useQuery(ALL_QUESTION_LEVELS);

    const [levelform] = Form.useForm();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const { loading, refetch } = useQuery(ALL_TAKE_LEVEL, {
        variables: { takeTest: takeTest },
        onCompleted: data => {
            setData(data.allTakeLevelByTest);
        }
    });

    const [create] = useMutation(CREATE_TAKE_LEVEL, {
        onCompleted: data => {
            refetch();
            setIsModalVisible(false);
            levelform.resetFields();
            message.success('Амжилттай хадгаллаа');
        }
    });

    
    const [destroy] = useMutation(DELETE_TAKE_LEVEL, {
        onCompleted: data => {
            refetch();
            message.success('Амжилттай устлаа!');
        }
    });

    const handleDestroy = value => {
        confirm({
            title: 'Устгах уу?',
            okText: 'Устгах',
            okType: 'danger',
            cancelText: 'Болих',
            onOk() {
                destroy({ variables: {id: value} })
            },
        });
    }

    const columns = [
        {
            title: <IntlMessage id="online-test-library" />,
            dataIndex: ['onlineTest', 'title'],
            key: 'title',
        },
        {
            title: <IntlMessage id="test-level" />,
            dataIndex: ['questionLevel', 'level'],
            key: 'level',
        },
        {
            title: <IntlMessage id="takeNumber" />,
            dataIndex: 'takeNumber',
            key: 'takeNumber',
        },
        {
            title: <IntlMessage id="main.action" />,
            dataIndex: 'id',
            key: 'id',
            render: (_, elm) => (
                <div className="text-center">
                    <Button size="small" onClick={() => handleDestroy(elm.id)} type="text" icon={<DeleteTwoTone twoToneColor="#f42f2f"/>} > <IntlMessage id="delete" /></Button>
                </div>
            )
        },
    ]
    
    const onCreate = values => {
        values.takeTest = takeTest
        create({ variables: values });
    }
    return (
        <>
            <Modal
                visible={isModalVisible}
                title={<IntlMessage id="add-question" />}
				okText={<IntlMessage id="main.okText" />}
				cancelText={<IntlMessage id="main.cancelText" />}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => {
                    levelform
                    .validateFields()
                    .then(values => {
                        onCreate(values);
                    })
                }}
            >
                <Form
                    form={levelform}
                    layout="vertical"
                    name="LevelForm"
                >
                    <Form.Item
                        name="onlineTest"
                        label={<IntlMessage id="online-test-library" />}
                        rules={[
                            {
                            required: true,
                            message: 'Please input the title of collection!',
                            },
                        ]}
                    >
                        <Select>
                            { testsData?.allOnlineTests.map((test, index) => (
                                <Option key={index} value={test.id} >{test.title}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="questionLevel"
                        label={<IntlMessage id="test-level" />}
                        rules={[
                            {
                            required: true,
                            message: 'Please input the title of collection!',
                            },
                        ]}
                    >
                        <Select>
                            { levelsData?.allQuestionLevels.map((test, index) => (
                                <Option key={index} value={test.id} >{test.level}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="takeNumber"
                        label={<IntlMessage id="takeNumber" />}
                        rules={[
                            {
                            required: true,
                            message: 'Please input the title of collection!',
                            },
                        ]}
                    >
                        <InputNumber min={1}  style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
            <Card 
                loading={loading}
                className='mt-4'
                title={<IntlMessage id="question" />}
                extra={<Button onClick={showModal} type="primary" icon={<PlusCircleOutlined />} block> {<IntlMessage id="add-question" />}</Button>}
            >
                <Table
                    className='mt-4'
                    rowKey='id'
                    pagination={false}
                    bordered
                    scroll={{ x: 300 }}
                    columns={columns}
                    dataSource={data} 
                />
            </Card>
        </>
    )
}

export default TakeLevel