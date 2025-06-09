import React from 'react'
import { motion } from "framer-motion"

export default function Index() {

    const rightAnimation = {
        initial: { x: "100%", opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: "100%", opacity: 0 },
        transition: { duration: 0.6 },
    };

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
                            Холбоо барих
                        </h1>
                    </motion.div>
                </div>
            </section>
            <section className="bg-gray-100">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
                    <div className="mt-16 lg:mt-20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="rounded-lg overflow-hidden">
                                <iframe
                                    className='w-full h-full'
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src="https://www.google.com/maps/embed/v1/search?q=KGBMALL&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
                                    title="KGB Mall Location Map"
                                />
                            </div>
                            <div>
                                <div className="max-w-full mx-auto rounded-lg overflow-hidden">
                                    <div className="px-6 py-4">
                                        <h3 className="text-lg font-medium text-gray-900">Хаяг</h3>
                                        <p className="mt-1 text-gray-600">KGB төв байр, Наадамчдын зам-77, 5-р хороо, Хан-Уул, Улаанбаатар 17110-0030</p>
                                    </div>
                                    <div className="border-t border-gray-200 px-6 py-4">
                                        <h3 className="text-lg font-medium text-gray-900">Hours</h3>
                                        <p className="mt-1 text-gray-600">Даваа - Баасан: 10:00 - 18:00 </p>
                                        <p className="mt-1 text-gray-600">Бямба - Ням: Хаалттай</p>
                                    </div>
                                    <div className="border-t border-gray-200 px-6 py-4">
                                        <h3 className="text-lg font-medium text-gray-900">Холбоо барих</h3>
                                        <p className="mt-1 text-gray-600">И-мэйл: info@2424job.com</p>
                                        <p className="mt-1 text-gray-600">Утас: +(976) 7011-2424</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
