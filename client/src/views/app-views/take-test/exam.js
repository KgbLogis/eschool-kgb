import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';
import { Card, Col, Row, Statistic, Button, message } from 'antd';
import { START_TEST, TEST_TIME, FINISH_TEST } from 'graphql/test';
import moment from 'moment';
import ExamForm from './exam-form';
import Loading from 'components/shared-components/Loading';
import IntlMessage from 'components/util-components/IntlMessage';

const { Countdown } = Statistic;

const Exam = () => {

    const slug = useParams();
    const history =  useHistory();

    const [leftTime, setLeftTime] = useState(null);
    const [isFinished, setIsFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [page, setPage] = useState(0);
    const [answers, setAnswers] = useState([]);

    let filledForm = 0;

    const [getTime] = useLazyQuery(TEST_TIME, {
        onCompleted: data => {
            const endAt = moment(data.testTime.endAt);
            const startedAt = moment(data.testTime.started);
            const current = moment();
            if (moment.duration(endAt.diff(current)).asMilliseconds() < 0) {
                return message.error('Хугацаа дууссан байна!')
            } else {
                if (moment(startedAt).add(data.testTime.duration, 'm').valueOf() <=  moment(endAt).valueOf()) {
                    if (moment.duration(moment(startedAt).add(data.testTime.duration, 'm').diff(current)).asMilliseconds() < 0) {
                        // setIsFinished(true);
                    } else {
                        setLeftTime(moment(startedAt).add(data.testTime.duration, 'm'))
                    }
                } else {
                    setLeftTime(endAt)
                }
            }
        }
    })

    const [finishTest] = useLazyQuery(FINISH_TEST, {
        onCompleted: data => {
            message.warning('Шалгалт дууссан!')
            history.push({pathname: '/app/my-score', state: {message: data}})
        }
    })

    const { refetch } = useQuery(START_TEST, {
        variables: { takeTest: slug.test },
        onCompleted: data => {
            getTime({variables: { takeTest: slug.test }})
            const newData = [];
            if (data.startTest === null) {
                setIsFinished(true);
            } else {
                data.startTest.map(function (item) {
                    let allChoices = [];
    
                    if (item.answerType === ('CHOOSE') || item.answerType === ('MULTIPLE' )) {
                        const choices = item.choices.split(',|')
                        choices.pop();
                        choices.map(function (e) {
                            const splitted = e.split(':|');
                            return allChoices.push({
                                value: splitted[0],
                                text: splitted[1]
                            });
                        });
                    }
                    return newData.push({
                        hint: item.question.hint,
                        image: item.question.image,
                        answerType: item.answerType,
                        givenAnswer: item.givenAnswer,
                        id: item.id,
                        questionText: item.questionText,
                        choices: allChoices
                    })
                })
                setAnswers(newData);
                setLoading(false);
            }
        }
    })

    useEffect(() => {
        if (isFinished) {
            finishTest({ variables: { takeTest: slug.test } })
        }
    }, [finishTest, isFinished, slug])

    const handleChange = (value) => {
        setPage(value);
    }

    const next = () => {
        if (answers.length > page + 1) {
            setPage(prevPage => (prevPage + 1))
        }
    }

    const prev = () => {
        setPage(prevPage => (prevPage - 1))
    }

    const Buttons = ({ answer, index }) => {
        if (index === page) {
            return (
                <Button 
                    key={index}
                    shape="circle" 
                    type="dashed"
                    style={{ background: "#dde3df", borderColor: "#3c8dbc" }}
                    className='mx-1' 
                    size='small'
                    onClick={() => handleChange(index)}
                >
                    {index+1}
                </Button>
            )
        }
        if (answer.givenAnswer === "") {
             return <Button 
                key={index}
                shape="circle"
                className='mx-1' 
                size='small'
                onClick={() => handleChange(index)}
            >
                {index+1}
            </Button>
        } 
        return (
            <Button 
                key={index}
                shape="circle" 
                type="primary"
                className='mx-1' 
                size='small'
                onClick={() => handleChange(index)}
            >
                {index+1}
            </Button>
        )
    }

    if (loading) {
        return <Loading cover="content" />
    }

    return (
        <div>
            <Row gutter={[8, 16]}>
                <Col xs={24} xl={18}>
                    <ExamForm 
                        answer={answers[page]}
                        answers={answers}
                        page={page}
                        next={next}
                        prev={prev}
                        refetch={refetch}
                        setIsFinished={setIsFinished}
                    />
                </Col>
                <Col xs={24} xl={6}>
                    <Card>
                        <Countdown 
                            title={<span className='mb-4' ><IntlMessage id="exam.time-left" /></span>}  
                            value={leftTime} 
                            onFinish={() => setIsFinished(true)} 
                        />
                    </Card>
                    <Card
                        title={<IntlMessage id="question" />}
                    >
                        { answers.map(function (answer, index) {
                            filledForm = filledForm + 1
                            return (
                                <Buttons answer={answer} key={index} index={index} />
                            )
                        })}
                    </Card>
                    <Card
                        title={<IntlMessage id="exam.recommendations" />}
                    >
                        <div className='mt-2'>
                            <Button shape="circle" type='dashed' style={{ background: "#dde3df", borderColor: "#3c8dbc" }} className='mx-1' size='small'>
                                1
                            </Button>
                            <IntlMessage id="exam.current" />
                        </div>
                        <div className='mt-2'>
                            <Button shape="circle" type='primary' className='mx-1' size='small'>
                                2
                            </Button>
                            <IntlMessage id="exam.completed" />
                        </div>
                        <div className='mt-2'>
                            <Button shape="circle" className='mx-1' size='small'>
                                3
                            </Button>
                            <IntlMessage id="exam.uncompleted" />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )

}

export default Exam;