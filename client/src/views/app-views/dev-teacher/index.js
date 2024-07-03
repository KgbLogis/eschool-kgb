import React, { useState } from 'react';
import { Menu, Modal, Button, Typography, Upload, message, Card, Image  } from 'antd';
import InnerAppLayout from 'layouts/inner-app-layout';
import { CheckPer } from 'hooks/checkPermission';
import { PlusCircleOutlined, UploadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import SupportForm from './form';
import Flex from 'components/shared-components/Flex';
import { useMutation, useQuery } from '@apollo/client';
import { ALL_SUPPORTS, CREATE_SUPPORT_FILE, DELETE_SUPPORT } from 'graphql/support';
import Loading from 'components/shared-components/Loading';
import IntlMessage from 'components/util-components/IntlMessage';
import ReactPlayer from 'react-player';
import { BASE_SERVER_URL } from 'configs/AppConfig';
import { SizeMe } from 'react-sizeme';
import { Document, Page } from 'react-pdf';

const { Title, Paragraph } = Typography;
const { confirm } = Modal;

const SettingsMenu = ({ supports, setSelectedSupport }) => {

	function onClick(params) {
		setSelectedSupport(params);
	}
	
	return (
		<div className="w-100">
			<Menu
				defaultSelectedKeys={`support-${0}`}
				mode="inline"
			>
				{ supports.map((elm, index) => {
					return (
						<Menu.Item onClick={() => onClick(elm)} key={`support-${index}`}>
							<span>{elm.title}</span>
						</Menu.Item>
					)
				
				})}
			</Menu>
		</div>
	)
}

const DevTeacher = props => {
	
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [supports, setSupports] = useState([]);
	const [selectedSupport, setSelectedSupport] = useState()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);

	const [formType, setFormType] = useState();

	const permissions = {
		createSupport: CheckPer('add_support'),
		editSupport: CheckPer('change_support'),
		deleteSupport: CheckPer('delete_support'),
		createFile: CheckPer('add_supportfile')
	}

	const { loading, refetch } = useQuery(ALL_SUPPORTS, {
		onCompleted: data => {
			setSupports(data.allSupports);
			if (data.allSupports[0]) {
				setSelectedSupport(data.allSupports[0])
			} else {
				setSelectedSupport()
			}
		}
	})

	const [deleteSupport] = useMutation(DELETE_SUPPORT, {
		onCompleted: data => {
            message.success('Амжилттай устлаа');
			refetch()
		}
	})

	const [upload, { loading: uploadLoading }] = useMutation(CREATE_SUPPORT_FILE, {
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
			refetch()
		}
	})

	const fileUploading = value => {
        upload({ variables: { file: value.file, support: selectedSupport.id } });
        value.onSuccess("Ok");
    };

	function onDelete(id) {
		confirm({
		  title: 'Устгах уу?',
		  okText: 'Устгах',
		  okType: 'danger',
		  cancelText: 'Болих',
		  onOk() {
			deleteSupport({ variables: { id: id } }); 
		  },
		});
	}

	const showModal = (type) => {
		setIsModalOpen(true);
		setFormType(type)
	};
	
	const handleOk = () => {
		setIsModalOpen(false);
	};
	
	const handleCancel = () => {
		setIsModalOpen(false);
	};

    const goToPrevPage = () => {
        setPageNumber(pageNumber - 1)
    }
	const goToNextPage = () => {
        setPageNumber(pageNumber + 1)
    }

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
                    <Card
                        bodyStyle={{padding: 0}}
                        cover={
                            <div className="p-2">
                                <Image className="img-fluid" alt="Preview" src={BASE_SERVER_URL+file} preview={false} />
                            </div>
                        }
                    >
                    </Card>
                )
            case `pdf`:
                return (
                  // <div>
                  //       <SizeMe
                  //           monitorHeight
                  //           refreshRate={128}
                  //           refreshMode={"debounce"}
                  //           render={({ size }) => (
                  //               <Document 
                  //                   file={BASE_SERVER_URL+file}
                  //                   onLoadSuccess={({ numPagess })=>setNumPages(numPagess)}
                  //                   renderTextLayer={false}
                  //                   loading={<Loading cover="content" />}
                  //                   renderMode="svg"
                  //               >
                  //                   <Page
                  //                       className="test"
                  //                       width={size.width} 
                  //                       pageNumber={pageNumber}
                  //                       renderTextLayer={false}
                  //                       renderAnnotationLayer={false}
                  //                   />
                  //               </Document>
                  //           )}
                  //       />
                  //       <p>Нийт {numPages} хуудсаас {pageNumber}-г харуулж байна </p>
                  //       <div>
                  //           <Button key="back" type='text' disabled={pageNumber === 1 && true} onClick={goToPrevPage}>
                  //               <IntlMessage id="main.previous" />
                  //           </Button>
                  //           <Button key="next" type="primary" disabled={pageNumber === numPages && true} onClick={goToNextPage}>
                  //               <IntlMessage id="main.next" />
                  //           </Button>
                  //       </div>
                  //   </div>

                    //undsen show file
                    <div>
                        <Modal
                            forceRender
                            width={'80vw'}
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
                        {/* <Button type='primary' onClick={showModal} ><IntlMessage id="show-file" /></Button> */}
                        <Button type='primary' onClick={() => window.open(BASE_SERVER_URL+file, '_blank')} ><IntlMessage id="show-file" /></Button>
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
		return <Loading cover='content' />
	}

	return (
		<>
			{ permissions.createSupport &&
				<Flex justifyContent="end" alignItems="center" className="">
					<div className='mb-4'>
						<Button type="primary" onClick={() => showModal('create')} icon={<PlusCircleOutlined />} >
							Нэмэх
						</Button>
						<Modal
							visible={isModalOpen} 
							okButtonProps={{form:'SupportForm', key: 'submit', htmlType: 'submit'}}
							okText={<IntlMessage id="main.okText" />}
							cancelText={<IntlMessage id="main.cancelText" />}
							onCancel={handleCancel}
						>
							<SupportForm formDatas={selectedSupport} type={formType} refetch={refetch} handleCancel={handleCancel} />
						</Modal>
					</div>
				</Flex>
			}
			<InnerAppLayout 
				sideContent={<SettingsMenu supports={supports} setSelectedSupport={setSelectedSupport} />}
				mainContent={
					<div className="p-4">
						{ selectedSupport &&
							<div className="container-fluid">
								{ permissions.createFile &&
									<Upload 
										multiple={true}
										accept=".jpg, .png, .pdf, .mp3, .mp4, .m4a"
										orientation="right"
										customRequest={fileUploading}
										showUploadList={false}
									>
										<Button 
											style={{float: 'right'}} 
											size='small' 
											type="primary" 
											icon={<UploadOutlined />} 
											loading={uploadLoading} 
										> <IntlMessage id="main.upload-file" /> </Button>
									</Upload>
								}
								{ permissions.deleteSupport &&
									<Button 
										className='float-right'
										size='small' 
										type="danger" 
										onClick={() => onDelete(selectedSupport.id)}
										icon={<DeleteOutlined />}
									> <IntlMessage id="delete" /> </Button>
								}
								{ permissions.deleteSupport &&
									<Button  
										className='float-right mr-4 bg-yellow-400'
										size='small' 
										onClick={() => showModal("edit")}
										icon={<EditOutlined />}
									> <IntlMessage id="edit" /> </Button>
								}
								<Typography>
									<Title>{selectedSupport.title}</Title>
									<Paragraph> {selectedSupport.description} </Paragraph>
								</Typography>
								{ selectedSupport.supportfileSet?.map((item, index) => (
									<FilePreview key={index} file={item.file} />
								))}
							</div>
						}
					</div>
				}
				sideContentWidth={300}
				sideContentGutter={false}
				border
			/>
		</>
	)
}

