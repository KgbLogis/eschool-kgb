import useDomain from "hooks/useDomain";
import React from "react";
import LoginForm from "views/auth-views/components/LoginForm";

const Login = () => {

  const { domainData } = useDomain()

  return (
    <section className="absolute w-full h-full">
      <div className="absolute top-0 w-full h-full bg-mkp-2" />
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="hidden lg:block w-3/12 px-4">
            <img src="/img/flags/login-mn.png" alt="Left decoration" className="w-full h-auto" />
          </div>

          {/* Login form */}
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-[#f9f1dc] border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center ">
                  <img
                    alt="Мон Кор Фовер"
                    className="w-44 mx-auto"
                    src={domainData.logo}
                  />
                </div>
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <LoginForm />
              </div>
            </div>
          </div>
          <div className="hidden lg:block w-3/12 px-4">
            <img src="/img/flags/login-ko.png" alt="Right decoration" className="w-full h-auto" />
          </div>
        </div>
      </div>

      <footer className="hidden absolute w-full bottom-0 bg-mkp">
        <div className="container mx-auto px-4">
          <hr className="mb-6 border-b-1 border-gray-700" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4">
              <div className="text-sm text-mkp-2 font-semibold py-1">
                © {new Date().getFullYear()}
                <a href="/" className="text-mkp-2 hover:text-mkp-2-600 text-sm font-semibold py-1">
                  {" "}Мон Кор Фовер
                </a>
              </div>
            </div>
            <div className="w-full md:w-8/12 px-4">
              <ul className="flex flex-wrap list-none md:justify-end justify-center">
                <li>
                  <a href="/" className="text-mkp-2 hover:text-mkp-2-600 text-sm font-semibold block py-1 px-3">Үйлчилгээний нөхцөл</a>
                </li>
                <li>
                  <a href="/" className="text-mkp-2 hover:text-mkp-2-600 text-sm font-semibold block py-1 px-3">Нууцлалын бодлого</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </section>
    // <div className="min-h-screen overflow-hidden px-3 pt-2 bg-mkp xl:bg-background">
    //   <div
    //     className={classNames(
    //       "-m-2 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden",
    //       "before:hidden before:xl:block before:content-[''] before:w-[63%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-mkp before:rounded-[100%]",
    //       "after:hidden after:xl:block after:content-[''] after:w-[43%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-flag-mn-pattern after:rounded-[100%]",
    //     )}
    //   >
    //     <div className="container relative z-10 sm:px-10">
    //       <div className="block grid-cols-3 gap-4 xl:grid">
    //         <div className="flex-col col-span-2 hidden min-h-screen xl:flex">
    //           <div className="my-auto">
    //             <img
    //               alt="Мон Кор Фовер"
    //               className="mt-16 h-80 -intro-x"
    //               src='/img/login.svg'
    //             />
    //             <div className="mt-10 text-5xl font-bold leading-tight text-white -intro-x">
    //               MKP сургалтын систем
    //             </div>
    //           </div>
    //         </div>
    //         <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
    //           <div className="w-full px-5 py-8 bg-background mx-auto my-auto rounded-md shadow-md xl:ml-20 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
    //             <img
    //               alt="Мон Кор Фовер"
    //               className="w-44 mx-auto my-4"
    //               src={domainData.logo}
    //             />
    //             <LoginForm />
    //             <div className="mt-10 text-center intro-x xl:mt-24 text-slate-600 xl:text-left">
    //               <a className="text-primary " href="">
    //                 Үйлчилгээний нөхцөл
    //               </a>{" "}
    //               &{" "}
    //               <a className="text-primary " href="">
    //                 Нууцлалын бодлого
    //               </a>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Login;
