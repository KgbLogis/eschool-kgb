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

    let filledForm = 0;
    
    const { data, loading, refetch } = useQuery(START_TEST, {
        variables: { takeTest: slug.test }
    })

    const [getTime, { data: timeData, loading: timeLoading }] = useLazyQuery(TEST_TIME, {
    })

    const [finishTest] = useLazyQuery(FINISH_TEST, {
        onCompleted: data => {
            message.warning('Шалгалт дууссан!')
            history.push({pathname: '/app/my-score', state: {message: data}})
        }
    })
    
    const [page, setPage] = useState(0);
    const [load, setLoad] = useState(true);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        const newData = [];
        if (data && loading === false && data.startTest !== null) {
            getTime({variables: { takeTest: slug.test }});
            let a = null;
            let b = null;
            data.startTest.map(function (d, index) {
                let c = [];

                if (d.answerType === ('CHOOSE')) {
                    a = d.choices.split(',|')
                    a.pop();
                    a.map(function (e) {
                        b = e.split(':|');
                        return c.push({
                            value: b[0],
                            text: b[1]
                        });
                    });
                }
                if (d.answerType === ('MULTIPLE' )) {
                    a = d.choices.split(',|')
                    a.pop();
                    a.map(function (e) {
                        b = e.split(':|');
                        return c.push({
                            value: b[0],
                            text: b[1]
                        });
                    });
                }
                return newData.push({
                    hint: d.question.hint,
                    image: d.question.image,
                    answerType: d.answerType,
                    givenAnswer: d.givenAnswer,
                    id: d.id,
                    questionText: d.questionText,
                    choices: c
                })
            })
            setAnswers(newData);
            setLoad(false);
        }
        if (timeData && timeLoading === false && timeData.testTime !== null) {
            let splitStart = timeData.testTime.started.split('+')
            splitStart = splitStart[0];
            let splitEnd = timeData.testTime.endAt.split('+')
            splitEnd = splitEnd[0];
            const endAt = moment(splitEnd);
            const startedAt = moment(splitStart);
            const current = moment();
            if (moment.duration(endAt.diff(current)).asMilliseconds() < 0) {
                return message.error('Хугацаа дууссан байна!')
            } else {
                if (moment(startedAt).add(timeData.testTime.duration, 'm').valueOf() <=  moment(endAt).valueOf()) {
                    if (moment.duration(moment(startedAt).add(timeData.testTime.duration, 'm').diff(current)).asMilliseconds() < 0) {
                        setIsFinished(true);
                    } else {
                        setLeftTime(moment(startedAt).add(timeData.testTime.duration, 'm'))
                    }
                } else {
                    setLeftTime(endAt)
                }
            }
        }   
        if (isFinished) {
            // finishTest({ variables: { takeTest: slug.test } })
        }
        if (data && loading === false && data.startTest === null) {
            // finishTest({ variables: { takeTest: slug.test } })
            // message.warning('Шалгалт дууссан!')
        }
    }, [data, finishTest, getTime, isFinished, loading, slug.test, timeData, timeLoading])

    const handleChange = (value) => {
        setPage(value);
    }

    const next = value => {
        setPage(page + 1)
    }

    const prev = value => {
        setPage(page - 1)
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

    if (load) {
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