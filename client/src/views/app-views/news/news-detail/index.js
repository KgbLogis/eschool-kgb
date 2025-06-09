import { useMutation, useQuery } from '@apollo/client'
import { Button, Popconfirm } from 'antd'
import Flex from 'components/shared-components/Flex'
import Loading from 'components/shared-components/Loading'
import IntlMessage from 'components/util-components/IntlMessage'
import { APP_PREFIX_PATH, BASE_SERVER_URL } from 'configs/AppConfig'
import { ALL_NEWS, DELETE_NEWS, NEWS_BY_ID } from 'graphql/news'
import React from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import { RollbackOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import { CheckPer } from 'hooks/checkPermission'
import { message } from 'antd'

export default function Index() {

    const { id } = useParams()
    const history = useHistory()

    const { data, loading } = useQuery(NEWS_BY_ID, {
        variables: { id: id }
    })

    const [deleteNews] = useMutation(DELETE_NEWS, {
        refetchQueries: [{
            query: ALL_NEWS
        }],
        onCompleted: () => {
            message.success("Амжилттай устгалаа!")
            history.push(APP_PREFIX_PATH + '/news')
        }
    })

    const permissions = {
        edit: CheckPer('change_news'),
        delete: CheckPer('delete_news')
    }

    if (loading) {
        return <Loading cover='content' />
    }

    return (
        <>
            <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                <Flex className="mb-1" mobileFlex={false}>
                    <Link to="/app/news">
                        <Button type="default" icon={<RollbackOutlined />} block> <IntlMessage id="back" /></Button>
                    </Link>
                </Flex>
                <div className="text-center">
                    {permissions.edit === true &&
                        <Link to={`/app/news/${id}/edit`}>
                            <Button type="text" icon={<EditTwoTone twoToneColor="#ffdb00" />}> <IntlMessage id="edit" /></Button>
                        </Link>
                    }
                    {
                        permissions.delete === true &&
                        <Popconfirm
                            title="Устгах уу?"
                            onConfirm={() => deleteNews({ variables: { id: id } })}
                            okText="Тийм"
                            cancelText="Үгүй"
                        >
                            <Button
                                type='text'
                            >
                                <DeleteTwoTone twoToneColor="#f42f2f" />
                                <span className="ml-2"><IntlMessage id="delete" /></span>
                            </Button>
                        </Popconfirm>
                    }
                </div>
            </Flex>
            <div className="mb-4 md:mb-0 w-full mx-auto relative">
                <div className="px-4 lg:px-0">
                    <h2 className="text-4xl font-semibold text-gray-800 leading-tight">
                        {data.newsById.title}
                    </h2>
                </div>
                <img src={BASE_SERVER_URL + data.newsById.image} alt={data.newsById.title} className="w-full object-cover h-120 lg:rounded" />
            </div>
            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <div className="px-4 lg:px-0 mt-12 text-gray-700 text-lg leading-relaxed mx-auto w-full lg:w-3/4">
                    <p className="pb-6">{data.newsById.description}</p>
                </div>
            </div>
        </>
    )
}
