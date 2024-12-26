import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Typography, Input, Radio, Checkbox, Image, Modal, Result } from 'antd';
import {
    LeftOutlined,
    RightOutlined,
    DoubleRightOutlined,
    CheckOutlined
} from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { UPDATE_ANSWER } from 'graphql/test';
import { BASE_SERVER_URL } from "configs/AppConfig";
import IntlMessage from 'components/util-components/IntlMessage';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 24 },
};
const tailLayout = {
    wrapperCol: { span: 32 },
};

const ExamForm = ({ answer, refetch, next, prev, setIsFinished, page, answers }) => {

    const [form] = Form.useForm();
    const [question, setQuestion] = useState(answer);

    useEffect(() => {
        if (answer) {
            const selectedAnswers = [];
            let selectedAnswer = "";

            setQuestion(answer)
            if (answer !== answer.givenAnswer) {
                if (answer.answerType === "TEXT") {
                    form.setFieldsValue({
                        givenAnswer: answer.givenAnswer
                    });
                }
                if (answer.answerType === "MULTIPLE") {
                    let splitted = answer?.givenAnswer.split(',|')
                    splitted.pop();
                    splitted.map(sValue => (
                        answer.choices.filter(choice => choice.text === sValue).map(aValue => (selectedAnswers.push(aValue.value)))
                    ))
                    form.setFieldsValue({
                        givenAnswer: selectedAnswers
                    });
                }
                if (answer.answerType === "CHOOSE") {
                    answer.choices.filter(choice => choice.text === answer.givenAnswer).map(aValue => (selectedAnswer = aValue.value))
                    form.setFieldsValue({
                        givenAnswer: selectedAnswer
                    });
                }
            }
        }
    }, [answer, form, question])

    const [updateAnswer, { loading: updateLoading }] = useMutation(UPDATE_ANSWER, {
        onCompleted: data => {
            refetch();
            next();
        }
    })

    const onFinish = (valuess) => {
        valuess.id = question.id;
        if (question.answerType === 'MULTIPLE') {
            valuess.givenAnswer = valuess.givenAnswer.map((values) => `${values}`).join(',');
        }
        updateAnswer({ variables: valuess });
    }

    const finishTest = () => {
        confirm({
            title: "Шалгалт дуусгах уу?",
            okText: "Дуусгах",
            cancelText: "Болих",
            onOk() {
                setIsFinished(true)
            },
        });
    }

    if (question === undefined) {
        return <Result
            title="Асуулт алга байна!"
        />
    }

    return (
        <Card className='bg-emind/5'>
            <Title level={3}><IntlMessage id="question" /> {page + 1}</Title>
            <Paragraph >
                {question.questionText}
            </Paragraph>
            {answer.hint &&
                <div>
                    <Title type="secondary" level={4}><IntlMessage id="question.hint" /></Title>
                    <Text type="secondary">
                        {answer.hint}
                    </Text>
                </div>
            }
            {answer.image &&
                <div className="p-2">
                    <Image preview={false} style={{ maxHeight: '400px' }} className="img-fluid" alt="Preview" src={BASE_SERVER_URL + answer.image} />
                </div>
            }
            <Form
                {...layout}
                layout="vertical"
                form={form}
                name="control-hooks"
                onFinish={onFinish}
                initialvaluess={{
                    givenAnswer: question.givenAnswer
                }}
            >
                {
                    question.answerType === 'TEXT' ? (
                        <Form.Item name="givenAnswer" label={<IntlMessage id="question.answer" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <TextArea rows={4} />
                        </Form.Item>
                    ) : null
                }
                {
                    question.answerType === 'CHOOSE' ? (
                        <Form.Item name="givenAnswer" label={<IntlMessage id="question.answer" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Radio.Group>
                                <div className='flex flex-col gap-2'>
                                    {question.choices.map((choice, index) => (
                                        <Radio value={choice.value} key={index} >{choice.text}</Radio>
                                    ))}
                                </div>
                            </Radio.Group>
                        </Form.Item>
                    ) : null
                }
                {
                    question.answerType === 'MULTIPLE' ? (
                        <Form.Item name="givenAnswer" label={<IntlMessage id="question.answer" />} rules={[{ required: true }]}>
                            <Checkbox.Group>
                                <div className='flex flex-col gap-2 justify-start'>
                                    {question.choices.map((choice, index) => (
                                        <Checkbox value={choice.value} key={index} >{choice.text}</Checkbox>
                                    ))}
                                </div>
                            </Checkbox.Group>
                        </Form.Item>
                    ) : null
                }
                <Form.Item {...tailLayout}>
                    <Button disabled={page < 1 && true} className="mr-2" type="primary" htmlType="button" loading={updateLoading} onClick={() => prev()}>
                        <LeftOutlined /> <IntlMessage id="main.previous" />
                    </Button>
                    <Button disabled={page + 1 === answers.length} type="danger" className="mr-2" htmlType="button" loading={updateLoading} onClick={() => next()}>
                        <IntlMessage id="main.skip" /> <DoubleRightOutlined />
                    </Button>
                    <Button disabled={page + 1 === answers.length} className="mr-2" type="primary" htmlType="submit" loading={updateLoading}>
                        <IntlMessage id="main.next" /> <RightOutlined />
                    </Button>
                    {page + 1 === answers.length &&
                        <Button style={{ float: 'right', background: "#5aac44", borderColor: "#5aac44", color: "#fff" }} className="mr-2" type="danger" htmlType="submit" onClick={() => finishTest()}>
                            <CheckOutlined /> <IntlMessage id="main.finish-exam" />
                        </Button>
                    }
                </Form.Item>
            </Form>
        </Card>
    )

}

export default ExamForm