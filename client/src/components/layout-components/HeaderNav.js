import React from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, BulbOutlined } from '@ant-design/icons';
import Logo from './Logo';
import NavProfile from './NavProfile';
import NavLanguage from './NavLanguage';
import { toggleCollapsedNav, onMobileNavToggle } from 'redux/actions/Theme';
import { NAV_TYPE_TOP, SIDE_NAV_COLLAPSED_WIDTH, SIDE_NAV_WIDTH } from 'constants/ThemeConstant';
import utils from 'utils';
import { Link } from "react-router-dom";
import IntlMessage from "components/util-components/IntlMessage";

const { Header } = Layout;

export const HeaderNav = props => {
  const { navCollapsed, mobileNav, navType, headerNavColor, toggleCollapsedNav, onMobileNavToggle, isMobile, currentTheme } = props;

  const onToggle = () => {
    if(!isMobile) {
      toggleCollapsedNav(!navCollapsed)
    } else {
      onMobileNavToggle(!mobileNav)
    }
  }

  const isNavTop = navType === NAV_TYPE_TOP ? true : false
  const mode = ()=> {
    if(!headerNavColor) {
      return utils.getColorContrast(currentTheme === 'dark' ? '#00000' : '#ffffff' )
    }
    return utils.getColorContrast(headerNavColor)
  }
  const navMode = mode()
  const getNavWidth = () => {
    if(isNavTop || isMobile) {
      return '0px'
    }
    if(navCollapsed) {
      return `${SIDE_NAV_COLLAPSED_WIDTH}px`
    } else {
      return `${SIDE_NAV_WIDTH}px`
    }
  }
  
  return (
    <Header className={`app-header ${navMode}`} style={{backgroundColor: headerNavColor}}>
      <div className={`app-header-wrapper ${isNavTop ? 'layout-top-nav' : ''}`}>
        <Link to={'home'}>
          <Logo logoType={navMode}/>
        </Link>
        <div className="nav" style={{width: `calc(100% - ${getNavWidth()})`}}>
            <div className="nav-left">
                    <ul className="ant-menu ant-menu-root ant-menu-horizontal">          
                        {
                            isNavTop && !isMobile ?
                            null
                            :
                            <li className="ant-menu-item ant-menu-item-only-child" onClick={() => {onToggle()}}>
                            {navCollapsed || isMobile ? <MenuUnfoldOutlined className="nav-icon" /> : <MenuFoldOutlined className="nav-icon" />}
                            </li>
                        }
                        {
                            isMobile ?
                            null
                            :
                            <li className="ant-menu-item ant-menu-item-only-child" style={{cursor: 'default'}}>
                                <IntlMessage id="app-name" />
                            </li>
                        }
                    </ul>
            </div>
            <div className="nav-right">
                <Link to={'support'}>
                  <BulbOutlined/>
                </Link>
                <NavLanguage />
                <NavProfile />
            </div>
        </div>
      </div>
    </Header>
  )
}

const mapStateToProps = ({ theme }) => {
  const { navCollapsed, navType, headerNavColor, mobileNav, currentTheme, direction } =  theme;
  return { navCollapsed, navType, headerNavColor, mobileNav, currentTheme, direction }
};

export default connect(mapStateToProps, {toggleCollapsedNav, onMobileNavToggle})(HeaderNav);