export default DevTeacher

// import React, { useState, useEffect } from "react";
// import { List, Card, Button, Upload, message, Tabs, Modal, Image } from 'antd';
// import Flex from 'components/shared-components/Flex'
// import { DeleteTwoTone, UploadOutlined, FileOutlined, FileImageOutlined, VideoCameraOutlined } from '@ant-design/icons';
// import { useMutation, useQuery, NetworkStatus } from '@apollo/client'; 
// import ReactPlayer from "react-player";
// import { SizeMe } from "react-sizeme";
// import { Document, Page, pdfjs } from "react-pdf";
// import { CREATE_ONLINE_FILE, ALL_ONLINE_FILE, DELETE_ONLINE_FILE } from 'graphql/lesson';
// import { BASE_SERVER_URL } from "configs/AppConfig";
// import IntlMessage from "components/util-components/IntlMessage";
// import Loading from "components/shared-components/Loading";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// const { TabPane } = Tabs;
// const { confirm } = Modal;
// const { Meta } = Card;

// const Index = () => {

//     const [images, setImages] = useState([]);
//     const [videos, setVideos] = useState([]);
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [selectedFile, setSelectedFile] = useState();
//     const [numPages, setNumPages] = useState(null);
//     const [pageNumber, setPageNumber] = useState(1);
    
