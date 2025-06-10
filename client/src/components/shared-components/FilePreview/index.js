import React, { useState } from 'react'
import { Document, Page, pdfjs } from "react-pdf";
import { SizeMe } from 'react-sizeme';
import ReactPlayer from 'react-player/lazy'
import { BASE_SERVER_URL } from 'configs/AppConfig';
import { Button, Image, Modal } from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import Loading from '../Loading';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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
        case 'doc':
        case 'docx':
        case 'xls':
        case 'xlsx':
        case 'ppt':
        case 'pptx':
            return `document`;
        default:
            return BASE_SERVER_URL + file;
    }
}

export default function FilePreview({ file }) {

    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = (value) => {
        setIsModalVisible(true);
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
                <Image className="img-fluid items-" width={200} alt="Preview" src={BASE_SERVER_URL + file} />
            )

        case `pdf`:
            return (
                <div>
                    <Modal
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
                                    onLoadSuccess={({ numPages: loadedNumPages }) => {
                                        if (loadedNumPages !== numPages) {
                                            setNumPages(loadedNumPages);
                                        }
                                    }}
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
