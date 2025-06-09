import { useQuery } from '@apollo/client'
import { CalendarIcon } from '@heroicons/react/outline'
import Loading from 'components/shared-components/Loading'
import { BASE_SERVER_URL } from 'configs/AppConfig'
import { ALL_NEWS } from 'graphql/news'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function News() {

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
            <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                {
                    news.map(item => (
                        <Link to={`/app/news/${item.id}`} key={item.id}>
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
        </>
    )
}
