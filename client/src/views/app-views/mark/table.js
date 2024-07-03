import React, { useState } from 'react'
import { Card, Table, Spin, message, Button, InputNumber, Modal } from 'antd';
import { RollbackOutlined, DeleteTwoTone } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import { useQuery, useMutation } from '@apollo/client';
import { ALL_MARK, ALL_MARK_SETTING, CREATE_MARK, CREATE_MARK_REL, DELETE_MARK } from 'graphql/mark'
import IntlMessage from 'components/util-components/IntlMessage';
import { useHistory } from 'react-router-dom';
import StudentSelect from 'components/shared-components/StudentSelect';

const { confirm } = Modal;

function  MarkTable (props) {

    const history = useHistory();
    
	const { data: markData, loading: markLoading, refetch } = useQuery(ALL_MARK, {
        variables: { markBoard: props.markBoard.id},
        fetchPolicy: 'network-only',
		onCompleted: data => {
            const newData = [];
			markData?.allMarks.map(function(data) {
                const relData = {}
                data.markRelSet.map(function(a) {
                    var name = a.markSetting.name
					return (
                        Object.assign(relData, { [name]: {
                                markVal: a.markVal,
                                settingName: a.markSetting.name,
                                settingID: a.markSetting.id
    
                        }})
					)
				})
				return newData.push(
					{
						relData,
						student: data.student.id,
						name: data.student.name,
						familyName: data.student.familyName,
						studentCode: data.student.studentCode,
						mark: data.id,
						key: data.student.id,
					}
				);
				
			});
			setList(newData);
		}
	});
	const [createMarkRel, { loading: createRelLoading}] = useMutation(CREATE_MARK_REL, {
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
		}
	});

    const [destroy] = useMutation(DELETE_MARK, {
        onCompleted: data => {
            refetch();
        }
    })

	const { data: settingsData } = useQuery(ALL_MARK_SETTING);

	const [list, setList] = useState(undefined)

	const tableColumns = [
		{
			key: 'familyName',
			title: <IntlMessage id="familyName" />,
			dataIndex: 'familyName',
		},
		{
			key: 'name',
            title: <IntlMessage id="name" />,
            dataIndex: 'name',
		},
		{
			key: 'studentCode',
			title: <IntlMessage id="studentCode" />,
			dataIndex: 'studentCode',
		},
	];

	const newMarkData = [];

	const onInputChange = (event, key, index, record ) => {
		if (!newMarkData.length) {
			newMarkData.push(
				{
					mark: record.mark,
					markSetting: key,
					markVal: event,
				}
			)
		} else {
			if (newMarkData.filter(asd => asd.mark === record.mark && asd.markSetting === key).length === 0) {
				newMarkData.push(
					{
						mark: record.mark,
						markSetting: key,
						markVal: event,
					}
				)
			} else {
				newMarkData.filter(asd => asd.mark === record.mark && asd.markSetting === key).map(function(el) {
					return el.markVal = event
				});
			}
		}
	}
    
	
	function deleteRow(value) {
		confirm({
            title: 'Хасах уу?',
            okText: 'Хасах',
            okType: 'danger',
            cancelText: 'Болих',
            onOk() {
                destroy({ variables: { id: value } }); 
            },
		});
	}

	settingsData?.allMarkSettings.map((setting, index) => (
		tableColumns.push({
			key: setting.name,
			title: setting.name,
			dataIndex: ['relData', `${setting.name}`, 'markVal'],
			render: (text, record, index) => (
				<div>
					<InputNumber defaultValue={text} max={setting.percentage} min={0} onChange={(e) => onInputChange(e, setting.id, index, record )} />
				</div>
			),
		})
	))

    tableColumns.push({
        key: 'delete',
        title: 'Хасах',
        render: (text, record) => (
            <Button size="small" onClick={() => deleteRow(record.mark)} type="text" icon={<DeleteTwoTone twoToneColor="#f42f2f"/>} > Хасах </Button>
        ),
    })

	const onFinish = () => {
		if (newMarkData.length === 0) {
			message.warning('Өөрчлөлт алга байна');
		} else {
			newMarkData?.filter(data => data.markVal !== null).map((filteredData, index) => (
				createMarkRel({ variables: filteredData })
			));
		}
	};

    const [createMark, { loading: createLoading }] = useMutation(CREATE_MARK, {
        onError: error => {
            if (error.message === "Student matching query does not exist.") {
                message.warning('Суралцагч олдсонгүй!');
            }
        },
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            refetch();
		}
	});

	return (
		<>
            <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                <Flex mobileFlex={false}>
                    <div className='text-right' >
                        <Button onClick={() => history.goBack()} type="default" icon={<RollbackOutlined />} block> <IntlMessage id="back" /></Button>
                    </div>
                </Flex>
            </Flex>
            <StudentSelect 
                submitData={createMark}
                loading={createLoading}
                mutationData={{ markBoard: props.markBoard.id }}
            />
			{list !== undefined ? (
					<Card className='mt-4'>
						<div className="table-responsive">
							<Spin spinning={markLoading}>
									<Table 
										columns={tableColumns} 
										dataSource={list}
										rowKey='key'  
										size='small'
										pagination={false}
										bordered
                                        loading={markLoading}
									/>
									<Flex alignItems="left" justifyContent="between" mobileFlex={false}>
										<Flex className="mb-1" mobileFlex={false}>
											
										</Flex>
										{ props.permissions.create === true && 
											<Button style={{ margin: '10px' }}  onClick={onFinish} type="primary" loading={createRelLoading}>
												<IntlMessage id="main.okText" />
											</Button>
										}
									</Flex>
							</Spin>
						</div>
					</Card>
			) : null }
		</>
		
	)
}

export default MarkTable
