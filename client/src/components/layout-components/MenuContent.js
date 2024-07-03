import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Grid } from "antd";
import CustomIcon from 'components/util-components/CustomIcon';
import { GetData } from "configs/NavigationConfig";
import { connect } from "react-redux";
import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE } from "constants/ThemeConstant";
import utils from 'utils'
import { onMobileNavToggle } from "redux/actions/Theme";
import IntlMessage from "components/util-components/IntlMessage";

const { SubMenu } = Menu;
const { useBreakpoint } = Grid;

const setDefaultOpen = (key) => {
  let keyList = [];
  let keyString = "";
  if (key) {
    const arr = key.split("-");
    for (let index = 0; index < arr.length; index++) {
      const elm = arr[index];
      index === 0 ? (keyString = elm) : (keyString = `${keyString}-${elm}`);
      keyList.push(keyString);
    }
  }
  return keyList;
};

const SideNavContent = (props) => {
	const { sideNavTheme, routeInfo, hideGroupTitle, onMobileNavToggle } = props;
	const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg')
	const closeMobileNav = () => {
		if (isMobile) {
			onMobileNavToggle(false)
		}
	}
    
    if (routeInfo === 'loading') {
        return 'loading'
    }
    return (
        <Menu
            theme={sideNavTheme === SIDE_NAV_LIGHT ? "light" : "dark"}
            mode="inline"
            style={{ height: "100%", borderRight: 0, marginTop: 20 }}
            defaultSelectedKeys={[routeInfo?.path]}
            defaultOpenKeys={setDefaultOpen(routeInfo?.path)}
            className={hideGroupTitle ? "hide-group-title" : ""}
        >
            {props.navigationConfig?.map((menu) =>
                menu.submenu.length > 0 ? (
                menu.key !== `configs` ? (
                    menu.submenu.map((subMenuFirst) =>
                        subMenuFirst.submenu.length > 0 && menu.key !== `configs` ? (
                        <SubMenu
                            icon={
                            subMenuFirst.icon ? (
                                <CustomIcon  svg={subMenuFirst?.icon} />
                            ) : null
                            }
                            key={subMenuFirst.path}
                            title={(
                            () => {
                                return <IntlMessage id={subMenuFirst.title} />
                            }
                            )()}
                        >
                            {subMenuFirst.submenu.map((subMenuSecond) => (
                            <Menu.Item key={subMenuSecond.path}>
                                {subMenuSecond.icon ? (
                                <CustomIcon  svg={subMenuSecond?.icon} />
                                ) : null}
                                <span>
                                <IntlMessage id={subMenuSecond.title} />
                                </span>
                                <Link onClick={() => closeMobileNav()} to={subMenuSecond.path} />
                            </Menu.Item>
                            ))}
                        </SubMenu>
                        ) : (
                        <Menu.Item key={subMenuFirst.path}>
                            {subMenuFirst.icon ? <CustomIcon  svg={subMenuFirst.icon} /> : null}
                            <span><IntlMessage id={subMenuFirst.title} /></span>
                            <Link onClick={() => closeMobileNav()} to={subMenuFirst.path} />
                        </Menu.Item>
                        )
                    )) : 
                <Menu.ItemGroup
                    key={menu.path}
                    title={<IntlMessage id={menu.title} />}
                >
                    {menu.submenu.map((subMenuFirst) =>
                    subMenuFirst.submenu.length > 0 && menu.key !== `configs` ? (
                        <SubMenu
                        icon={
                            subMenuFirst.icon ? (
                            <CustomIcon  svg={subMenuFirst?.icon} />
                            ) : null
                        }
                        key={subMenuFirst.path}
                        title={subMenuFirst.title}
                        >
                        {subMenuFirst.submenu.map((subMenuSecond) => (
                            <Menu.Item key={subMenuSecond.path}>
                            {subMenuSecond.icon ? (
                                <CustomIcon  svg={subMenuSecond?.icon} />
                            ) : null}
                            <span> <IntlMessage id={subMenuSecond.title} /> </span>
                            <Link onClick={() => closeMobileNav()} to={subMenuSecond.path} />
                            </Menu.Item>
                        ))}
                        </SubMenu>
                    ) : (
                        <Menu.Item key={subMenuFirst.path}>
                        {subMenuFirst.icon ? <CustomIcon  svg={subMenuFirst.icon} /> : null}
                            <span><IntlMessage id={subMenuFirst.title} /></span>
                        <Link onClick={() => closeMobileNav()} to={subMenuFirst.path} />
                        </Menu.Item>
                    )
                    )}
                </Menu.ItemGroup>
                ) : (
                <Menu.Item key={menu.path}>
                    {menu.icon ? <CustomIcon svg={menu.icon} /> : null}
                    <span><IntlMessage id={menu.title} /></span>
                    {menu.path ? <Link onClick={() => closeMobileNav()} to={menu.path} /> : null}
                </Menu.Item>
                )
            )}
        </Menu>
    );
};

