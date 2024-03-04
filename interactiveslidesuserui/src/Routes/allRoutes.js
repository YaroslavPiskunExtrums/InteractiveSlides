import React from "react";
import {Navigate} from "react-router-dom";


//Icon pages
import RemixIcons from "../pages/Icons/RemixIcons/RemixIcons";


//Maps

//login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";


// User Profile
import UserProfile from "../pages/Authentication/user-profile";


import Sessions from "../pages/Sessions/Sessions";

import Presentations from "../pages/Presentations/Presentations";
import PresentationSettings from "../pages/Presentations/PresentationSettings/PresentationSettings";
import Users from "../pages/Users/Users";
import Admin from "../pages/Admin/Admin";
import Companies from 'src/pages/Companies/Companies'
import Integrations from 'src/pages/Integrations/Integrations'
import ChangePasswordPage from 'src/pages/ChangePassword/ChangePassword';

const authProtectedRoutes = [
  {path: "/companies", component: <Companies />},
  {path: "/sessions", component: <Sessions />},
  {path: "/integrations", component: <Integrations />},
  {path: "/presentations", component: <Presentations />},
  {path: "/presentations-settings/:presentationId", component: <PresentationSettings />},
  {path: "/users", component: <Users />},
  {path: "/admin", component: <Admin />},


  //Icons
  {path: "/icons-remix", component: <RemixIcons />},

  {
    path: "/",
    exact: true,
    component: <Navigate to="/presentations" />,
  },
  {path: "*", component: <Navigate to="/presentations" />},
];

const publicRoutes = [
  // Authentication Page
  {path: "/logout", component: <Logout />},
  {path: "/login", component: <Login />},
  {path: "/forgot-password", component: <ForgetPasswordPage />},
  {path: '/change-password', component: <ChangePasswordPage />}
  // { path: "/register", component: <Register /> },

  //AuthenticationInner pages

];

export {authProtectedRoutes, publicRoutes};