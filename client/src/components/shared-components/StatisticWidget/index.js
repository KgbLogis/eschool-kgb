import React from 'react'
import PropTypes from "prop-types";

const StatisticWidget = ({ title, value, Svg }) => {
	return (
		<div className='flex justify-between items-center bg-gradient-to-br from-emind to-emind-2  rounded-2 p-4'>
            <div>
                <h1 className="mb-0 font-bold text-white">{value}</h1>
                <h4 className="mb-0 text-white">{title}</h4>
            </div>
            <div>
				<Svg className="h-16 w-16 fill-white" />
            </div>
		</div>
	)
}

StatisticWidget.propTypes = {
  	title: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
	subtitle: PropTypes.string,
	status: PropTypes.number,
	prefix: PropTypes.element
};

export default StatisticWidget