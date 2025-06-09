import { useMutation, useQuery } from '@apollo/client';
import { Button, Card, Form, Input, Spin, Upload, message } from 'antd';
import { ImageSvg } from 'assets/svg/icon';
import CustomIcon from 'components/util-components/CustomIcon';
import IntlMessage from 'components/util-components/IntlMessage';
import { APP_PREFIX_PATH, BASE_SERVER_URL } from 'configs/AppConfig';
import { ALL_NEWS, CREATE_NEWS, NEWS_BY_ID, UPDATE_NEWS } from 'graphql/news';
import React, { useState } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import { RollbackOutlined } from '@ant-design/icons'

const { Dragger } = Upload;

export default function NewsForm() {

    const { id } = useParams()
    const history = useHistory();

    const [form] = Form.useForm();
    const [selectedImage, setSelectedImage] = useState();

    const { data } = useQuery(NEWS_BY_ID, {
        variables: { id: id },
        skip: !id,
        onCompleted: (res) => {
            form.setFieldsValue({
                title: res.newsById.title,
                description: res.newsById.description
            })
        }
    })

    const [createNews, { loading: createLoading }] = useMutation(CREATE_NEWS, {
        refetchQueries: [{
            query: ALL_NEWS
        }],
        onCompleted: () => {
            message.success("Амжилттай хадгаллаа!")
            history.push(APP_PREFIX_PATH + '/news')
        }
    })
    const [editNews, { loading: editLoading }] = useMutation(UPDATE_NEWS, {
        refetchQueries: [{
            query: ALL_NEWS
        }],
        onCompleted: () => {
            message.success("Амжилттай хадгаллаа!")
            history.push(APP_PREFIX_PATH + '/news')
        }
    })

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

    function onFinish(values) {
        if (values.image) {
            const lastIndexOfFiles = values.image.pop()
            values.image = lastIndexOfFiles.originFileObj
        } else {
            values.image = ""
        }
        if (id) {
            values.id = id
            editNews({ variables: values })
        } else {
            createNews({ variables: values })
        }
    }

    return (
        <>
            <Link to="/app/news">
                <Button type="default" icon={<RollbackOutlined />}> <IntlMessage id="back" /></Button>
            </Link>
            <Card className='mt-4'>
                <Spin spinning={createLoading || editLoading} tip="Ачааллаж байна...">
                    <Form
                        id="SupportForm"
                        layout={'vertical'}
                        form={form}
                        name="lesson"
                        onFinish={onFinish}
                    >
                        <Form.Item name="title" label={<IntlMessage id="title" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label={<IntlMessage id="description" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input.TextArea rows={4} />
                        </Form.Item>
                        <Form.Item
                            name="image"
                            label={<IntlMessage id="main.image" />}
                            valuePropName='fileList'
                            getValueFromEvent={normFile}
                        >
                            <Dragger
                                {...imageProps}
                                onChange={e => onImageChange(e)}
                            >
                                {selectedImage ?
                                    <img src={URL.createObjectURL(selectedImage)} alt="news" className="img-fluid max-h-40" />
                                    :
                                    <div>
                                        {data ?
                                            <img src={BASE_SERVER_URL + data.newsById.image} alt="news" className="img-fluid max-h-40" />
                                            :
                                            <div>
                                                <CustomIcon className="display-3" svg={ImageSvg} />
                                                <p>Файлыг байршуулахын тулд товшиж эсвэл чирнэ үү</p>
                                            </div>
                                        }
                                    </div>
                                }
                            </Dragger>
                        </Form.Item>
                        <Form.Item className='text-right'>
                            <Button type="primary" htmlType="submit">
                                Хадгалах
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Card>
        </>
    )
}
