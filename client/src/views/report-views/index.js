import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import Loading from 'components/shared-components/Loading';
import { REPORT_PREFIX_PATH, APP_NAME, AUTH_PREFIX_PATH } from 'configs/AppConfig';

export const AppViews = () => {
  return (
    <>
      <Helmet>
            <title>Тодорхойлолт - {APP_NAME}</title>
      </Helmet>
      <Suspense fallback={<Loading cover="page"/>}>
        <Switch>
          <Route path={`${REPORT_PREFIX_PATH}/student-report/:slug`} component={lazy(() => import(`./student-report`))} />
          <Redirect from={`${REPORT_PREFIX_PATH}`} to={`${AUTH_PREFIX_PATH}/login`} />
        </Switch>
      </Suspense>
    </>
  )
}

export default AppViews;

