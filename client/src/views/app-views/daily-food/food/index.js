import React, { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { Button, Image } from 'antd'
import { PlusCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import { ALL_DAILY_MENU_FOODS } from 'graphql/food'
import { Link, useParams } from 'react-router-dom'
import DailyMenuForm from './form'
import FormModal from 'components/shared-components/FormModal'
import IntlMessage from 'components/util-components/IntlMessage'
import { BASE_SERVER_URL } from 'configs/AppConfig';

const Food = () => {

    const { dailyMenu } = useParams()

    const { data } = useQuery(ALL_DAILY_MENU_FOODS, {
        variables: { dailyMenu: dailyMenu }
    })

    const modalRef = useRef()

    function handleCancel() {
        modalRef.current.handleCancel()
    }

    function handleOpen() {
        modalRef.current.handleOpen()
    }

    return (
        <>
            <FormModal ref={modalRef}>
                <DailyMenuForm
                    closeModal={handleCancel}
                />
            </FormModal>
            <div className='flex flex-row justify-between'>
                <Link to={'/app/food'}>
                    <Button type="text" icon={<RollbackOutlined />} > <IntlMessage id="back" /> </Button>
                </Link>
                <Button onClick={handleOpen} type="primary" icon={<PlusCircleOutlined />} > <IntlMessage id="add_new" /> </Button>
            </div>
            <div className='grid md:grid-cols-2 gap-4 mt-4'>
                {data?.allDailyMenuFoods.map((item, index) => (
                    <div className="relative mx-auto w-full" key={index}>
                        <div className="relative inline-block duration-300 ease-in-out transition-transform transform hover:-translate-y-2 hover:cursor-pointer w-full">
                            <div className="shadow p-4 rounded-7 bg-white">
                                <div className="flex justify-center relative rounded-lg overflow-hidden h-16">
                                    <span className="absolute top-0 left-0 inline-flex mt-3 ml-3 px-3 py-2 rounded-lg z-10 bg-emind-400 text-sm font-medium text-white select-none">
                                        {item.food.name}
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <div className="font-medium text-base md:text-lg text-gray-800 line-clamp-1" dangerouslySetInnerHTML={{ __html: item.food.ingredients }} />
                                    <p className="mt-2 text-sm text-gray-800 line-clamp-1" >
                                        <Image.PreviewGroup>
                                            {item.food.foodfileSet.map((food, index) => (
                                                <Image
                                                    key={index}
                                                    src={`${BASE_SERVER_URL}${food.image}`}
                                                    height={200}
                                                    alt="image description"
                                                />
                                            ))}
                                        </Image.PreviewGroup>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Food