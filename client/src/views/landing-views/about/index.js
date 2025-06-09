import React from 'react'
import { motion } from "framer-motion"

export default function Index() {

    const leftAnimation = {
        initial: { x: "-100%", opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: "-100%", opacity: 0 },
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
                    <motion.div {...leftAnimation} className="lg:col-span-5 col-span-12">
                        <h1 className="font-medium lg:text-7xl md:text-6xl text-5xl lg:text-start text-center text-white my-28">
                            Бидний тухай
                        </h1>
                    </motion.div>
                </div>
            </section>
        </>
    )
}
