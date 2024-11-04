import React from 'react'
import { classNames } from 'utils';

const StatisticWidget = ({ title, value, Svg, colorType }) => {

	return (
		<div className={classNames(
			colorType === 1 ? 'from-[#C67BFC] to-[#5971FF]' :
				colorType === 2 ? 'from-[#727DFD] to-[#33A1EE]' :
					colorType === 3 ? 'from-[#E7687F] to-[#F29A5F]' :
						colorType === 4 ? 'from-[#43D49B] to-[#9ADD68]' : '',
							`flex justify-between items-center bg-gradient-to-l rounded-2 `
		)}>
			<div className='p-4'>
				<h4 className="mb-0 font-bold text-white">{title}</h4>
				<h1 className="mb-0 font-bold text-white">{value}</h1>
			</div>
			<div>
				<img alt='icon' className="h-24 w-24 fill-emind opacity-20" src={`/img/menu/${Svg}.png`} />
			</div>
		</div>
	)
}

export default StatisticWidget