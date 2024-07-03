import React, { useRef, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Input, Form, Card, Select, message, Modal, Button, InputNumber, Upload, Divider } from 'antd';
import { DeleteTwoTone, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { ALL_QUESTION_LEVELS, DELETE_QUESTION, DELETE_QUESTION_CHOICE } from 'graphql/test';
import { ImageSvg } from 'assets/svg/icon';
import CustomIcon from 'components/util-components/CustomIcon';
import { BASE_SERVER_URL } from 'configs/AppConfig';
import IntlMessage from 'components/util-components/IntlMessage';

const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 32 },
};

const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 32, offset: 0 },
        sm: { span: 32, offset: 2 },
    },
};

const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;
const { Dragger } = Upload;


function QuestionFrom({ name, refetch, answerType, setNewQuestions, question, questionLevel, id, onlineTest, hint, questionChoiceSet, image }) {

    const formRef = useRef();
    const [form] = Form.useForm();

    const [selectedImage, setSelectedImage] = useState();

    const { data: levelData, loading: levelLoading } = useQuery(ALL_QUESTION_LEVELS, {
    });

    const [destroy] = useMutation(DELETE_QUESTION, {
        onCompleted: data => {
            refetch();
            message.success('Амжилттай устлаа');
        }
    });

    const [destroyChoice] = useMutation(DELETE_QUESTION_CHOICE, {
    })

    const handleDeleteChoice = (value) => {
        let choice = form.getFieldValue('choices')[value];
        if (choice !== undefined && choice.hasOwnProperty('id') ) {
            destroyChoice({ variables: { id: choice.id } });
        }
    }

    const handleDelete = () => {
        if (name === 'new') {
            confirm({
                title: 'Устгах уу?',
                okText: 'Устгах',
                okType: 'danger',
                cancelText: 'Болих',
                onOk() {
                    setNewQuestions(null);
                },
            });
        } else {
            confirm({
                title: 'Устгах уу?',
                okText: 'Устгах',
                okType: 'danger',
                cancelText: 'Болих',
                onOk() {
                    destroy({ variables: { id: id } }); 
                },
            });
        }
    }

    useEffect(() => {
        let handleChoiceData = [];
        
        if (name !== 'new') {
            questionChoiceSet.map((choice, index) => (
                handleChoiceData.push({
                    id: choice.id,
                    answer: choice.answer,
                    score: choice.score
                })
            ))
            form.setFieldsValue({
                id: id,
                questionLevel: questionLevel,
                questionL: question,
                answerType: answerType,
                onlineTest: onlineTest,
                hint: hint,
                choices: handleChoiceData,
                image: [image]
            }) 
        } else {
            form.setFieldsValue({
                answerType: answerType,
                onlineTest: onlineTest,
                choices: handleChoiceData
            }) 
        }

    }, [form, name, question, questionLevel, onlineTest, hint, questionChoiceSet, answerType, id, image])

    // ImageUpload

    const imageProps = {
        accept: '.jpg',
        name: 'file',
        multiple: false,
        listType: "picture-card",
        showUploadList: false,
        beforeUpload: file => {
            return false
        }
    };

    const onImageChange = (file) => {
        if (file) {
            setSelectedImage(file.file)
        }
    }

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    return ( 
        
        <Card 
            className='mt-4'
            actions={[
                <DeleteTwoTone twoToneColor="#eb2f96" key="delte" onClick={event => handleDelete()} />,
            ]}
        >
            <Form
                {...layout}
                form={form}
                name={name}
                ref={formRef}
            >
                <Form.Item hidden name="id">
                    <Input/>
                </Form.Item>
                <Form.Item name="onlineTest" hidden>
                    <Input />
                </Form.Item>
                <Form.Item hidden name="answerType">
                    <Input/>
                </Form.Item>
                <Form.Item
                    label={<IntlMessage id="level" />}
                    name="questionLevel"
                    rules={[{ required: true, message: 'Хоосон орхих боломжгүй!' }]}
                >
                    <Select
                        loading={levelLoading}
                    >
                        { levelData?.allQuestionLevels.map((level, index) => (
                            <Option key={index} value={level.id} >{level.level}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label={<IntlMessage id="question" />}
                    name="questionL"
                    rules={[{ required: true, message: 'Хоосон орхих боломжгүй!' }]}
                >
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    label={<IntlMessage id="question.hint" />}
                    name="hint"
                >
                    <TextArea rows={4} />
                </Form.Item>

                { (answerType === 'CHOOSE' || answerType === 'MULTIPLE')  === true && 
                    <Form.List name="choices">
                        {(fields, { add, remove }) => {
                            return (
                                <>
                                    {}
                                    {fields.map((field, index) => (
                                        <div key={field.key}>
                                            <Divider> 
                                                <IntlMessage id="question.answer" /> {field.key + 1}
                                            </Divider>
                                            <Form.Item
                                                name={[index, "id"]} 
                                                hidden
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item 
                                                name={[index, "answer"]} 
                                                label={<IntlMessage id="question.answer" />}
                                                rules={[
                                                    { 
                                                        required: true,
                                                        message: "Хоосон орхих боломжгүй!"
                                                    },
                                                ]}
                                            >
                                                <Input/>
                                            </Form.Item>
                                            <Form.Item 
                                                name={[index, "score"]} 
                                                label={<IntlMessage id="question.score" />}
                                                rules={[
                                                    { 
                                                        required: true,
                                                        message: "Хоосон орхих боломжгүй!"
                                                    },
                                                    
                                                ]}
                                            >
                                                <InputNumber min={0} max={100} bordered style={{ width: '100%' }} />
                                            </Form.Item>
                                            {fields.length > 1 ? (
                                                <Form.Item
                                                    {...formItemLayoutWithOutLabel}
                                                >
                                                    <Button
                                                        type="primary" danger
                                                        onClick={() => { handleDeleteChoice(index); remove(field.name);  }}
                                                        icon={<MinusCircleOutlined />}
                                                    >
                                                        Устгах
                                                    </Button>
                                                </Form.Item>
                                            ) : null}
                                        </ div>
                                    ))}
                                    <Form.Item
                                        {...formItemLayoutWithOutLabel}
                                    >
                                        <Button
                                            type="text"
                                            onClick={() => add()}
                                        >
                                            <PlusOutlined /> Хариулт нэмэх
                                        </Button>
                                    </Form.Item>
                                </>
                            );
                        }}
                    </Form.List>
                }
                <Form.Item 
                    label="Файл"
                    name="image"
                    valuePropName='fileList'
                    getValueFromEvent={normFile} 
                >
                    <Dragger
                        {...imageProps}
                        onChange={e => onImageChange(e)}
                    >
                        { selectedImage ?
                                <img style={{ maxHeight: "150px" }} src={URL.createObjectURL(selectedImage)} alt="avatar" className="img-fluid" /> 
                            :
                                <div>
                                    { image ?
                                        <img style={{ maxHeight: "150px" }} src={BASE_SERVER_URL+image} alt="avatar" className="img-fluid" /> 
                                        :
                                        <div>
                                            <CustomIcon className="display-3" svg={ImageSvg}/>
                                            <p>Файлыг байршуулахын тулд товшиж эсвэл чирнэ үү</p>
                                        </div>
                                    }
                                </div>
                        }
                    </Dragger>
                </Form.Item>
                <Form.Item >
                    <Button style={{float: 'right'}} type="primary" htmlType="submit"> <IntlMessage id="main.okText" /> </Button>
                </Form.Item>
            </Form>
        </Card>
     );
}

export default QuestionFrom;