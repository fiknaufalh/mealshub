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
import SignUpTenant from "./pages/RegisterTenant";
import SignUpCashier from "./pages/RegisterPage";
import RegisterTable from "./pages/RegisterTable";
import ChooseRolePage from "./pages/RolePage";
import OrderDetails from "./pages/ManageOrderTenant";
import Summary from "./pages/ManagePayment";
import Payment from "./pages/Payment";
import ViewPaymentHistory from "./pages/ViewPaymentHistory";
import ManagePayment from "./pages/ManagePayment";
import RegisterPage from "./pages/RegisterPage";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/role" element={<ChooseRolePage />} />
            <Route path="/login/:role" element={<LoginPage />} />
            <Route path="/login/customer" element={<RegisterTable />} />
            <Route path="/register/:role" element={<RegisterPage />} />
            <Route path="/register/tenant/data" element={<SignUpTenant />} />
            <Route path="/tenant/:tenantid" element={<TenantInfo />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/order/list/:tableid" element={<OrderList />} />
            <Route path="/order/summary/:orderid" element={<OrderSummary />} />
            <Route path="/tenant/orders" element={<PageManageOrder />} />
            <Route path="/tenant/menus" element={<PageManageMenu />} />
            <Route path="/tenant/orders/:orderid" element={<OrderDetails />} />
            <Route
                path="/cashier/payments/:orderid"
                element={<ManagePayment />}
            />
            <Route path="/payment/:paymentid" element={<Payment />} />
            <Route path="/cashier/payments" element={<ViewPaymentHistory />} />
        </Routes>
    );
}
