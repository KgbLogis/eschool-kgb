import React, { useContext } from "react";
import { Menu, Dropdown, Avatar } from "antd";
import {
    EditOutlined,
    SettingOutlined,
    LogoutOutlined,
    UserOutlined
} from '@ant-design/icons';
import Icon from 'components/util-components/Icon';
import { Link } from "react-router-dom";
import IntlMessage from "components/util-components/IntlMessage";
import { UserContext } from "hooks/UserContextProvider";
import { BASE_SERVER_URL } from "configs/AppConfig";
import { AUTH_TOKEN } from "redux/constants/Auth";

const menuItem = [
    {
        title: <IntlMessage id="main.profile" />,
        icon: EditOutlined,
        path: "/app/update-profile"
    },
    {
        title: <IntlMessage id="main.update_password" />,
        icon: SettingOutlined,
        path: "/app/update-password"
    },
]

const NavProfile = () => {

    const { user, refetch } = useContext(UserContext)

    function logout() {
        localStorage.removeItem(AUTH_TOKEN);
        window.location.reload()
        refetch()
    }
    const profileMenu = (
        <div className="nav-profile nav-dropdown">
            <div className="nav-profile-header">
                <div className="d-flex">
                    {(() => {
                        if (user.isStudent) {
                            return (
                                <Avatar
                                    className="bg-emind-2"
                                    src={BASE_SERVER_URL + user.student.photo}
                                />
                            )
                        } else if (user.isTeacher) {
                            return (
                                <Avatar
                                    className="bg-emind-2"
                                    src={BASE_SERVER_URL + user.teacher.photo}
                                />
                            )
                        } else {
                            return (
                                <Avatar
                                    className="bg-emind-2"
                                    icon={<UserOutlined />}
                                />
                            )
                        }
                    })()}
                    <div className="pl-3">
                        <h4 className="mb-0">
                            {user.lastName} {user.firstName}
                        </h4>
                        <span className="text-muted">
                            {user.groups[0] ? user.groups[0].name : "Админ"}
                        </span>
                    </div>
                </div>
            </div>
            <div className="nav-profile-body">
                <Menu>
                    {menuItem.map((el, i) => {
                        return (
                            <Menu.Item key={i}>
                                <Link to={el.path}>
                                    <Icon className="mr-3" type={el.icon} />
                                    <span className="font-weight-normal">{el.title}</span>
                                </Link>
                            </Menu.Item>
                        );
                    })}
                    <Menu.Item key={menuItem.length + 1} onClick={logout}>
                        <span>
                            <LogoutOutlined className="mr-3" />
                            <span className="font-weight-normal">{<IntlMessage id="main.logout" />}</span>
                        </span>
                    </Menu.Item>
                </Menu>
            </div>
        </div>
    );

    return (
        <Dropdown className="bg-transparent border-none" placement="bottomRight" overlay={profileMenu} trigger={["click"]}>
            <Menu className="d-flex align-item-center" mode="horizontal">
                <Menu.Item key="profile">
                    {(() => {
                        if (user.isStudent) {
                            return (
                                <Avatar
                                    className="bg-emind-2"
                                    src={BASE_SERVER_URL + user.student.photo}
                                />
                            )
                        } else if (user.isTeacher) {
                            return (
                                <Avatar
                                    className="bg-emind-2"
                                    src={BASE_SERVER_URL + user.teacher.photo}
                                />
                            )
                        } else {
                            return (
                                <Avatar
                                    className="bg-emind-2"
                                    icon={<UserOutlined />}
                                />
                            )
                        }
                    })()}
                </Menu.Item>
            </Menu>
        </Dropdown>
    );
}

export default NavProfile
