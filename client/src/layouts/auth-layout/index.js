import { AUTH_PREFIX_PATH, LANDING_PREFIX_PATH } from 'configs/AppConfig';
import useDomain from 'hooks/useDomain';
import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AuthViews from 'views/auth-views';

export const AuthLayout = () => {
	const { domainData } = useDomain();
	const { pathname } = useLocation();

	return (
		<div className="min-h-screen flex flex-col">
			<section className="relative w-full flex-1">
				<div className="absolute top-0 w-full h-full bg-gradient-to-r from-mkp-400 to-mkp -z-10" />

				<div className="container mx-auto px-4 h-full flex items-center justify-center">
					<div className="flex flex-col lg:flex-row w-full h-full items-center justify-center">

						{/* Left decoration - hidden on small screens */}
						<div className="hidden lg:block lg:w-3/12 px-4">
							<img src="/img/flags/login-mn.png" alt="Left decoration" className="w-full h-auto" />
						</div>

						{/* Form section */}
						<div className="w-full sm:w-10/12 md:w-8/12 lg:w-6/12 px-4 my-8">
							<div className="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-lg bg-mkp-2 border-0">
								<div className="rounded-t px-6 py-6">
									<div className="text-center">
										<Link to={LANDING_PREFIX_PATH}>
											<img
												alt="Мон Кор Фовер"
												className="w-44 mx-auto"
												src={domainData.logo}
											/>
										</Link>

										{/* Toggle Tabs */}
										<div className="mt-6 inline-flex border border-mkp rounded-full overflow-hidden bg-white shadow-sm">
											<Link
												to={`${AUTH_PREFIX_PATH}/login`}
												className={`px-6 py-2 text-sm font-semibold transition-colors duration-200 ${pathname === `${AUTH_PREFIX_PATH}/login`
													? "bg-mkp text-white"
													: "text-mkp hover:bg-mkp/10"
													}`}
											>
												Нэвтрэх
											</Link>
											<Link
												to={`${AUTH_PREFIX_PATH}/register`}
												className={`px-6 py-2 text-sm font-semibold transition-colors duration-200 ${pathname === `${AUTH_PREFIX_PATH}/register`
													? "bg-mkp text-white"
													: "text-mkp hover:bg-mkp/10"
													}`}
											>
												Бүртгүүлэх
											</Link>
										</div>
									</div>
								</div>

								<div className="flex-auto px-4 lg:px-10 py-10 pt-0">
									<Switch>
										<Route path={`${AUTH_PREFIX_PATH}/`} component={AuthViews} />
									</Switch>
								</div>
							</div>
						</div>

						{/* Right decoration - hidden on small screens */}
						<div className="hidden lg:block lg:w-3/12 px-4">
							<img src="/img/flags/login-ko.png" alt="Right decoration" className="w-full h-auto" />
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default AuthLayout;
