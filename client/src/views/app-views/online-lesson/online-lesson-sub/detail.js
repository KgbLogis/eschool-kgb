import React, { useState } from 'react';
import { Card, Typography, Divider, Badge, Row, Col, Table, Button, Image, Modal } from 'antd';
import { CalendarTwoTone, RollbackOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import { Document, Page, pdfjs } from "react-pdf";
import { SizeMe } from 'react-sizeme';
import ReactPlayer from 'react-player/lazy'
import moment from 'moment';
import Loading from 'components/shared-components/Loading';
import { SUB_BY_ID } from 'graphql/lesson';
import { APP_PREFIX_PATH, BASE_SERVER_URL } from "configs/AppConfig";
import IntlMessage from 'components/util-components/IntlMessage';

const { Title, Paragraph } = Typography;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const attendance_colums = [
    {
        title: <IntlMessage id="studentCode" />,
        dataIndex: ['student', 'studentCode'],
        key: 'studentCode',
    },
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

const checkFileType = (file) => {
    const type = file.split('.').pop()
    switch (type) {
        case 'jpg':
        case 'jpeg':
        case 'webp':
        case 'svg':
        case 'png':
            return `image`;
        case 'mp3':
        case 'm4a':
        case 'flac':
            return `audio`;
        case 'mp4':
            return `video`;
        case `pdf`:
            return `pdf`;
        default:
            return BASE_SERVER_URL + file;
    }
}

const Detail = (props) => {

    const slug = useParams();

    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState();

    const { data, loading } = useQuery(SUB_BY_ID, {
        variables: { id: slug.subLesson }
    });

    const showModal = (value) => {
        setIsModalVisible(true);
        setSelectedFile(FilePreview(value))
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const goToPrevPage = () => {
        setPageNumber(pageNumber - 1)
    }
    const goToNextPage = () => {
        setPageNumber(pageNumber + 1)
    }

    const FilePreview = ({ file }) => {

        switch (checkFileType(file)) {
            case `audio`:
                return (
                    <ReactPlayer
                        className="react-player"
                        width="100%"
                        height="50px"
                        controls={true}
                        url={BASE_SERVER_URL + file}
                    />
                )
            case `video`:
                return (
                    <ReactPlayer
                        width="100%"
                        height="100%"
                        controls={true}
                        url={BASE_SERVER_URL + file}
                    />
                )
            case 'image':
                return (
                    <Card>
                        <Image className="img-fluid items-" width={200} alt="Preview" src={BASE_SERVER_URL + file} />
                        {/* <Image style={{ maxHeight: '250px' }} preview={false} className="img-fluid" alt="Preview" src={BASE_SERVER_URL+file} /> */}

                    </Card>
                )

            case `pdf`:
                return (
                    <div>
                        <Modal
                            forceRender
                            width={'50vw'}
                            visible={isModalVisible}
                            onCancel={handleCancel}
                            footer={[
                                <Button key="back" type='text' disabled={pageNumber === 1 && true} onClick={goToPrevPage}>
                                    <IntlMessage id="main.previous" />
                                </Button>,
                                <Button key="next" type="primary" disabled={pageNumber === numPages && true} onClick={goToNextPage}>
                                    <IntlMessage id="main.next" />
                                </Button>,
                            ]}
                        >
                            <SizeMe
                                monitorHeight
                                refreshRate={128}
                                refreshMode={"debounce"}
                                render={({ size }) => (
                                    <Document
                                        file={BASE_SERVER_URL + file}
                                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                                        renderTextLayer={false}
                                        loading={<Loading cover="content" />}
                                        renderMode="svg"
                                    >
                                        <Page
                                            className="test"
                                            width={size.width}
                                            pageNumber={pageNumber}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                        />
                                    </Document>
                                )}
                            />
                            <p>Нийт {numPages} хуудсаас {pageNumber}-г харуулж байна </p>
                        </Modal>
                        <Button type='primary' onClick={showModal} ><IntlMessage id="show-file" /></Button>
                    </div>
                )
            default:
                return (
                    <div>
                        <Button type='primary' onClick={() => window.open(BASE_SERVER_URL + file, '_blank')} ><IntlMessage id="show-file" /></Button>
                    </div>
                )
        }

    }

    if (loading) {
        return <Loading cover="content" />
    }

    return (
        <>
            <div className='w-full'>
                <div className='flex justify-between'>
                    <Link to={`${APP_PREFIX_PATH}/online-lesson/lessons`}>
                        <Button
                            // onClick={() => history.goBack()}
                            size='small'
                            type="primary"
                            icon={<RollbackOutlined />}
                        >
                            {" "}<IntlMessage id="back" />
                        </Button>
                    </Link>
                </div>
                <div className={`grid gap-4 ${props.viewAttendance ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} mt-4`}>
                    <div className={`${props.viewAttendance ? 'lg:col-span-2' : 'lg:col-span-1'} bg-white p-6 shadow-md rounded-lg`}>
                        <h1 className="text-xl font-bold">{data.onlineSubById.title}</h1>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <h5 className="text-sm font-semibold">
                                    <IntlMessage id="added-date" />
                                </h5>
                                <div className="flex items-center">
                                    <CalendarTwoTone className="mr-2" />
                                    {moment(data.onlineSubById.createdAt).format('MMMM DD')}
                                </div>
                            </div>
                            <div>
                                <h5 className="text-sm font-semibold">
                                    <IntlMessage id="onlineType" />
                                </h5>
                                <div className="flex items-center">
                                    <span className="w-4 h-4 bg-cyan-400 rounded-full mr-2"></span>
                                    <span>{data.onlineSubById.onlineType.name}</span>
                                </div>
                            </div>
                        </div>
                        <p className="mt-4 text-gray-700">{data.onlineSubById.description}</p>
                        <p>{data.onlineSubById.content}</p>
                        <div>
                            {data.onlineSubById.onlineSubFileSet.map((item, index) => (
                                <FilePreview key={index} file={item.onlineFile.file} />
                            ))}
                        </div>
                        <div className="flex flex-row-reverse justify-end -space-x-3 space-x-reverse">
                            {
                                data.onlineSubById.onlineAttendanceSet.map((item, index) => (
                                    <div className="relative flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gray-100 text-sm font-bold uppercase text-gray-800 ring ring-white">
                                        <img
                                            className="h-full w-full rounded-full object-cover object-center"
                                            src={BASE_SERVER_URL + item.student.photo}
                                            alt=""
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default Detail;