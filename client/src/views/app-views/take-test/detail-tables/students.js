import React, { useState } from 'react'
import { Badge, Button, Card, Col, Descriptions, message, Modal, Row, Table, Tag, Typography } from 'antd'
import { DeleteOutlined, DeleteTwoTone, EyeTwoTone } from '@ant-design/icons'
import { useMutation } from '@apollo/client'
import IntlMessage from 'components/util-components/IntlMessage'
import { DELETE_PARTICIPANT } from 'graphql/test'
import moment from 'moment'

const { confirm } = Modal;
const { Title } = Typography;

const Students = ({ data, refetch, takeTest, loading }) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentStudent, setCurrentStudent] = useState();

    const [destroyParticipant] = useMutation(DELETE_PARTICIPANT, {
        onCompleted: data => {
            refetch();
            message.success('Амжилттай устлаа!');
        }
    })

    const handleDestroyParticipant = value => {
        if (value === 0) {
            confirm({
                title: 'Устгах уу?',
                okText: 'Устгах',
                okType: 'danger',
                cancelText: 'Болих',
                onOk() {
                    destroyParticipant({ variables: { takeTest: takeTest, id: value} })
                },
            });
        } else {
            confirm({
                title: 'Устгах уу?',
                okText: 'Устгах',
                okType: 'danger',
                cancelText: 'Болих',
                onOk() {
                    destroyParticipant({ variables: { takeTest: 0, id: value} })
                },
            });
        }
    }

    const handleShow = (value) => {
        setCurrentStudent(value);
        setIsModalVisible(true)
    }

    const handleCancel = () => {
        setCurrentStudent();
        setIsModalVisible(false)
    }

    const columns = [
        {
            title: <IntlMessage id="studentCode" />,
            dataIndex: ['student', 'studentCode'],
            key: 'studentCode',
        },
        {
            title: <IntlMessage id="name" />,
            key: 'name',
            children: [
                {
                    title: <IntlMessage id="familyName" />,
                    dataIndex: ['student', 'familyName'],
                    key: 'familyName',
                },
                {
                    title: <IntlMessage id="name" />,
                    dataIndex: ['student', 'name'],
                    key: 'name',
                },
            ]
        },
        {
            title: <IntlMessage id="status" />,
            children: [
                {
                    title: <IntlMessage id="started" />,
                    dataIndex: 'started',
                    key: 'started',
                    render: text => {
                        const color = text === null ? 'orange' : 'geekblue';
                        const tag =  text === null ? 'Эхлээгүй' : moment(text).format('MM-сар HH-цаг mm-минут ')
                        return (<Tag color={color} >{tag}</Tag>)
                    }
                },
                {
                    title: <IntlMessage id="completed" />,
                    dataIndex: 'completed',
                    key: 'completed',
                    render: text => {
                        const color = text === null ? 'orange' : 'green';
                        const tag =  text === null ? 'Дуусгаагүй' : moment(text).format('MM-сар HH-цаг mm-минут ')
                        return (<Tag color={color} >{tag}</Tag>)
                    }
                },
            ]
        },
        {
            title: <IntlMessage id="main.action" />,
            dataIndex: 'id',
            key: 'id',
            width: '30px',
            render: (_, elm) => (
                <>
                    <div className="text-center">
                        <Button size="small" onClick={() => handleShow(elm)} type="text" icon={<EyeTwoTone />} > <IntlMessage id="show" /></Button>
                    </div>
                    <div className="text-center">
                        <Button size="small" onClick={() => handleDestroyParticipant(elm.id)} type="text" icon={<DeleteTwoTone twoToneColor="#f42f2f"/>} > <IntlMessage id="delete" /></Button>
                    </div>
                </>
            )
        },
    ]

    const RenderChoices = ({ values }) => {
        const allChoices = [];
        const choices = values.split(',|')
        choices.pop();
        choices.map(function (e) {
            const splitted = e.split(':|');
            return allChoices.push({
                value: splitted[0],
                text: splitted[1]
            });
        });
        return (
            allChoices.map(choice => (
                <Badge className='px-5' key={choice.value} color={'blue'} text={choice.text} />
            ))
        )
    }

    const RenderAnswers = ({ values }) => {
        const allAnswers = values.split(',|')
        return (
            allAnswers.map((answer, index) => {
                if (answer === "") {
                    return null
                }
                return (<Badge className='px-5' key={index} color={'blue'} text={answer} />)
            })
        )
    }

    return (
        <>
            <Modal
                visible={isModalVisible}
				okText={<IntlMessage id="main.next" />}
				cancelText={<IntlMessage id="main.cancelText" />}
                onCancel={() => handleCancel()}
                footer={[
                    <Button key="back" type="primary" onClick={() => handleCancel()}>
                      Хаах
                    </Button>
                ]}
                width={1000}
            >
                { currentStudent ? 
                    <Typography>
                        <Title>{currentStudent.student.studentCode} / {currentStudent.student.familyName} {currentStudent.student.name}</Title>
                        <Row gutter={[8, 8]}>
                            <Col span={12} >
                                <Title level={5} >Эхэлсэн цаг</Title>
                                {currentStudent.started === null ? 'Эхлээгүй' : moment(currentStudent.started).format('MM-сар HH-цаг mm-минут ')}
                            </Col>
                            <Col span={12} >
                                <Title level={5} >Төлөв</Title>
                                {currentStudent.completed === null ?  <Badge color={'gold'} text={'Эхлээгүй'} /> : 
                                    <Badge color={'green'} text={'Дууссан'} />
                                }
                            </Col>
                        </Row>
                        { currentStudent.answerSet.map((item, index) => (
                            <Descriptions key={index} className='mt-4' title={item.questionText} bordered>
                                { item.answerType === 'TEXT' ?
                                    <Descriptions.Item label="Хариулт" span={3}>{item.givenAnswer}</Descriptions.Item>
                                    : 
                                    <>
                                        <Descriptions.Item label="Сонголтууд" span={3}>
                                            <RenderChoices values={item.choices} />
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Хариулт" span={3}>
                                            <RenderAnswers values={item.givenAnswer} />
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Авсан оноо" span={3}>{item.score}</Descriptions.Item>
                                    </>
                                }
                            </Descriptions>
                        ))}
                    </Typography>
                    : null
                }
            </Modal>
            <Card 
                loading={loading}
                className='mt-4'
                title={<IntlMessage id="student" />}
                extra={<Button onClick={() => handleDestroyParticipant(0)} type="danger" icon={<DeleteOutlined />} block> <IntlMessage id="delete-all" /></Button>}
            >
                <Table
                    className='mt-2'
                    columns={columns} 
                    rowKey='id'
                    bordered
                    pagination={false}
                    dataSource={data} 
                />
            </Card>
        </>
    )
}

export default Students