//     const filterImage = (values) => {
//         let filterredData = values.filter(file => file.file.split('.').pop() === 'png' 
//                             || file.file.split('.').pop() === 'jpeg'
//                             || file.file.split('.').pop() === 'jpg'
//                             || file.file.split('.').pop() === 'webp'
//                             || file.file.split('.').pop() === 'svg').map((image) => (image));
//         setImages(filterredData);
//     };

//     const filterVideo = (values) => {
//         let filterredData = values.filter(file => file.file.split('.').pop() === 'mp4' 
//                             || file.file.split('.').pop() === 'mp3'
//                             || file.file.split('.').pop() === 'flac'
//                             || file.file.split('.').pop() === 'm4a').map((video) => (video));
//         setVideos(filterredData);
//     };
//     const { data, loading, refetch, networkStatus } = useQuery(ALL_ONLINE_FILE, {
//     });

//     const [upload, { loading: uploadLoaing }] = useMutation(CREATE_ONLINE_FILE, {
//         onCompleted: data => {
//             refetch();
//             message.success(`Амжилттай хууллаа`);
// 		}
//     });

//     const [deleteFile] = useMutation(DELETE_ONLINE_FILE, {
//         onCompleted: data => {
//             refetch();
//             message.success(`Амжилттай устлаа`);
//         }
//     });
    
//     useEffect(() => {
//         if (networkStatus === NetworkStatus.ready) {
//             filterImage(data.allOnlineFiles);
//             filterVideo(data.allOnlineFiles);
//         }
//     }, [data?.allOnlineFiles, networkStatus])

//     const showModal = (value) => {
//         setIsModalVisible(true);
//         setSelectedFile(filePreview(value))
//     };

//     const handleCancel = () => {
//         setIsModalVisible(false);
//     };

//     const goToPrevPage = () => {
//         setPageNumber(pageNumber - 1)
//     }
// 	const goToNextPage = () => {
//         setPageNumber(pageNumber + 1)
//     }

//     const checkPreviewFileType = (file) => {
//         const type = file.split('.').pop()
//         switch(type) {
//             case 'jpg':
//             case 'jpeg':
//             case 'webp':
//             case 'svg':
//             case 'png':
//                 return `image`;
//             case 'mp3':
//             case 'm4a':
//             case 'flac':
//                 return `audio`;
//             case 'mp4':
//                 return `video`;
//             case `pdf`:
//                 return `pdf`;
//             default:
//                 return `${window.location.origin}/img/file/file-icon.png`;
//         }
//     }

//     const checkFileType = (file) => {
//         const type = file.split('.').pop()
//         switch(type) {
//             case 'jpg':
//             case 'jpeg':
//             case 'webp':
//             case 'svg':
//             case 'png':
//                 return `${BASE_SERVER_URL}${file}`;
//             case 'mp3':
//             case 'm4a':
//             case 'flac':
//                 return `${window.location.origin}/img/file/audio-file-attachment-icon.png`;
//             case 'mp4':
//                 return `${window.location.origin}/img/file/video-file-attachment-icon.png`;
//             default:
//                 return `${window.location.origin}/img/file/file-icon.png`;
//         }
//     }

