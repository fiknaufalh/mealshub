import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TenantInfo from "./pages/TenantInfo";
import ShoppingCart from "./pages/ShoppingCart";
import Homepage from "./pages/Homepage";
import OrderList from "./pages/OrderList";
import OrderSummary from "./pages/OrderSummary";
import PageManageOrder from "./pages/PageManageOrder";
import PageManageMenu from "./pages/PageManageMenu";
import SignUpTenant from "./pages/SignUpTenant";
import SignUpCashier from "./pages/SignUpCashier";
import RegisterTable from "./pages/RegisterTable";
import ChooseRolePage from "./pages/RolePage";
import OrderDetails from "./pages/ManageOrderTenant";
import { ShoppingCartProvider } from "./contexts/ShoppingCartContext";
import Summary from "./pages/Summary";
import Payment from "./pages/Payment";

const orderid = 1;
export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/role" element={<ChooseRolePage />} />
            {/* <Route path="/login" element={<LoginPage />} /> */}
            <Route path="/login/customer" element={<RegisterTable />} />
            <Route path="/signup/tenant" element={<SignUpTenant />} />
            <Route path="/signup/cashier" element={<SignUpCashier />} />
            <Route path="/tenant" element={<TenantInfo tenantid={1} />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/order/list" element={<OrderList tableid={2} />} />
            <Route
                path="/order/summary"
                element={<OrderSummary orderid={3} />}
            />
            <Route path="/tenantpage/orders" element={<PageManageOrder />} />
            <Route path="/tenantpage/menus" element={<PageManageMenu />} />
            <Route
                path="/tenantpage/orders/:orderid"
                element={<OrderDetails />}
            />
            <Route path="/summary/orders/:orderid" element={<Summary />} />
            <Route path="/payment/:paymentid" element={<Payment />} />
        </Routes>
    );
}
