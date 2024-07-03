import React, { useState, useEffect } from "react";
import { List, Card, Button, Upload, message, Tabs, Modal, Image } from 'antd';
import Flex from 'components/shared-components/Flex'
import { DeleteTwoTone, UploadOutlined, FileOutlined, FileImageOutlined, VideoCameraOutlined, FolderAddOutlined } from '@ant-design/icons';
import { useMutation, useQuery, NetworkStatus } from '@apollo/client';
import ReactPlayer from "react-player";
import { SizeMe } from "react-sizeme";
import { Document, Page, pdfjs } from "react-pdf";
import { CREATE_ONLINE_FILE, ALL_ONLINE_FILE, DELETE_ONLINE_FILE, ALL_FOLDERS } from 'graphql/lesson';
import { BASE_SERVER_URL } from "configs/AppConfig";
import IntlMessage from "components/util-components/IntlMessage";
import Loading from "components/shared-components/Loading";
import { CheckPer } from "hooks/checkPermission";
import Folder from "components/layout-components/Folder";
import FolderForm from "./folderForm";
import { classNames } from "utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { TabPane } = Tabs;
const { confirm } = Modal;
const { Meta } = Card;

const Index = () => {

    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [currentFolder, setCurrentFolder] = useState(0)
    const [folderHistory, setFolderHistory] = useState([{
        id: 0,
        name: "Үндсэн хавтас"
    }]);

    const filterImage = (values) => {
        let filterredData = values.filter(file => file.file.split('.').pop() === 'png'
            || file.file.split('.').pop() === 'jpeg'
            || file.file.split('.').pop() === 'jpg'
            || file.file.split('.').pop() === 'webp'
            || file.file.split('.').pop() === 'svg').map((image) => (image));
        setImages(filterredData);
    };

    const filterVideo = (values) => {
        let filterredData = values.filter(file => file.file.split('.').pop() === 'mp4'
            || file.file.split('.').pop() === 'mp3'
            || file.file.split('.').pop() === 'flac'
            || file.file.split('.').pop() === 'm4a').map((video) => (video));
        setVideos(filterredData);
    };
    const { data, loading, refetch, networkStatus } = useQuery(ALL_ONLINE_FILE, {
        variables: { folder: currentFolder }
    });

    const { data: folders, loading: folderLoading, refetch: folderRefetch } = useQuery(ALL_FOLDERS, {
        variables: { folder: currentFolder }
    })

    const [upload, { loading: uploadLoading }] = useMutation(CREATE_ONLINE_FILE, {
        onCompleted: data => {
            refetch();
            message.success(`Амжилттай хууллаа`);
        }
    });

    const [deleteFile] = useMutation(DELETE_ONLINE_FILE, {
        onCompleted: data => {
            refetch();
            message.success(`Амжилттай устлаа`);
        }
    });

    useEffect(() => {
        if (networkStatus === NetworkStatus.ready) {
            filterImage(data.allOnlineFiles);
            filterVideo(data.allOnlineFiles);
        }
    }, [data?.allOnlineFiles, networkStatus])

    const showModal = (value) => {
        setIsModalVisible(true);
        setSelectedFile(filePreview(value))
    };

    const showForm = ({ type }) => {
        setIsFolderModalVisible(true)
    }

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsFolderModalVisible(false)
    };

    const goToPrevPage = () => {
        setPageNumber(pageNumber - 1)
    }
    const goToNextPage = () => {
        setPageNumber(pageNumber + 1)
    }

    const checkPreviewFileType = (file) => {
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
                return `${window.location.origin}/img/file/file-icon.png`;
        }
    }

    const checkFileType = (file) => {
        const type = file.split('.').pop()
        switch (type) {
            case 'jpg':
            case 'jpeg':
            case 'webp':
            case 'svg':
            case 'png':
                return `${BASE_SERVER_URL}${file}`;
            case 'mp3':
            case 'm4a':
            case 'flac':
                return `${window.location.origin}/img/file/audio-file-attachment-icon.png`;
            case 'mp4':
                return `${window.location.origin}/img/file/video-file-attachment-icon.png`;
            default:
                return `${window.location.origin}/img/file/file-icon.png`;
        }
    }

    const onBreadcrumbsChange = ({ key, id }) => {
        if (key === 0) {
            setFolderHistory([{
                id: 0,
                name: "Үндсэн хавтас"
            }])
        }
        else {
            setFolderHistory(folderHistory.slice(0, key + 1))
        }
        setCurrentFolder(id)
    }

    const filePreview = (file) => {

        switch (checkPreviewFileType(file)) {
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
                    <Image style={{ maxHeight: '500px' }} preview={false} className="img-fluid" alt="Preview" src={BASE_SERVER_URL + file} />
                )
            case `pdf`:
                return (
                    <div>
                        <SizeMe
                            monitorHeight
                            refreshRate={128}
                            refreshMode={"debounce"}
                            render={({ size }) => (
                                <Document
                                    file={BASE_SERVER_URL + file}
                                    onLoadSuccess={({ numPagess }) => setNumPages(numPagess)}
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
                        <div>
                            <Button key="back" type='text' disabled={pageNumber === 1 && true} onClick={goToPrevPage}>
                                <IntlMessage id="main.previous" />
                            </Button>
                            <Button key="next" type="primary" disabled={pageNumber === numPages && true} onClick={goToNextPage}>
                                <IntlMessage id="main.next" />
                            </Button>
                        </div>
                    </div>
                )
            default:
                break;
        }

    }

    const fileUploading = value => {
        upload({ variables: { file: value.file, folder: currentFolder } });
        value.onSuccess("Ok");
    };

    const deleteModal = value => {
        confirm({
            title: 'Устгах уу?',
            okText: 'Устгах',
            okType: 'danger',
            cancelText: 'Болих',
            onOk() {
                deleteFile({ variables: { id: value } });
            },
        });
    }

    return (
        <>
            <Modal
                forceRender
                width={'80vw'}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={<Button type="primary" onClick={handleCancel} >Ok</Button>}
            >
                <div
                    className="mt-4 text-center"
                >
                    {selectedFile}
                </div>
            </Modal>
            <Modal
                forceRender
                width={'80vw'}
                visible={isFolderModalVisible}
                onCancel={handleCancel}
                okButtonProps={{ form: 'FolderForm', key: 'submit', htmlType: 'submit' }}
            >
                <div
                    className="mt-4 text-center"
                >
                    <FolderForm
                        currentFolder={currentFolder}
                        refetch={folderRefetch}
                        handleCancel={handleCancel}
                    />
                </div>
            </Modal>
            <Flex justifyContent="end" alignItems="center" className="py-2">
                <nav aria-label="breadcrumb" className="w-full px-4">
                    <ol className="flex h-8 space-x-2">
                        {folderHistory.map((item, index) => (
                            <li key={index} className="flex items-center space-x-1">
                                {index !== 0 && <span className=" text-emind">/</span>}
                                <a
                                    href="javascript:void(0)"
                                    onClick={() => currentFolder !== item.id && onBreadcrumbsChange({ key: index, id: item.id })}
                                    rel="noopener noreferrer"
                                    className={classNames(
                                        currentFolder === item.id && 'font-bold',
                                        "flex items-center px-1 capitalize hover:underline text-emind"
                                    )}
                                >
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>
                <div className="flex space-x-4">
                    {CheckPer("add_online_file") &&
                        <Upload
                            multiple={true}
                            accept=".jpg, .png, .pdf, .mp3, .mp4, .m4a"
                            orientation="right"
                            customRequest={fileUploading}
                            showUploadList={false}
                        >
                            <Button
                                style={{ float: 'right' }}
                                size='small'
                                type="primary"
                                icon={<UploadOutlined />}
                                loading={uploadLoading}
                            > <IntlMessage id="main.upload-file" /> </Button>
                        </Upload>
                    }
                    {CheckPer('add_online_file_folder') &&
                        <Button
                            onClick={() => showForm({ type: 'create' })}
                            style={{ float: 'right' }}
                            size='small'
                            type="primary"
                            icon={<FolderAddOutlined />}
                        > <IntlMessage id="folder-file" /> </Button>
                    }
                </div>
            </Flex>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {
                    folderLoading ?
                        <Loading cover="content" />
                        :
                        folders?.allFolders.map((folder, index) => (
                            <Folder
                                key={index}
                                data={folder}
                                refetch={folderRefetch}
                                // onEdit={onEdit}
                                setFolder={setCurrentFolder}
                                setFolderHistory={setFolderHistory}
                            />
                        ))
                }
            </div>
            <Card className="mt-4" loading={loading}>

                <div className={`my-4 container-fluid`}>
                    <Tabs tabPosition='top' defaultActiveKey="1" size='small'>
                        <TabPane
                            key="1"
                            tab={
                                <span>
                                    <FileOutlined /> <IntlMessage id="main.all-file" />
                                </span>
                            }
                        >
                            <List
                                pagination={{
                                    pageSize: 12,
                                }}
                                grid={{
                                    gutter: 16,
                                    xs: 1,
                                    sm: 2,
                                    md: 4,
                                    lg: 4,
                                    xl: 6,
                                    xxl: 6,
                                }}
                                dataSource={data?.allOnlineFiles}
                                renderItem={item => (
                                    <List.Item>
                                        <Card
                                            hoverable
                                            bordered={false}
                                            type="inner"
                                            cover={
                                                <Image
                                                    alt="preview"
                                                    preview={false}
                                                    onClick={() => showModal(item.file)}
                                                    src={checkFileType(item.file)}
                                                />
                                            }
                                            actions={[
                                                <DeleteTwoTone twoToneColor="#eb2f96" key="delete" onClick={event => deleteModal(item.id)} />
                                            ]}
                                        >
                                            <Meta description={item.file} />
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        </TabPane>
                        <TabPane
                            tab={
                                <span>
                                    <FileImageOutlined /> <IntlMessage id="main.image" />
                                </span>
                            }
                            key="2"
                        >
                            <List
                                pagination={{
                                    pageSize: 12,
                                }}
                                grid={{
                                    gutter: 16,
                                    xs: 1,
                                    sm: 2,
                                    md: 4,
                                    lg: 4,
                                    xl: 6,
                                    xxl: 6,
                                }}
                                dataSource={images}
                                renderItem={item => (
                                    <List.Item>
                                        <Card
                                            hoverable
                                            bordered={false}
                                            type="inner"
                                            cover={
                                                <Image
                                                    alt="preview"
                                                    preview={false}
                                                    onClick={() => showModal(item.file)}
                                                    src={checkFileType(item.file)}
                                                />

                                            }
                                            actions={[
                                                <DeleteTwoTone twoToneColor="#eb2f96" key="delete" onClick={event => deleteModal(item.id)} />
                                            ]}
                                        >
                                            <Meta description={item.file} />
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        </TabPane>
                        <TabPane
                            tab={
                                <span>
                                    <VideoCameraOutlined /> <IntlMessage id="main.media" />
                                </span>
                            }
                            key="3"
                        >
                            <List
                                pagination={{
                                    pageSize: 12,
                                }}
                                grid={{
                                    gutter: 16,
                                    xs: 1,
                                    sm: 2,
                                    md: 4,
                                    lg: 4,
                                    xl: 6,
                                    xxl: 6,
                                }}
                                dataSource={videos}
                                renderItem={item => (
                                    <List.Item>
                                        <Card
                                            hoverable
                                            bordered={false}
                                            type="inner"
                                            cover={
                                                <Image
                                                    alt="preview"
                                                    preview={false}
                                                    onClick={() => showModal(item.file)}
                                                    src={checkFileType(item.file)}
                                                />

                                            }
                                            actions={[
                                                <DeleteTwoTone twoToneColor="#eb2f96" key="delete" onClick={event => deleteModal(item.id)} />
                                            ]}
                                        >
                                            <Meta description={item.file} />
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        </TabPane>
                    </Tabs>
                </div>
            </Card>
        </>
    )
}

export default Index;