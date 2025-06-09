import { useQuery } from '@apollo/client'
import Loading from 'components/shared-components/Loading'
import { BASE_SERVER_URL } from 'configs/AppConfig'
import { NEWS_BY_ID } from 'graphql/news'
import React from 'react'
import { useParams } from 'react-router-dom'
import { motion } from "framer-motion"

export default function Index() {

    const { id } = useParams()

    const { data, loading } = useQuery(NEWS_BY_ID, {
        variables: { id: id }
    })

    const leftAnimation = {
        initial: { x: "-100%", opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: "-100%", opacity: 0 },
        transition: { duration: 0.6 },
    };

    if (loading) {
        return <Loading cover='content' />
    }

    return (
        <>
            <section
                className="relative md:pt-40 md:pb-28 py-20 overflow-hidden z-1"
                id="main-banner"
            >
                <img
                    src={BASE_SERVER_URL + data.newsById.image}
                    alt={data.newsById.title}
                    className="absolute inset-0 w-full h-full object-cover z-1"
                />
                <div className="absolute inset-0 bg-mkp bg-opacity-50 z-1"></div>
                <div className="container mx-auto lg:max-w-screen-xl px-4">
                    <motion.div {...leftAnimation} className="lg:col-span-5 col-span-12">
                        <h1 className="font-medium lg:text-7xl md:text-6xl text-5xl lg:text-start text-center text-white my-28">
                            {data.newsById.title}
                        </h1>
                    </motion.div>
                </div>
            </section>
            <div className='py-28 container'>
                <div className="flex flex-col rounded-4 lg:flex-row lg:space-x-12 bg-background ">
                    <div className="px-4 lg:px-0 mt-12 text-gray-700 text-lg leading-relaxed mx-auto w-full lg:w-3/4">
                        <p className="pb-6 whitespace-pre-line">{data.newsById.description}</p>
                    </div>
                </div>
            </div>
        </>
    )
}
