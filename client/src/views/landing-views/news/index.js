import { useQuery } from '@apollo/client'
import Loading from 'components/shared-components/Loading'
import { BASE_SERVER_URL } from 'configs/AppConfig'
import { ALL_NEWS } from 'graphql/news'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from "framer-motion"
import moment from 'moment'
import { CalendarIcon } from '@heroicons/react/outline'

export default function Index() {

    const [offset, setOffset] = useState(0)
    const [canFetch, setCanFetch] = useState(true)
    const [news, setNews] = useState([])
    const { loading } = useQuery(ALL_NEWS, {
        variables: { offset: offset },
        onCompleted: res => {
            if (res.allNews.length < 12) {
                setCanFetch(false)
            }
            setNews(prevState => [...prevState, ...res.allNews])
        }
    })

    const rightAnimation = {
        initial: { x: "100%", opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: "100%", opacity: 0 },
        transition: { duration: 0.6 },
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            const clientHeight = document.documentElement.clientHeight || window.innerHeight;

            if (scrollTop + clientHeight >= scrollHeight - 100) {
                setOffset(prevState => prevState + 12)
            }
        };

        if (canFetch && !loading) {
            window.addEventListener('scroll', handleScroll);

        } else {
            window.removeEventListener('scroll', handleScroll);
        }

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [canFetch, loading]);

    return (
        <>
            <section
                className="relative md:pt-40 md:pb-28 py-20 overflow-hidden z-1"
                id="main-banner"
            >
                <img
                    src="/img/home/banner-image.jpg"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover z-1"
                />
                <div className="absolute inset-0 bg-mkp bg-opacity-50 z-1"></div>
                <div className="container mx-auto lg:max-w-screen-xl px-4">
                    <motion.div {...rightAnimation} className="lg:col-span-5 col-span-12">
                        <h1 className="font-medium lg:text-7xl md:text-6xl text-5xl lg:text-start text-center text-white my-28">
                            Мэдээ мэдээлэл
                        </h1>
                    </motion.div>
                </div>
            </section>
            <section className="py-28 bg-background">
                <div className="container">
                    <div className="relative">
                        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mt-14">
                            {
                                news.map((item, index) => (
                                    <Link to={`/landing/news/${item.id}`} key={index}>
                                        <div className="bg-white rounded-3xl shadow-lg m-4 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] overflow-hidden">
                                            <div className="aspect-[16/9] overflow-hidden rounded-t-3xl">
                                                <img
                                                    src={BASE_SERVER_URL + item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="p-6">
                                                <h4 className="text-xl font-semibold text-black mb-2 line-clamp-2 text-center">
                                                    {item.title}
                                                </h4>

                                                <div className="text-sm text-gray-600 text-center items-center flex justify-center">
                                                    <CalendarIcon className="inline-block w-4 h-4 mr-1 text-gray-500" />
                                                    {moment(item.createdAt).format('YYYY-MM-DD')}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            }
                        </div>
                        {loading && <Loading />}
                    </div>
                </div>
            </section>
        </>
    )
}
