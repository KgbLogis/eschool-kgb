import React from 'react'
import { Avatar, Button, Form, Input, Upload } from 'antd'
import { ArrowLeftIcon, DocumentDownloadIcon, DownloadIcon, PaperClipIcon } from '@heroicons/react/outline'
import IntlMessage from 'components/util-components/IntlMessage';
import { useMutation, useQuery } from '@apollo/client';
import { ALL_CONVERSATION_FILES, ALL_CONVERSATION_REPLY, CONVERSATION_BY_ID, CREATE_CONVERSATION_REPLY } from 'graphql/conversation';
import Loading from '../Loading';
import moment from 'moment';
import { BASE_SERVER_URL } from 'configs/AppConfig';
import userImage from "assets/image/user.png"

const ConversationBody = ({ selected, setSelected }) => {

    const [form] = Form.useForm();

    const { data: conversationData, loading } = useQuery(CONVERSATION_BY_ID, {
        variables: { id: selected }
    })

    const { data: conversationReplyData, loading: conversationReplyLoading, refetch } = useQuery(ALL_CONVERSATION_REPLY, {
        variables: { conversation: selected }
    })

    const { data: conversationFileData, loading: conversationFileLoading, } = useQuery(ALL_CONVERSATION_FILES, {
        variables: { conversation: selected }
    })

    const [createReply, { loading: createReplyLoading }] = useMutation(CREATE_CONVERSATION_REPLY, {
        onCompleted: data => {
            refetch()
            form.resetFields()
        }
    })

    function onReplySubmit(values) {
        if (!values.files) {
            values.files = []
        }
        values.conversation = selected
        createReply({ variables: values });
    }

    const uploadprops = {
        name: 'file',
        multiple: true,
        beforeUpload: file => {
            return false
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    async function startDownload({ url, name }) {
        const data = await fetch(url)
        const blob = await data.blob()
        const objectUrl = URL.createObjectURL(blob)

        const link = document.createElement('a')

        link.setAttribute('href', objectUrl)
        link.setAttribute('download', name)
        link.style.display = 'none'

        document.body.appendChild(link)

        link.click()

        document.body.removeChild(link)
    }

    function getFileSize(url) {
        var fileSize = '';
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);

        http.send(null);

        if (http.status === 200) {
            fileSize = http.getResponseHeader('content-length');
        }

        const k = 1024
        const dm = 2 < 0 ? 0 : 2
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

        const i = Math.floor(Math.log(fileSize) / Math.log(k))

        return `${parseFloat((fileSize / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`

    }

    if (loading) {
        return <Loading cover='content' />
    }

    return (
        <div className='p-4'>
            <ArrowLeftIcon className='h-4 w-4 hover:cursor-pointer' onClick={() => setSelected()} />
            <div className='mt-4'>
                <div>
                    <div className="text-lg font-medium text-slate-600 ">
                        {conversationData.conversationById.subject}
                    </div>
                    <div className="flex space-x-3 pt-4 pb-6 items-start">
                        <div className="flex-none">
                            <div className="h-8 w-8 rounded-full text-white">
                                <img
                                    src={userImage}
                                    alt=""
                                    className="block w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <span className="text-sm text-slate-600  font-medium leading-4">
                                {conversationData.conversationById.sender.isStudent ?
                                    `${conversationData.conversationById.sender.student?.familyName} ${conversationData.conversationById.sender.student?.name}`
                                    :
                                    conversationData.conversationById.sender.isTeacher ?
                                        `${conversationData.conversationById.sender.teacher?.familyName} ${conversationData.conversationById.sender.teacher?.name}`
                                        :
                                        conversationData.conversationById.sender.isEmployee ?
                                            `${conversationData.conversationById.sender.employee?.familyName} ${conversationData.conversationById.sender.employee?.name}`
                                            :
                                            `${conversationData.conversationById.sender.lastName} ${conversationData.conversationById.sender.firstName}`
                                }
                                {conversationData.conversationById.sender.groups[0]?.name}
                            </span>
                        </div>
                    </div>
                    <div className="text-sm text-slate-600 whitespace-pre-line font-normal">
                        {conversationData.conversationById.body}
                    </div>
                    {conversationFileLoading ? <Loading cover='content' /> :
                        <div className="grid grid-cols-3 md:grid-cols-9 mt-4">
                            {conversationFileData.allConversationFiles.map((item, index) => (
                                <div 
                                    key={index} 
                                    className="group relative p-2.5 mb-[30px] mx-[5px] border rounded-[10px] hover:cursor-pointer"
                                    onClick={() => startDownload({ url: BASE_SERVER_URL + item.file, name: item.file })}
                                >
                                    <div className="relative before:absolute before:top-0 before:w-full before:h-0 before:bg-dark-transparent before:rounded-[10px] before:transition-all group-hover:before:h-full">
                                        <img
                                            src={BASE_SERVER_URL + item.file}
                                            className="block h-[95px] w-[150px] object-contain"
                                            onError={({ currentTarget }) => {
                                                currentTarget.onerror = null;
                                                currentTarget.src = "/img/file/file-icon.png";
                                            }}
                                            alt='file'
                                        />
                                    </div>
                                    <div className="gap-x-[10px] absolute top-[40px] left-1/2 -translate-x-1/2 opacity-0 invisible transition-all group-hover:opacity-100 group-hover:visible">
                                        <div
                                            className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#3fb43fc4]"
                                        >
                                            <DownloadIcon className="w-[14px] h-[14px] text-white" />
                                        </div>
                                    </div>
                                    <div className="mt-[10px]">
                                        <p className="mb-0 text-xs text-body dark:text-white60">{getFileSize(BASE_SERVER_URL + item.file)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }

                </div>
                {conversationReplyLoading ?
                    <Loading cover='content' />
                    : conversationReplyData.allConversationReply.map((item, index) => (
                        <div
                            key={index}
                            className="flex-col w-full p-2 mt-3 bg-background"
                        >
                            <div className="flex flex-row md-10">
                                <Avatar src={userImage} size="large" />
                                <div className="flex-col mt-1">
                                    <div className="flex items-center flex-1 px-4 font-bold leading-tight">{item.user.lastName} {item.user.firstName}
                                        <span className="ml-2 text-xs font-normal text-gray-500">{moment.utc(moment(item.createdAt), "YYYYMMDD").fromNow()}</span>
                                    </div>
                                    <div className="flex-1 px-2 ml-2 text-sm font-medium leading-loose text-gray-600">{item.body}</div>
                                    {item.conversationreplyfileSet.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => startDownload({ url: BASE_SERVER_URL + item.file })}
                                            className="inline-flex items-center px-1 pt-2 ml-1 flex-column"
                                        >
                                            <DocumentDownloadIcon className='h-6 w-6' />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                    ))
                }
                <div className="mt-6 border rounded-xl bg-gray-50 mb-3">
                    <Form
                        onFinish={onReplySubmit}
                        form={form}
                    >
                        <Form.Item name="body" rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input.TextArea className="w-full bg-gray-50 p-2 rounded-xl" placeholder="Хариу бичих..." rows="3"></Input.TextArea>
                        </Form.Item>
                        <div className="flex items-center justify-between p-2">
                            <Form.Item name="files" valuePropName='fileList' getValueFromEvent={normFile}>
                                <Upload
                                    {...uploadprops}
                                >
                                    <PaperClipIcon className="h-6 w-6 text-gray-400" />
                                </Upload>
                            </Form.Item>
                            <Form.Item>
                                <Button loading={createReplyLoading} type='primary' htmlType='submit' >Хариу илгээх</Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default ConversationBody