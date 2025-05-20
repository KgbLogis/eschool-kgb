import React, { useState, useEffect } from 'react';
import { Form, message, Input, Spin, Select, Col, Row } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { ALL_FOLDERS, ALL_ONLINE_FILE, ALL_ONLINE_TYPE, CREATE_ONLINE_SUB_FILE } from 'graphql/lesson'
import { CREATE_SUB_LESSON, ALL_SUB_LESSON_BY_LESSON, UPDATE_SUB_LESSON } from 'graphql/lesson'
import 'braft-editor/dist/index.css';
import IntlMessage from 'components/util-components/IntlMessage';
import Folder from 'components/layout-components/Folder';
import { classNames } from 'utils';
import { BASE_SERVER_URL } from 'configs/AppConfig';
import Loading from 'components/shared-components/Loading';
import { find } from 'lodash';

function LessonForm (props) {

    const [form] = Form.useForm();

    const { Option } = Select;
    const { TextArea } = Input;

    const { data: typeData } = useQuery(ALL_ONLINE_TYPE);

    const [currentFolder, setCurrentFolder] = useState(0)
    const [folders, setFolders] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([])
    const [folderHistory, setFolderHistory] = useState([{
        id: 0,
        name: "Үндсэн хуудас"
    }]);

    const { loading: folderLoading } = useQuery (ALL_FOLDERS, {
        onCompleted: data => {
            setFolders(data.allFolders);
        },
        variables: { folder: currentFolder }
    })

    const [createOnlineSubFile] = useMutation(CREATE_ONLINE_SUB_FILE)

    const [createOnlineLesson, { loading: createLoading } ] = useMutation(CREATE_SUB_LESSON, {
        refetchQueries: [{
            query: ALL_SUB_LESSON_BY_LESSON,
            variables: { onlineLesson: props.lesson }
        }],
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            form.resetFields();
            props.setIsModalVisible(false);
            selectedFiles.map((item) => {
                createOnlineSubFile({ variables: { onlineSub: data.createOnlineSub.onlineSub.id, onlineFile: item.id } })
            })
		}
    });

    const { data: allFiles, loading } = useQuery(ALL_ONLINE_FILE, {
        variables: { folder: currentFolder }
    });

    const [updateOnlineLesson, { loading: updateLoading }] = useMutation(UPDATE_SUB_LESSON, {
        refetchQueries: [{
            query: ALL_SUB_LESSON_BY_LESSON,
            variables: { onlineLesson: props.lesson }
        }],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            form.resetFields();
            props.setIsModalVisible(false);
        }
    })

    useEffect(() => {
        if(props.formType === "edit") {
            const newData ={
				content: props.editData.content,
                description: props.editData.description,
                status: props.editData.status,
                title: props.editData.title,
                onlineType: props.editData.onlineType.id,
			}
            props.editData.onlineSubFileSet.map(item => {
                return setSelectedFiles(prevData => [...prevData, item.onlineFile])
            })
            form.setFieldsValue(newData);
        } else if(props.formType === "create") {
            form.resetFields();
            setSelectedFiles([])
        }
    }, [form, props]);

    const onBreadcrumbsChange = ({ key, id }) => {
        if (key === 0) {
            setFolderHistory([{
                id: 0,
                name: "Үндсэн хуудас"
            }])
        }
        else {
            setFolderHistory(folderHistory.slice(0, key + 1))
        }
        setCurrentFolder(id)
    }
    
    const checkPreviewFileType = (file) => {
        const type = file.split('.').pop()
        switch(type) {
            case 'jpg':
            case 'jpeg':
            case 'webp':
            case 'svg':
            case 'png':
                return BASE_SERVER_URL+file;
            case 'mp3':
            case 'm4a':
            case 'flac':
                return `${window.location.origin}/img/file/audio-file-attachment-icon.png`;
            case 'mp4':
                return `${window.location.origin}/img/file/video-file-attachment-icon.png`;
            case `pdf`:
                return `${window.location.origin}/img/file/text-file-attachment-icon.png`;
            default:
                return `${window.location.origin}/img/file/file-icon.png`;
        }
    }

    function isSelected(id) {
        const foundItem = find(selectedFiles, function(o) {
            return o.id === id
        })
        if (foundItem) {
            return 200
        } else {
            return 404
        }
    }

    function onFileClick(params) {
        const foundItem = find(selectedFiles, function(o) {
            return o.id === params.id
        })
        if (foundItem) {
            setSelectedFiles(prevData => prevData.filter((data) => data.id !== foundItem.id))
        } else {
            setSelectedFiles(prevData => [...prevData, params])
        }
    }

    const onFinish = values => {
        if (props.formType === 'edit') {
            values.onlineLesson = props.lesson;
            values.id = props.editData.id;
            updateOnlineLesson({ variables: values });
        } else {
            values.onlineLesson = props.lesson;
            createOnlineLesson({ variables: values })
        }
    };

    return (
        <Spin spinning={createLoading || updateLoading} tip="Ачааллаж байна...">
            <Form  
                id="SubLessonForm"
                layout={'vertical'}
                form={form}
                name="lesson" 
                onFinish={onFinish}
            >
                <Row gutter={[24, 24]} >
                    <Col xs={24} xl={12}>
                        <Form.Item name="title" label={<IntlMessage id="title" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="onlineType" label={<IntlMessage id="onlineType" />} rules={[
                            {
                                required: true,
                                message: `Хоосон орхих боломжгүй`
                            }
                        ]}>
                            <Select>
                                { typeData?.allOnlineTypes.map((type, index) => (
                                    <Option value={type.id} key={index} >{type.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="description" label={<IntlMessage id="description" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item name="status" label={<IntlMessage id="status" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Select>
                                <Option value="OPEN" key={0} >{<IntlMessage id="status.open" />}</Option>
                                <Option value="CLOSED" key={1} >{<IntlMessage id="status.closed" />}</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} xl={12}>
                        <nav aria-label="breadcrumb" className="w-full px-4">
                            <ol className="flex h-8 space-x-2">
                                { folderHistory.map((item, index) => (
                                    <li key={index} className="flex items-center space-x-1">
                                        { index !== 0 && <span className=" text-mkp">/</span>}
                                        <a 
                                            onClick={() => currentFolder !== item.id && onBreadcrumbsChange({ key: index, id: item.id })} 
                                            rel="noopener noreferrer" 
                                            className={classNames(
                                                currentFolder === item.id && 'font-bold',
                                                "flex items-center px-1 capitalize hover:underline text-900"
                                            )}
                                        >
                                            {item.name}
                                        </a>
                                    </li>

                                ))}
                            </ol>
                        </nav>
                        <div className="grid grid-cols-3 gap-4">
                            { folderLoading ?
                                <Loading /> 
                                : folders.map((folder, index) => (
                                <Folder 
                                    key={index}
                                    data={folder} 
                                    setFolder={setCurrentFolder}
                                    setFolderHistory={setFolderHistory}
                                />
                            ))}
                        </div>
                        <div className="mt-4 grid grid-cols-4 gap-4">
                            { loading ?
                                <Loading />
                                :
                                allFiles?.allOnlineFiles.map((item, index) => (
                                    <div 
                                        key={index}
                                        onClick={() => onFileClick(item)}
                                        className={classNames(isSelected(item.id) === 200 && "rounded-2 border-2 border-green-500",
                                            "w-full p-2 hover:cursor-pointer "
                                        )}
                                    >
                                        <img 
                                            className="h-24 w-auto mx-auto text-purple-600" 
                                            src={checkPreviewFileType(item.file)}
                                        />
                                        <p className='mt-1 w-full text-xs'>{item.file}</p>
                                    </div>
                                ))
                            }
                        </div>
                        <p className='px-4 text-900 font-bold'><IntlMessage id="selected-online-file" /></p>
                        <div className="mt-4 grid grid-cols-5 gap-4">
                            { selectedFiles.map((item, index) => (
                                <div 
                                    key={index}
                                    onClick={() => onFileClick(item)}
                                    className="w-full hover:cursor-pointer"
                                >
                                    <img 
                                        className="h-24 w-auto mx-auto text-purple-600" 
                                        src={checkPreviewFileType(item.file)}
                                    />
                                    <p className='mt-1 w-full text-xs'>{item.file}</p>
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Form>
        </Spin>
    );
};

export default LessonForm