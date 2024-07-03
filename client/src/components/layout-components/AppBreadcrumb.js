import React, { Component, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { GetData } from "configs/NavigationConfig";
import IntlMessage from "components/util-components/IntlMessage";

let breadcrumbData = { 
	'/app' : <IntlMessage id="home" />
};

const BreadcrumbRoute = withRouter(props => {
	const gettingdata = GetData();
	const [navigationConfig, setNavigationConfig] = useState([]);
	useEffect(() => {
		if(gettingdata !== null){
			setNavigationConfig(gettingdata);
		}
	}, [gettingdata])
	navigationConfig.forEach((elm, i) => {
		const assignBreadcrumb = (obj) => breadcrumbData[obj.path] = <IntlMessage id={obj.title} />;
		assignBreadcrumb(elm);
		if (elm.submenu) {
			elm.submenu.forEach( elm => {
				assignBreadcrumb(elm)
				if(elm.submenu) {
					elm.submenu.forEach( elm => {
						assignBreadcrumb(elm)
					})
				}
			})
		}
	})
	const { location } = props;
	const pathSnippets = location.pathname.split('/').filter(i => i);
	const buildBreadcrumb = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbData[url]}</Link>
      </Breadcrumb.Item>
    );
	});
  
  return (
		<Breadcrumb>
			{buildBreadcrumb}
		</Breadcrumb>
  );
});

export class AppBreadcrumb extends Component {
	render() {
		return (
			<BreadcrumbRoute />
		)
	}
}

export default AppBreadcrumb
