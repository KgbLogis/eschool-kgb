import { AUTH_PREFIX_PATH, LANDING_PREFIX_PATH } from 'configs/AppConfig';
import useDomain from 'hooks/useDomain';
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import { classNames } from 'utils';
import LandingViews from 'views/landing-views';

export default function LandingLayout() {

    const { domainData } = useDomain()

    const [navbarOpen, setNavbarOpen] = useState(false);
    const [sticky, setSticky] = useState(false);

    const mobileMenuRef = useRef(null);

    const headerData = [
        { label: "Нүүр", href: "/#main-banner" },
        { label: "Бидний тухай", href: "/#portfolio" },
        { label: "Мэдээлэл", href: "/#upgrade" },
        { label: "Холбоо барих", href: "/documentation#version" },
    ];

    useEffect(() => {

        const handleScroll = () => {
            // setSticky(window.scrollY >= 80);
        };

        const handleClickOutside = (event) => {
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target) &&
                navbarOpen
            ) {
                setNavbarOpen(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [navbarOpen]);

    return (
        <div className='bg-mkp-2'>
            <header
                className={classNames(
                    sticky ? " shadow-lg bg-mkp-2 " : "shadow-none",
                    'absolute top-0 z-40 w-full transition-all duration-300'
                )}
            >
                <div className="lg:py-0 py-2">
                    <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex items-center justify-between px-4">
                        {/* <Logo /> */}
                        <img
                            alt="logo"
                            className={classNames(
                                "h-16 w-auto hidden ml-16 my-auto mx-auto lg:block "
                            )}
                            src={domainData.logo}
                        />
                        <nav className="hidden lg:flex flex-grow items-center gap-8 justify-center">
                            {headerData.map((item, index) => (
                                <div
                                    className="relative"
                                    key={index}
                                >
                                    <Link
                                        href={item.href}
                                        className={classNames(
                                            sticky ? 'text-mkp' : 'text-white',
                                            `text-base flex font-semibold hover:text-mkp capitalize`
                                        )}
                                    >
                                        {item.label}
                                        {item.submenu && (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="1.5em"
                                                height="1.5em"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="m7 10l5 5l5-5"
                                                />
                                            </svg>
                                        )}
                                    </Link>
                                </div>
                            ))}
                        </nav>
                        <div className="flex items-center gap-4">
                            <Link
                                to={`${AUTH_PREFIX_PATH}/login`}
                                className="hidden lg:block bg-transparent text-mkp-2 border hover:bg-mkp border-mkp hover:text-white px-4 py-2 rounded-lg"
                            >
                                Нэвтрэх
                            </Link>
                            <Link
                                to={`${AUTH_PREFIX_PATH}/register`}
                                className={classNames(
                                    sticky ? 'bg-mkp text-white hover:text-mkp-2' : 'bg-mkp text-white hover:bg-transparent hover:text-mkp-2 ',
                                    'hidden lg:block   border border-mkp px-4 py-2 rounded-lg'
                                )}
                            >
                                Бүртгүүлэх
                            </Link>
                            <button
                                onClick={() => setNavbarOpen(!navbarOpen)}
                                className="block lg:hidden p-2 rounded-lg"
                                aria-label="Toggle mobile menu"
                            >
                                <span className="block w-6 h-0.5 bg-white"></span>
                                <span className="block w-6 h-0.5 bg-white mt-1.5"></span>
                                <span className="block w-6 h-0.5 bg-white mt-1.5"></span>
                            </button>
                        </div>
                    </div>
                    {navbarOpen && (
                        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40" />
                    )}
                    <div
                        ref={mobileMenuRef}
                        className={`lg:hidden fixed top-0 right-0 h-full w-full bg-darkmode shadow-lg transform transition-transform duration-300 max-w-xs ${navbarOpen ? "translate-x-0" : "translate-x-full"
                            } z-50`}
                    >
                        <div className="flex items-center justify-between p-4">
                            <h2 className="text-lg font-bold text-midnight_text dark:text-midnight_text">
                                {/* <Logo /> */}
                            </h2>

                            {/*  */}
                            <button
                                onClick={() => setNavbarOpen(false)}
                                className="bg-no-repeat bg-contain w-5 h-5 absolute top-0 right-0 mr-8 mt-8 dark:invert"
                                aria-label="Close menu Modal"
                            ></button>
                        </div>
                        <nav className="flex flex-col items-start p-4">
                            {headerData.map((item, index) => (
                                <div className="relative w-full" key={index}>
                                    <Link
                                        href={item.href}
                                        className="flex items-center justify-between w-full py-2 text-white focus:outline-none"
                                    >
                                        {item.label}
                                        {item.submenu && (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="1.5em"
                                                height="1.5em"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="m7 10l5 5l5-5"
                                                />
                                            </svg>
                                        )}
                                    </Link>
                                </div>
                            ))}
                            <div className="mt-4 flex flex-col space-y-4 w-full">
                                <Link
                                    href="#"
                                    className="bg-transparent border border-mkp text-mkp px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white"
                                    onClick={() => {
                                        setNavbarOpen(false);
                                    }}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="#"
                                    className="bg-mkp text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    onClick={() => {
                                        setNavbarOpen(false);
                                    }}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
            <Switch>
                <Route path={`${LANDING_PREFIX_PATH}/`} component={LandingViews} />
            </Switch>
            <div className="bg-mkp" id="first-section">
                <div className="mx-auto max-w-2xl pt-48 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="grid grid-cols-1 gap-y-10 gap-x-16 sm:grid-cols-2 lg:grid-cols-12 xl:gap-x-8">
                        {/* COLUMN-1 */}
                        <div className='col-span-4'>
                            <h3 className='text-white text-4xl font-semibold leading-9 mb-4 lg:mb-20'>
                                Мон кор фовер
                            </h3>
                            <div className='flex gap-4'>
                                <div className='footer-icons'>
                                    <a href="https://www.facebook.com/profile.php?id=61576745552070" target='_blank' rel='noreferrer'>
                                        <img className='h-5 w-auto' src={'/img/footer/vec.svg'} alt="facebook" />
                                    </a>
                                </div>
                                {/* <div className='footer-icons'>
                                    <Link href="https://twitter.com"><img className='h-5 w-auto' src={'/img/footer/twitter.svg'} alt="twitter" /></Link>
                                </div> */}
                                <div className='footer-icons'>
                                    <a href="https://www.instagram.com/mon_kor_power/" target='_blank' rel='noreferrer'>
                                        <img className='h-5 w-auto' src={'/img/footer/instagram.svg'} alt="instagram" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* All Rights Reserved */}
                <div className="mx-auto max-w-2xl lg:max-w-7xl">
                    <div className="pt-5 pb-5 px-4 sm:px-6 lg:px-4 border-solid border-t border-footer">
                        <div className="mt-4 grid grid-cols-1 gap-y-10 gap-x-16 sm:grid-cols-2 xl:gap-x-8">
                            <div>
                                <h3 className='text-center md:text-start text-white text-lg'>@ {new Date().getFullYear()} - Бүх эрх хуулиар хамгаалагдсан</h3>
                            </div>
                            <div className="flex justify-center md:justify-end">
                                <Link href="/">
                                    <h3 className="text-white pr-6">Нууцлалын бодлого</h3>
                                </Link>
                                <Link href="/">
                                    <h3 className="text-white pl-6 border-solid border-l border-footer">Үйлчилгээний нөхцөл</h3>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
