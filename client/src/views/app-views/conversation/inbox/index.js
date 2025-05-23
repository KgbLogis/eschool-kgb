import React, { useState } from 'react'
import { Input, Popconfirm } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import ConversationCard from 'components/shared-components/ConversationCard';
import ConversationBody from 'components/shared-components/ConversationBody';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_CONVERSATION, MY_INBOX } from 'graphql/conversation';
import Loading from 'components/shared-components/Loading';
import { RefreshIcon, TrashIcon } from '@heroicons/react/outline';

const Index = () => {

    const [selected, setSelected] = useState()
    const [filter, setFilter] = useState("")
    const [checkedList, setCheckedList] = useState([])

    const { data, loading, refetch } = useQuery(MY_INBOX, {
        variables: { filter: filter }
    }) 

    const [deleteConversation] = useMutation(DELETE_CONVERSATION, {
        onCompleted: data => {
            refetch()
            setCheckedList(prevList => prevList.filter((item) => item !== data.deleteConversation.conversation.id))
        }
    })

    function handleSelectAll(e) {
        if (e.target.checked) {
            setCheckedList(data.myInbox.map(li => li.id));
        } else {
            setCheckedList([]);
        }
    }

    function onDelete() {
        checkedList.map((item) => {
            deleteConversation({ variables: { id: item, deleteType: 'recipient' } })
        })
    }

    function onSearch(e) {
		const value = e.currentTarget.value
        setFilter(value)
	}

    return (
        <>
            <div className="flex flex-col w-full m-2 h-full bg-mkp/10 rounded-4 md:w-10/12">
                
                { selected ? (
                    <ConversationBody selected={selected} setSelected={setSelected} />
                    )
                    :
                    <>
                        <div className='flex flex-row items-center space-x-2 m-4'>
                            <input
                                onChange={handleSelectAll}
                                type="checkbox"
                                className="focus:ring-mkp-500 h-5 w-5 accent-mkp border-gray-300 rounded"
                            />
                            { checkedList.length > 0 ?
                                <Popconfirm
                                    title="Устгах уу?"
                                    okText="Устгах"
                                    cancelText="Болих"
                                    onConfirm={onDelete}
                                >
                                    <TrashIcon 
                                        className='h-5 w-5 text-red-500 hover:cursor-pointer'
                                    />
                                </Popconfirm>
                                :
                                    <div className='flex justify-between w-full items-center'>
                                        <Input onChange={e => onSearch(e)} className='ml-4 w-2/3 md:w-1/3' placeholder={'Хайх'} prefix={<SearchOutlined />} />
                                        <RefreshIcon 
                                            className='h-5 w-5 text-mkp hover:cursor-pointer'  
                                            onClick={() => refetch()}
                                        />
                                    </div>
                            }
                        </div>
                        <div className='m-2'>
                            { loading ? <Loading cover='content' /> :
                                data.myInbox.map((item, index) => (
                                <ConversationCard 
                                    selected={selected}
                                    isChecked={checkedList.includes(item.id)}
                                    data={item}
                                    key={index} 
                                    to={false}
                                    setSelected={setSelected} 
                                    setCheckedList={setCheckedList}
                                />
                            ))}
                        </div>
                    </>
                }
                
            </div>
        </>
    )
}

export default Index