import useDomain from 'hooks/useDomain';
import React from 'react'
import { Switch, Route, } from "react-router-dom";
import AuthViews from 'views/auth-views';

export const AuthLayout = () => {

	const { domainData } = useDomain()

	return (
		<div className="auth-container">
			<section className="absolute w-full h-full">
				<div className="absolute top-0 w-full h-full bg-mkp-2" />
				<div className="container mx-auto px-4 h-full">
					<div className="flex content-center items-center justify-center h-full">
						<div className="hidden lg:block w-3/12 px-4">
							<img src="/img/flags/login-mn.png" alt="Left decoration" className="w-full h-auto" />
						</div>

						{/* Login form */}
						<div className="w-full px-4">
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
									<Switch>
										<Route path="" component={AuthViews} />
									</Switch>
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
		</div>
	)
}


export default AuthLayout
