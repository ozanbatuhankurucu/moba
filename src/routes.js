/*!

=========================================================
* Paper Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
//DASHBOARD PAGE
import Dashboard from "./pages/DashboardPage/DashboardPage";
//COMPANY PAGES
import ManageCompanyPage from "./pages/ManageCompanyPage/ManageCompanyPage";
//MENU PAGES
import ManageMenusPage from "./pages/ManageMenusPage/ManageMenusPaqe";
//ORDER PAGES
import ManageOrdersPage from "./pages/ManageOrdersPage/ManageOrdersPage";
import CanceledOrdersPage from "./pages/ManageOrdersPage/CanceledOrdersPage";
import ConfirmedOrdersPage from "./pages/ManageOrdersPage/ConfirmedOrdersPage";


var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/manage-company",
    name: "Manage Company",
    icon: "nc-icon nc-briefcase-24",
    component: ManageCompanyPage,
    layout: "/admin",
  },
  {
    collapse: true,
    path: "/order",
    name: "Order",
    icon: "nc-icon nc-cart-simple",
    state: "openComponents",
    views:[
        {
          path: "/manage-orders",
          name: "Manage Orders",
          icon: "nc-icon nc-basket",
          component: ManageOrdersPage,
          layout: "/admin",
        },
        {
          path: "/canceled-orders",
          name: "Canceled Orders",
          icon: "nc-icon nc-simple-remove",
          component: CanceledOrdersPage,
          layout: "/admin",
        },
        {
          path: "/confirmed-orders",
          name: "Confirmed Orders",
          icon: "nc-icon nc-check-2",
          component: ConfirmedOrdersPage,
          layout: "/admin",
        }
    ]
  
  },
  {
    path: "/manage-menus",
    name: "Manage Menus",
    icon: "nc-icon nc-chart-pie-36",
    component: ManageMenusPage,
    layout: "/admin",
  }
  
];
export default routes;
