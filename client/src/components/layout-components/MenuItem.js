import React, { Fragment, useEffect, useState } from 'react'
import IntlMessage from 'components/util-components/IntlMessage'
import { Link, useLocation } from 'react-router-dom'
import { classNames } from 'utils'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { Transition } from '@headlessui/react'

const MenuLink = ({ menu, active }) => {
    return (
        <Link
            className={classNames(
                active ? "bg-emind/5" : "",
                "h-[50px] flex items-center rounded-2 text-white mb-1 relative group w-full flex-row justify-start text-xs font-medium space-x-2 hover:bg-emind/5"
            )}
            to={menu.path}
        >
            <div className={classNames(
                active ? 'bg-emind' : '',
                'w-[2%] h-full rounded-l-4'
            )} />
            <img
                className={classNames(
                    active ? 'fill-emind' : 'fill-emind',
                    'h-8 w-8 group-hover:fill-emind'
                )}
                alt='icon'
                src={`/img/menu/${menu.icon}.png`}
            />
            <span
                className={classNames(
                    active ? '' : ' group-hover:text-emind',
                    'text-sm font-semibold ml-3 text-emind'
                )}
            >
                <IntlMessage id={menu.title} />
            </span>
        </Link>
    )
}

const MenuItem = ({ menu }) => {

    const location = useLocation()
    const [subnav, setSubnav] = useState(false);

    function handleSubNav() {
        setSubnav(prevData => !prevData)
    };

    function checkActive({ path }) {
        return location.pathname.includes(path)
    }

    useEffect(() => {
        function onLocationChange() {
            menu.submenu.map((item) => (
                location.pathname === item.path && setSubnav(true)
            ))
        }
        if (menu.path === '#') {
            onLocationChange()
        }
    }, [location, menu])

    return (
        <li className='my-2 animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-10'>
            {menu.submenu.length > 0 ?
                <div
                    onClick={handleSubNav}
                    className={classNames(
                        subnav ? 'bg-emind/5' :
                            '',
                        'group w-full p-2 rounded-3 flex justify-start items-center text-xs font-medium hover:text-white hover:cursor-pointer hover:bg-emind/5'
                    )}
                >
                    <img
                        alt='icon'
                        className={classNames(
                            subnav ? 'fill-emind' : 'fill-emind',
                            'h-8 w-8 group-hover:fill-white'
                        )}
                        src={`/img/menu/${menu.icon}.png`}
                    />
                    <div className='flex justify-between w-full items-center'>
                        <span
                            className={classNames(
                                subnav ? 'text-emind' : ' text-emind group-hover:text-emind',
                                'text-sm font-semibold ml-3'
                            )}
                        >
                            <IntlMessage id={menu.title} />
                        </span>
                        <ChevronDownIcon
                            className={classNames(
                                subnav ? 'text-emind rotate-180 ' : 'text-emind',
                                'h-4 w-4 transform transition'
                            )}
                        />
                    </div>
                </div>
                :
                <MenuLink
                    menu={menu}
                    active={checkActive({ path: menu.path })}
                />

            }
            <Transition.Root as={Fragment} show={subnav}>
                <Transition.Child
                    enter='transition ease-out duration-75'
                    enterFrom='transform opacity-0 scale-95'
                    enterTo='transform opacity-100 scale-100'
                    leave='transition ease-in duration-75'
                    leaveFrom='transform opacity-100 scale-100'
                    leaveTo='transform opacity-0 scale-95'
                >
                    <ul className='bg-emind/5 rounded-3 relative mt-2 block'>
                        <Transition.Child
                            enter='transform transition ease-in-out duration-500 sm:duration-700'
                            enterFrom='translate-x-full'
                            enterTo='translate-x-0'
                            leave='transform transition ease-in-out duration-350 sm:duration-500'
                            leaveFrom='translate-x-0'
                            leaveTo='translate-x-full'
                        >
                            {menu.key !== 'configs' && menu.submenu.map((submenu, idx) => (
                                <li className='my-1' key={idx}>
                                    <MenuLink
                                        menu={submenu}
                                        active={checkActive({ path: submenu.path })}
                                    />
                                </li>
                            ))}
                        </Transition.Child>
                    </ul>
                </Transition.Child>
            </Transition.Root>
        </li>
    )
}

export default MenuItem