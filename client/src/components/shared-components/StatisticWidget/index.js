import React from 'react'
import { classNames } from 'utils';

const StatisticWidget = ({ title, value, Svg, colorType }) => {

	return (
		<div className={classNames(
			`flex justify-between items-center bg-gradient-to-r from-mkp-2-400 to-mkp-2 rounded-2 `
		)}>
			<div className='p-4'>
				<h4 className="mb-0 font-bold text-white">{title}</h4>
				<h1 className="mb-0 font-bold text-white">{value}</h1>
			</div>
			<div>
				<Svg className="h-24 w-24 fill-white opacity-20 pr-2" />
			</div>
		</div>
	)
}

export default StatisticWidget