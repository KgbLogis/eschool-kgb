import React from 'react'
import { Switch, Route, } from "react-router-dom";
import ReportViews from 'views/report-views';

export const ReportLayout = () => {

	return (
        <Switch>
            <Route path="" component={ReportViews} />
        </Switch>
	)
}


export default ReportLayout
