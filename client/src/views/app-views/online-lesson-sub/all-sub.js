import React, { useState } from 'react';
import { Tabs, Card, List, Button, Modal, message } from 'antd';
import { CalendarTwoTone, PlusCircleOutlined, EditTwoTone, DeleteTwoTone, RollbackOutlined } from '@ant-design/icons'
import { useQuery, useMutation } from '@apollo/client';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';
import Flex from 'components/shared-components/Flex';
import { ALL_ONLINE_TYPE, ALL_SUB_LESSON_BY_LESSON, DELETE_SUB_LESSON } from 'graphql/lesson';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import Form from './form';
import IntlMessage from 'components/util-components/IntlMessage';

const { TabPane } = Tabs;
const { Meta } = Card;
const { confirm } = Modal;

const AllSub = (props) => {

    const history = useHistory();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editData, setEditData] = useState([]);
	const [formType, setFormType] = useState("");

    const { loading, data, refetch } = useQuery(ALL_SUB_LESSON_BY_LESSON, {    
        variables: { onlineLesson: props.lesson }
    });

    const { data: typeData, loading: typeLoading } = useQuery(ALL_ONLINE_TYPE, {
    });

    const subLessonDetail = values => {
        history.push(`${APP_PREFIX_PATH}/online-lesson/${values.lesson}/${values.sub}`);
    }

    const editRow = row => {
		setEditData(row);
		setFormType("edit")
		setIsModalVisible(true);
	};

	const [deleteSub] = useMutation(DELETE_SUB_LESSON, {
		onCompleted: data => {
            refetch();
            message.success('Амжилттай устлаа');
		}
	});
	
	function deleteModal(row) {
        console.log(row);
		confirm({
		  title: 'Устгах уу?',
		  okText: 'Устгах',
		  okType: 'danger',
		  cancelText: 'Болих',
		  onOk() {
			deleteSub({ variables: { id: row } }); 
		  },
		});
	}

    const showModal = () => {
		setFormType("create")
      	setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const cardActions = (item) => {
        const getAction = [];
        if (props.permissions.edit === true) {
            getAction.push(<EditTwoTone twoToneColor={'#ffdb00'} onClick={() => editRow(item)}/>)
        }
        if (props.permissions.destroy === true) {
            getAction.push(<DeleteTwoTone twoToneColor={'#f42f2f'} onClick={() => deleteModal(item.id)} />)
        }
        return getAction;
    }

    if (typeLoading) {
        return <Loading cover="content" />
    }

    return (
        <>
            <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                <Flex mobileFlex={false}>
                    <div className='text-right' >
                        <Button onClick={() => history.goBack()} type="default" icon={<RollbackOutlined />} block> <IntlMessage id="back" /></Button>
                    </div>
                </Flex>
                { props.permissions.create === true && 
                    <>
                        <Modal 
                            forceRender 
                            title={formType === 'edit' ? <IntlMessage id="edit" /> : <IntlMessage id="add_new" /> }
                            visible={isModalVisible} 
                            okText={<IntlMessage id="main.okText" />}
                            cancelText={<IntlMessage id="main.cancelText" />}
                            width={'80vw'}
                            onCancel={handleCancel}
                            okButtonProps={{form:'SubLessonForm', key: 'submit', htmlType: 'submit'}}
                            >
                                <Form 
                                    lesson={props.lesson}
                                    editData={editData} 
                                    formType={formType} 
                                    setIsModalVisible={setIsModalVisible}
                                />
                        </Modal>
                        <div className='text-right'>
                            <Button onClick={showModal} type="primary" icon={<PlusCircleOutlined />} block> <IntlMessage id="add_new" /></Button>
                        </div>
                    </>
                }
            </Flex>
            <Card className='mt-4' >
                <Tabs defaultActiveKey={0}>
                    { typeData.allOnlineTypes.map((type, index) => (
                        <TabPane tab={type.name} key={index}>
                            <List
                                loading={loading}
                                grid={{
                                    gutter: 16,
                                    xs: 1,
                                    sm: 1,
                                    md: 2,
                                    lg: 2,
                                    xl: 4,
                                    xxl: 4,
                                }}
                                dataSource={data?.allOnlineSubByLesson.filter(asd => asd.onlineType.name === type.name)}
                                renderItem={item => (
                                    <List.Item>
                                        <Card
                                            hoverable
                                            actions={cardActions(item)}
                                        >
                                            <Meta 
                                                onClick={() => subLessonDetail({ lesson: props.lesson, sub: item.id })}
                                                title={
                                                    <Flex alignItems="center" justifyContent="between" mobileFlex={true}>
                                                        <Flex mobileFlex={true}>
                                                            <div className='text-left' >
                                                                {item.title}
                                                            </div>
                                                        </Flex>
                                                        <div className='text-left text-small'>
                                                            <CalendarTwoTone twoToneColor={''} />
                                                            <span className="ml-1 font-weight-semibold" >
                                                                {moment(item.dueDate).format('YYYY/MM/DD')}
                                                            </span>
                                                        </div>
                                                    </Flex>
                                                }
                                                description={item.description}
                                            />
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        </TabPane>

                    ))}
                </Tabs>
            </Card>
        </>
    )

}

export default AllSub;