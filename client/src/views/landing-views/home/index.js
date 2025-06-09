import React from 'react'
import { motion } from "framer-motion"

export default function Index() {

    const leftAnimation = {
        initial: { x: "-100%", opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: "-100%", opacity: 0 },
        transition: { duration: 0.6 },
    };

    const Aboutdata = [
        {
            heading: "Бид хэн бэ?",
            paragraph:
                "Солонгос хэлний сургалтын төв маань бүх түвшний сурагчдад зориулсан сургалтаар мэргэшсэн бөгөөд туршлагатай багш нарын багтайгаар үйл ажиллагаа явуулдаг.",
            link: "Learn more",
        },
        {
            heading: "Эрхэм зорилго",
            paragraph:
                "Бид хэл сурах хүсэлтэй хүн бүрт чанартай, хүртээмжтэй боловсрол олгож, Солонгосын соёл, харилцааг давхар заадаг.",
            link: "Learn more",
        },
        {
            heading: "Яагаад биднийг сонгох вэ?",
            paragraph:
                "Уян хатан сургалтын хөтөлбөр, дэмжлэгтэй орчин, амжилттай төгсөгчдийн өндөр үр дүнгээрээ бид онцлог.",
            link: "Learn more",
        },
    ];

    return (
        <div>
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
                            Солонгос улсад ажиллах <br />{" "} таны хөтөч
                        </h1>
                        <div className="flex items-center md:justify-center justify-center gap-12 mt-20">
                            <a
                                href="https://play.google.com/store/apps/details?id=mn.logis.KGB"
                                target='_blank'
                                rel='noreferrer'
                                className="hover:scale-110 duration-300 bg-mkp rounded-4"
                            >
                                <img
                                    src="/img/home/playstore.png"
                                    alt="Play Store"
                                    className=''
                                />
                            </a>
                            <a
                                href="https://play.google.com/store/apps/details?id=mn.logis.KGB"
                                target='_blank'
                                rel='noreferrer'
                                className="hover:scale-110 duration-300 bg-mkp rounded-4"
                            >
                                <img
                                    src="/img/home/applestore.png"
                                    alt="App Store"
                                // width={240}
                                // height={70}
                                />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
            <section className=" bg-cover bg-center dark:bg-darkmode overflow-hidden">
                <div className="container mx-auto lg:max-w-(--breakpoint-xl) relative z-1 md:max-w-(--breakpoint-md)">
                    <div className="lg:p-12 px-2 bg-grey dark:bg-darkmode rounded-3xl">
                        <img
                            src="/img/home/dots.svg"
                            alt="dots"
                            className="absolute bottom-1 -left-20"
                        />
                        <p className="text-center text-primary text-18 tracking-widest uppercase mt-10">
                            Бидний тухай
                        </p>
                        <h4 className="text-center text-4xl lg:text-65 font-bold pb-12">
                            Биднийг илүү сайн таньж мэдээрэй.
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-16 lg:gap-x-32 mt-16">
                            {Aboutdata.map((item, i) => (
                                <div
                                    key={i}
                                    className="hover:bg-mkp bg-white rounded-3xl p-8 shadow-xl group mb-28"
                                >
                                    <h4 className="text-4xl font-semibold  text-black group-hover:text-white mb-5">
                                        {item.heading}
                                    </h4>
                                    <h4 className="text-lg font-normal text-black group-hover:text-white mb-5">
                                        {item.paragraph}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