const TopNavContent = (props) => {
  const { topNavColor } = props;
  return (
    <Menu mode="horizontal" style={{ backgroundColor: topNavColor }}>
      {props.navigationConfig?.map((menu) =>
        menu.submenu.length > 0 ? (
          <SubMenu
            key={menu.key}
            popupClassName="top-nav-menu"
            title={
              <span>
                {menu.icon ? <CustomIcon  type={menu?.icon} /> : null}
                <span>{menu.title}</span>
              </span>
            }
          >
            {menu.submenu.map((subMenuFirst) =>
              subMenuFirst.submenu.length > 0 ? (
                <SubMenu
                  key={subMenuFirst.key}
                  icon={
                    subMenuFirst.icon ? (
                      <CustomIcon  type={subMenuFirst?.icon} />
                    ) : null
                  }
                  title={subMenuFirst.title}
                >
                  {subMenuFirst.submenu.map((subMenuSecond) => (
                    <Menu.Item key={subMenuSecond.key}>
                      <span>
                        {subMenuSecond.title}
                      </span>
                      <Link to={subMenuSecond.path} />
                    </Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item key={subMenuFirst.key}>
                  {subMenuFirst.icon ? (
                    <CustomIcon  type={subMenuFirst?.icon} />
                  ) : null}
                  <span>{subMenuFirst.title}</span>
                  <Link to={subMenuFirst.path} />
                </Menu.Item>
              )
            )}
          </SubMenu>
        ) : (
          <Menu.Item key={menu.key}>
            {menu.icon ? <CustomIcon  type={menu?.icon} /> : null}
            <CustomIcon  type="message" style={{ fontSize: '16px', color: '#08c' }} theme="outlined" />
            <span>{menu?.title}</span>
            {menu.path ? <Link to={menu.path} /> : null}
          </Menu.Item>
        )
      )}
    </Menu>
  );
};

const MenuContent = (props) => {
    const gettingdata = GetData();
    const [mainNavTree, setMainNavTree] = useState([]);
    const [navigationConfig, setNavigationConfig] = useState([]);
    useEffect(() => {
        if(gettingdata !== null){
        setMainNavTree(gettingdata);
        } 
        if (mainNavTree !== undefined) {
        setNavigationConfig(mainNavTree);
        }
    }, [gettingdata, mainNavTree])
    return props.type === NAV_TYPE_SIDE ? (
        <SideNavContent navigationConfig={navigationConfig} {...props} />
    ) : (
        <TopNavContent navigationConfig={navigationConfig} {...props} />
    );
};

const mapStateToProps = ({ theme }) => {
  const { sideNavTheme, topNavColor } = theme;
  return { sideNavTheme, topNavColor };
};

export default connect(mapStateToProps, { onMobileNavToggle })(MenuContent);
