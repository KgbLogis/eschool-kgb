import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  MenuAlt2Icon,
  XIcon,
} from '@heroicons/react/outline'
import AppViews from 'views/app-views'
import NavProfile from 'components/layout-components/NavProfile'
import { useMenu } from 'hooks/useMenu';
import useDomain from 'hooks/useDomain';
import MenuItem from 'components/layout-components/MenuItem';
import { SupportSVG } from 'assets/svg/icon';
import { classNames } from 'utils'
import defaultLogo from 'assets/logo/default.png'

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { mainNavTree } = useMenu()
  const { domainData } = useDomain()

  return (
    <div className='bg-emind px-5 max-w-full overflow-hidden'>
      <div className="pb-7 before:content-[''] before:absolute before:inset-0 before:bg-fixed before:bg-no-repeat before:bg-skew-pattern">
        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog as="div" className="lg:hidden" onClose={setMobileMenuOpen}>
            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
              </Transition.Child>
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <div className="relative max-w-xs w-full bg-white pt-5 pb-4 flex-1 flex flex-col">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-1 right-0 -mr-14 p-1">
                      <button
                        type="button"
                        className="h-8 w-8 rounded-full flex items-center justify-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        <span className="sr-only">Close sidebar</span>
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex-shrink-0 px-4 flex items-center">
                    <img
                      className={classNames(
                        domainData.logo === defaultLogo ? 'h-8' : 'h-16 ',
                        "w-auto"
                      )}
                      src={domainData.logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="mt-5 flex-1 h-0 px-2 overflow-y-auto">
                    <nav className="h-full w-[17.8rem] flex flex-col">
                      <div className="space-y-1">
                        {mainNavTree.map((item, index) => (
                          <MenuItem
                            key={index}
                            menu={item}
                            onClick={() => setMobileMenuOpen(false)}
                          />
                        ))}
                      </div>
                    </nav>
                  </div>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true">
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        <div
          className="relative mt-4"
        >
          <div
            className="flex"
          >
            <nav className="hidden bg-white rounded-4 mr-4 lg:block w-[105px] lg:w-[300px] px-5 pt-8 pb-16 overflow-x-hidden">
              <img
                alt="logo"
                className={classNames(
                  domainData.logo === defaultLogo ? 'h-16' : 'h-16 ',
                  "w-auto hidden ml-16 my-auto mx-auto lg:block"
                )}
                src={domainData.logo}
              />
              <ul className='mt-4'>
                {mainNavTree.map((menu, index) => (
                  <MenuItem menu={menu} key={index} />
                ))}
              </ul>
            </nav>
            <div className="max-w-full lg:max-w-auto rounded-[1.3rem] flex-1 min-w-0 min-h-screen pb-10 shadow-sm bg-white">
              <header className="h-[70px] relative flex items-center justify-between md:justify-end">
                <button
                  type="button"
                  className="px-4 text-emind lg:hidden"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <MenuAlt2Icon className="h-6 w-6 text-emind" aria-hidden="true" />
                </button>
                <div className="ml-2 flex items-center sm:ml-6">
                  <SupportSVG className="h-7 w-7 fill-emind" />
                  <NavProfile />
                </div>
              </header>
              <main className="mt-4 p-4">
                <AppViews />
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}