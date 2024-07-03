import React, { useState } from 'react';
import { Card, Typography, Divider, Badge, Row, Col, Table, Button, Image, Modal } from 'antd';
import { CalendarTwoTone, RollbackOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { useParams, useHistory } from 'react-router-dom';
import { Document, Page, pdfjs } from "react-pdf";
import { SizeMe } from 'react-sizeme';
import ReactPlayer from 'react-player/lazy'
import moment from 'moment';
import Flex from 'components/shared-components/Flex';
import Loading from 'components/shared-components/Loading';
import { SUB_BY_ID } from 'graphql/lesson';
import { BASE_SERVER_URL } from "configs/AppConfig";
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
    switch(type) {
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
            return BASE_SERVER_URL+file;
    }
}

const Detail = (props) => {

    const slug = useParams();
    const history = useHistory();


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
                        url={BASE_SERVER_URL+file} 
                    />
                )
            case `video`:
                return (
                    <ReactPlayer
                        width="100%"
                        height="100%"
                        controls={true}
                        url={BASE_SERVER_URL+file} 
                    />
                )
            case 'image':
                return (
                    <Card>
                        <Image className="img-fluid items-" width={200} alt="Preview" src={BASE_SERVER_URL+file} />
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
                                        file={BASE_SERVER_URL+file}
                                        onLoadSuccess={({ numPages })=>setNumPages(numPages)}
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
                return(
                    <div>
                        <Button type='primary' onClick={() => window.open(BASE_SERVER_URL+file, '_blank')} ><IntlMessage id="show-file" /></Button>
                    </div>
                )
        }

    }

    if (loading) {
        return <Loading cover="content" />
    }

    return (
        <>
         {/* <Modal
             forceRender
             width={'50vw'}
             visible={isModalVisible}
             onCancel={handleCancel}
             footer={<Button type="primary" onClick={handleCancel} >Ok</Button>}
         >
             <div 
                 className="mt-4 text-center"
             >
                 {selectedFile}
             </div>
         </Modal> */}
            <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                <Flex mobileFlex={false}>
                    <div className='text-right' >
                        <Button onClick={() => history.goBack()} type="default" icon={<RollbackOutlined />} block> <IntlMessage id="back" /></Button>
                    </div>
                </Flex>
            </Flex>
            <Row gutter={props.viewAttendance === true ? [8, 16] : 24}>
                <Col xs={24} xl={props.viewAttendance === true ? 18 : 24}>
                    <Card className='mt-4' > 
                        <Typography>
                            <Title>{data.onlineSubById.title}</Title>
                            <Row gutter={[8, 8]}>
                                <Col span={12} >
                                    <Title level={5} ><IntlMessage id="added-date" /></Title>
                                    <CalendarTwoTone /> {moment(data.onlineSubById.createdAt).format('MMMM DD')}
                                </Col>
                                <Col span={12} >
                                    <Title level={5} ><IntlMessage id="onlineType" /></Title>
                                    <Badge color={'cyan'} />
                                    <span>{data.onlineSubById.onlineType.name}</span>
                                </Col>
                            </Row>
                            <Divider />
                            <Paragraph className='mt-4' >{data.onlineSubById.description}</Paragraph>
                            <Divider> <Title level={2}><IntlMessage id="content" /></Title>  </Divider>
                            <p>{data.onlineSubById.content}</p>
                            <Divider> <Title level={2}><IntlMessage id="file" /></Title> </Divider>
                            <Paragraph>
                                { data.onlineSubById.onlineSubFileSet.map((item, index) => (
                                    <FilePreview key={index} file={item.onlineFile.file} />
                                ))}
                            </Paragraph>
                        </Typography>
                    </Card>
                </Col>
                { props.viewAttendance === true &&
                    <Col xs={24} xl={6}>
                        <Card className='mt-4'>
                            <Title className='text-center' level={2}><IntlMessage id="class-attendance" /></Title>
                            <Table 
                                rowKey='studentCode'
                                pagination={false}
                                columns={attendance_colums} 
                                dataSource={data.onlineSubById.onlineAttendanceSet} 
                            />
                        </Card>
                    </Col>
                }
            </Row>
        </>
    )

}

export default Detail;