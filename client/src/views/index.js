import React, { useContext } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import AppLayout from "layouts/app-layout";
import AuthLayout from 'layouts/auth-layout';
import { APP_PREFIX_PATH, AUTH_PREFIX_PATH, LANDING_PREFIX_PATH, REPORT_PREFIX_PATH } from 'configs/AppConfig'
import ReportLayout from "layouts/report-layout";
import { UserContext } from 'hooks/UserContextProvider'
import LandingLayout from "layouts/landing-layout";

function RouteInterceptor({ children, isAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: AUTH_PREFIX_PATH,
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export const Views = (props) => {
    const { location } = props;

    const { user } = useContext(UserContext)
    
    return (
      <Switch>
          <Route exact path="/">
              <Redirect to={LANDING_PREFIX_PATH} />
          </Route>
          <Route path={AUTH_PREFIX_PATH}>
              <AuthLayout />
          </Route>
          <Route path={REPORT_PREFIX_PATH}>
              <ReportLayout />
          </Route>
          <Route path={LANDING_PREFIX_PATH}>
              <LandingLayout />
          </Route>
          <RouteInterceptor path={APP_PREFIX_PATH} isAuthenticated={user}>
              <AppLayout location={location}/>
          </RouteInterceptor>
      </Switch>
    )
}

export default withRouter(Views);