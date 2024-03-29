import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

//import images
import avatar1 from "../../assets/images/users/avatar-1.jpg";

const ProfileDropdown = () => {

    const { user } = useSelector(state => ({
        user: state.Profile.user,
    }));

    const [userName, setUserName] = useState("Admin");

    useEffect(() => {
        if (sessionStorage.getItem("authUser")) {
            const obj = JSON.parse(sessionStorage.getItem("authUser")).accessToken;

            const userObj = JSON.parse(atob(obj.split('.')[1]));

            setUserName(userObj?.username || "Admin");
        }
    }, [userName, user]);

    //Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };
    return (
        <React.Fragment>
            <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
                <DropdownToggle tag="button" type="button" className="btn">
                    <span className="d-flex align-items-center">
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{userName}</span>
                        </span>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    <h6 className="dropdown-header">Welcome {userName}!</h6>
                    {/*<DropdownItem href={process.env.PUBLIC_URL + "/profile"}><i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>*/}
                    {/*    <span className="align-middle">Profile</span></DropdownItem>*/}
                    {/*<DropdownItem href={process.env.PUBLIC_URL + "/apps-chat"}><i*/}
                    {/*    className="mdi mdi-message-text-outline text-muted fs-16 align-middle me-1"></i> <span*/}
                    {/*        className="align-middle">Messages</span></DropdownItem>*/}
                    {/*<DropdownItem href="#"><i*/}
                    {/*    className="mdi mdi-calendar-check-outline text-muted fs-16 align-middle me-1"></i> <span*/}
                    {/*        className="align-middle">Taskboard</span></DropdownItem>*/}
                    {/*<DropdownItem href={process.env.PUBLIC_URL + "/pages-faqs"}><i*/}
                    {/*    className="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"></i> <span*/}
                    {/*        className="align-middle">Help</span></DropdownItem>*/}
                    <div className="dropdown-divider"></div>
                    {/*<DropdownItem href={process.env.PUBLIC_URL + "/pages-profile"}><i*/}
                    {/*    className="mdi mdi-wallet text-muted fs-16 align-middle me-1"></i> <span*/}
                    {/*        className="align-middle">Balance : <b>$5971.67</b></span></DropdownItem>*/}
                    {/*<DropdownItem href={process.env.PUBLIC_URL + "/pages-profile-settings"}><span*/}
                    {/*    className="badge bg-soft-success text-success mt-1 float-end">New</span><i*/}
                    {/*        className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i> <span*/}
                    {/*            className="align-middle">Settings</span></DropdownItem>*/}
                    {/*<DropdownItem href={process.env.PUBLIC_URL + "/auth-lockscreen-basic"}><i*/}
                    {/*    className="mdi mdi-lock text-muted fs-16 align-middle me-1"></i> <span className="align-middle">Lock screen</span></DropdownItem>*/}
                    <DropdownItem href={process.env.PUBLIC_URL + "/logout"}><i
                        className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i> <span
                            className="align-middle" data-key="t-logout">Logout</span></DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default ProfileDropdown;