//     const filePreview = (file) => {
        
//         switch (checkPreviewFileType(file)) {
//             case `audio`:
//                 return (
//                     <ReactPlayer 
//                         className="react-player"
//                         width="100%"
//                         height="50px"
//                         controls={true}
//                         url={BASE_SERVER_URL+file} 
//                     />
//                 )
//             case `video`:
//                 return (
//                     <ReactPlayer
//                         width="100%"
//                         height="70%"
//                         controls={true}
//                         url={BASE_SERVER_URL+file} 
//                     />
//                 )
//             case 'image':
//                 return (
//                     <Image style={{ maxHeight: '500px' }} preview={false} className="img-fluid" alt="Preview" src={BASE_SERVER_URL+file} />
//                 )
//             case `pdf`:
//                 return (
//                     <div>
//                         <SizeMe
//                             monitorHeight
//                             refreshRate={128}
//                             refreshMode={"debounce"}
//                             render={({ size }) => (
//                                 <Document 
//                                     file={BASE_SERVER_URL+file}
//                                     onLoadSuccess={({ numPagess })=>setNumPages(numPagess)}
//                                     renderTextLayer={false}
//                                     loading={<Loading cover="content" />}
//                                     renderMode="svg"
//                                 >
//                                     <Page
//                                         className="test"
//                                         width={size.width} 
//                                         pageNumber={pageNumber}
//                                         renderTextLayer={false}
//                                         renderAnnotationLayer={false}
//                                     />
//                                 </Document>
//                             )}
//                         />
//                         <p>Нийт {numPages} хуудсаас {pageNumber}-г харуулж байна </p>
//                         <div>
//                             <Button key="back" type='text' disabled={pageNumber === 1 && true} onClick={goToPrevPage}>
//                                 <IntlMessage id="main.previous" />
//                             </Button>
//                             <Button key="next" type="primary" disabled={pageNumber === numPages && true} onClick={goToNextPage}>
//                                 <IntlMessage id="main.next" />
//                             </Button>
//                         </div>
//                     </div>
//                 )
//             default:
//                 break;
//         }

//     }
    
//     const fileUploading = value => {
//         upload({ variables: { file: value.file } });
//         value.onSuccess("Ok");
//     }

//     const deleteModal = value => {
//         confirm({
//             title: 'Устгах уу?',
//             okText: 'Устгах',
//             okType: 'danger',
//             cancelText: 'Болих',
//             onOk() {
//                 deleteFile({ variables: { id: value } }); 
//             },
//           });
//     }

