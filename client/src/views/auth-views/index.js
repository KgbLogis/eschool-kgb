import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import Loading from 'components/shared-components/Loading';
import { AUTH_PREFIX_PATH, APP_NAME } from 'configs/AppConfig';

export const AppViews = () => {
  return (
    <>
      <Helmet>
            <title>Нэвтрэх хэсэг - {APP_NAME}</title>
      </Helmet>
      <Suspense fallback={<Loading cover="page"/>}>
        <Switch>
          <Route path={`${AUTH_PREFIX_PATH}/login`} component={lazy(() => import(`./authentication/login`))} />
          <Redirect from={`${AUTH_PREFIX_PATH}`} to={`${AUTH_PREFIX_PATH}/login`} />
        </Switch>
      </Suspense>
    </>
  )
}

export default AppViews;

