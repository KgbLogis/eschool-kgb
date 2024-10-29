import useDomain from "hooks/useDomain";
import React from "react";
import LoginForm from "views/auth-views/components/LoginForm";
import { classNames } from "utils";

const Login = () => {

  const { domainData } = useDomain()

  return (
    <div className="min-h-screen overflow-hidden px-3 pt-2 bg-emind xl:bg-background">
      <div
        className={classNames(
          "-m-2 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden",
          "before:hidden before:xl:block before:content-[''] before:w-[63%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-emind/20 before:rounded-[100%]",
          "after:hidden after:xl:block after:content-[''] after:w-[63%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-emind after:rounded-[100%]",
        )}
      >
        <div className="container relative z-10 sm:px-10">
          <div className="block grid-cols-3 gap-4 xl:grid">
            <div className="flex-col col-span-2 hidden min-h-screen xl:flex">
              <div className="my-auto">
                <div className="mt-10 text-5xl font-bold leading-tight text-white -intro-x">
                  KGB 교육 시스템<br />
                  KGB сургалтын систем
                </div>
                <img
                  alt="KGB"
                  className="mt-16 h-80 -intro-x"
                  src='/img/login.png'
                />
              </div>
            </div>
            <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
              <div className="w-full px-5 py-8 bg-background mx-auto my-auto rounded-md shadow-md xl:ml-20 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                <img
                  alt="KGB"
                  className="w-44 mx-auto my-4"
                  src={domainData.logo}
                />
                <LoginForm />
                <div className="mt-10 text-center intro-x xl:mt-24 text-slate-600 xl:text-left">
                  <a className="text-primary " href="">
                    Үйлчилгээний нөхцөл
                  </a>{" "}
                  &{" "}
                  <a className="text-primary " href="">
                    Нууцлалын бодлого
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