//     return (
//         <>
//             <Modal
//                 forceRender
//                 width={'50vw'}
//                 visible={isModalVisible}
//                 onCancel={handleCancel}
//                 footer={<Button type="primary" onClick={handleCancel} >Ok</Button>}
//             >
//                 <div 
//                     className="mt-4 text-center"
//                 >
//                     {selectedFile}
//                 </div>
//             </Modal>
//             <Flex justifyContent="end" alignItems="center" className="py-2">
//                 <div>
//                     <Upload 
//                         accept=".jpg, .png, .pdf, .mp3, .mp4, .m4a"
//                         orientation="right"
//                         customRequest={fileUploading}
//                     >
//                         <Button 
//                             style={{float: 'right'}} 
//                             size='small' 
//                             type="primary" 
//                             icon={<UploadOutlined />} 
//                             loading={uploadLoaing} 
//                         > <IntlMessage id="main.upload-file" /> </Button>
//                     </Upload>
//                 </div>
//             </Flex>
//             <Card className="mt-4" loading={loading}>
//                 <div className={`my-4 container-fluid`}>
//                     <Tabs tabPosition='left' defaultActiveKey="1" size='small'>
//                         <TabPane 
//                             key="1"
//                             tab= {
//                                 <span>
//                                     <FileOutlined /> <IntlMessage id="main.all-file" />
//                                 </span>
//                             }
//                         >
//                             <List
//                                 pagination={{
//                                     pageSize: 12,
//                                 }}
//                                 grid={{
//                                     gutter: 16,
//                                     xs: 1,
//                                     sm: 2,
//                                     md: 4,
//                                     lg: 4,
//                                     xl: 6,
//                                     xxl: 6,
//                                 }}
//                                 dataSource={data?.allOnlineFiles}
//                                 renderItem={item => (
//                                     <List.Item>
//                                         <Card
//                                             hoverable
//                                             bordered={false}
//                                             type="inner"
//                                             cover={
//                                                 <Image 
//                                                     alt="preview"
//                                                     preview={false}
//                                                     onClick={() => showModal(item.file)}
//                                                     src={checkFileType(item.file)}
//                                                 />
//                                             }
//                                             actions={[
//                                                 <DeleteTwoTone twoToneColor="#eb2f96" key="delete" onClick={event => deleteModal(item.id)} />
//                                             ]}
//                                         >
//                                             <Meta description={item.file}/>
//                                         </Card>
//                                     </List.Item>
//                                 )}
//                             />
//                         </TabPane>
//                         <TabPane 
//                             tab={
//                                 <span>
//                                     <FileImageOutlined /> <IntlMessage id="main.image" />
//                                 </span>
//                             }
//                             key="2"
//                         >
//                             <List
//                                 pagination={{
//                                     pageSize: 12,
//                                 }}
//                                 grid={{
//                                     gutter: 16,
//                                     xs: 1,
//                                     sm: 2,
//                                     md: 4,
//                                     lg: 4,
//                                     xl: 6,
//                                     xxl: 6,
//                                 }}
//                                 dataSource={images}
//                                 renderItem={item => (
//                                     <List.Item>
//                                         <Card
//                                             hoverable
//                                             bordered={false}
//                                             type="inner"
//                                             cover={
//                                                 <Image
//                                                     alt="preview"
//                                                     preview={false}
//                                                     onClick={() => showModal(item.file)}
//                                                     src={checkFileType(item.file)}
//                                                 />
                                                
//                                             }
//                                             actions={[
//                                                 <DeleteTwoTone twoToneColor="#eb2f96" key="delete" onClick={event => deleteModal(item.id)} />
//                                             ]}
//                                         >
//                                             <Meta description={item.file}/>
//                                         </Card>
//                                     </List.Item>
//                                 )}
//                             />
//                         </TabPane>
//                         <TabPane 
//                             tab={
//                                 <span>
//                                     <VideoCameraOutlined /> <IntlMessage id="main.media" />
//                                 </span>
//                             }
//                             key="3"
//                         >
//                             <List
//                                 pagination={{
//                                     pageSize: 12,
//                                 }}
//                                 grid={{
//                                     gutter: 16,
//                                     xs: 1,
//                                     sm: 2,
//                                     md: 4,
//                                     lg: 4,
//                                     xl: 6,
//                                     xxl: 6,
//                                 }}
//                                 dataSource={videos}
//                                 renderItem={item => (
//                                     <List.Item>
//                                         <Card
//                                             hoverable
//                                             bordered={false}
//                                             type="inner"
//                                             cover={
//                                                 <Image
//                                                     alt="preview"
//                                                     preview={false}
//                                                     onClick={() => showModal(item.file)}
//                                                     src={checkFileType(item.file)}
//                                                 />
                                                
//                                             }
//                                             actions={[
//                                                 <DeleteTwoTone twoToneColor="#eb2f96" key="delete" onClick={event => deleteModal(item.id)} />
//                                             ]}
//                                         >
//                                             <Meta description={item.file}/>
//                                         </Card>
//                                     </List.Item>
//                                 )}
//                             />
//                         </TabPane>
//                     </Tabs>
//                 </div>
//             </Card>
//         </>
//     )
// }

// export default Index;
