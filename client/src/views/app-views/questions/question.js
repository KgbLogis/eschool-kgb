import React, { useState } from 'react';
import { Form, Select, Typography, message, Button } from 'antd';
import { RollbackOutlined } from '@ant-design/icons'
import { useQuery, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { ALL_QUESTIONS_BY_TEST, CREATE_QUESTION, UPDATE_QUESTION, CREATE_QUESTION_CHOICE, UPDATE_QUESTION_CHOICE } from 'graphql/test';
import Loading from 'components/shared-components/Loading';
import QuestionFrom from './form';
import Flex from 'components/shared-components/Flex';
import IntlMessage from 'components/util-components/IntlMessage';

const { Option } = Select;
const { Text } = Typography;

const Question = (props) => {

    const history = useHistory();

    const [newQuestions, setNewQuestions] = useState(null);
    const [selected, setSelected] = useState(null);
    const [choices, setChoices] = useState([]);
    const test = [];

    const { loading, data, refetch } = useQuery(ALL_QUESTIONS_BY_TEST, {
        variables: { id: props.test }
    });

    const [create] = useMutation(CREATE_QUESTION, {
        onCompleted: data => {
            if (data.createQuestion.question.answerType !== "TEXT") {
                choices.map(function (choice) {
                    choice.question = data.createQuestion.question.id
                    return createChoice({ variables: choice })
                })
            }
            setNewQuestions(null);
            refetch();
            message.success('Амжилттай хадгаллаа');
        }
    });

    const [createChoice] = useMutation(CREATE_QUESTION_CHOICE, {
        onCompleted: data => {
            refetch();
        }
    });

    const [update] = useMutation(UPDATE_QUESTION, {
        onCompleted: data => {
            setNewQuestions(null);
            if (data.updateQuestion.question.answerType !== "TEXT") {
                choices.map(function (choice) {
                    choice.question = data.updateQuestion.question.id
                    if (choice.id === undefined) {
                        return createChoice({ variables: choice })
                    }
                    return updateChoice({ variables: choice })
                })
            }
            message.success('Амжилттай хадгаллаа');
        }
    });

    const [updateChoice] = useMutation(UPDATE_QUESTION_CHOICE, {
        onCompleted: data => {
            refetch();
        }
    });

    const newQuestion = value => {
        setNewQuestions(value)
        setSelected(null);
    }

    if (loading) {
        return <Loading cover="content" />
    }
    
    return ( 
        <>
            <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                <Flex mobileFlex={false}>
                    <div className='text-right' >
                        <Button onClick={() => history.goBack()} type="default" icon={<RollbackOutlined />} block> {<IntlMessage id="back" />}</Button>
                    </div>
                </Flex>
            </Flex>
            <Form.Provider
                onFormFinish={(name, { values, forms }) => {
                    if (values.choices && values.choices.length !== 0 ) {
                        setChoices(values.choices);
                    }
                    if (values.hint === undefined) {
                        values.hint = '';
                    }
                    if (values.id === undefined) {
                        if (values.image !== undefined) {
                            values.image = values.image.slice(-1)[0].originFileObj;
                        } 
                        if (values.image === undefined) {
                            values.image = '';
                        }
                        create({ variables: values });
                    } else {
                        if (values.image !== undefined && values.image.slice(-1)[0].originFileObj) {
                            values.image = values.image.slice(-1)[0].originFileObj;
                        } else {
                            values.image = values.image.slice(-1)[0];
                        }
                        update({ variables: values });
                    }
                }}
            >
                { data.allQuestionsByTest.map(function (question, index) {
                    test.push({ formName: question.id })
                    return (
                        <QuestionFrom 
                            key={index} 
                            name={question.id} 
                            refetch={refetch}
                            id={question.id}
                            answerType={question.answerType} 
                            question={question.question} 
                            questionLevel={question.questionLevel.id} 
                            hint={question.hint}
                            onlineTest={props.test}
                            questionChoiceSet={question.questionChoiceSet}
                            image={question.image}
                        />
                    )
                })}
                { newQuestions && 
                    <QuestionFrom 
                        onlineTest={props.test}
                        answerType={newQuestions} 
                        setNewQuestions={setNewQuestions} 
                        name='new' 
                        refetch={refetch}
                    />
                }
                <Text strong>{<IntlMessage id="add-question" />}: </Text>
                <Select 
                    className='mt-4'
                    onChange={newQuestion}
                    value={selected}
                    style={{ width: '20%' }}
                >
                    <Option value="CHOOSE"><IntlMessage id="question.choose" /></Option>
                    <Option value="MULTIPLE"><IntlMessage id="question.multiple" /></Option>
                    <Option value="TEXT"><IntlMessage id="question.text" /></Option>
                </Select>
            </Form.Provider>
        </>
    );
}

export default Question;