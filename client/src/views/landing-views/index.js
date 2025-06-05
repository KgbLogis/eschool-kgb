import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import Loading from 'components/shared-components/Loading';
import { LANDING_PREFIX_PATH, APP_NAME } from 'configs/AppConfig';

export const AppViews = () => {
  return (
    <>
      <Helmet>
            <title>Нүүр - {APP_NAME}</title>
      </Helmet>
      <Suspense fallback={<Loading cover="page"/>}>
        <Switch>
          <Route path={`${LANDING_PREFIX_PATH}/home`} component={lazy(() => import(`./home`))} />
          <Redirect from={`${LANDING_PREFIX_PATH}`} to={`${LANDING_PREFIX_PATH}/home`} />
        </Switch>
      </Suspense>
    </>
  )
}

export default AppViews;

