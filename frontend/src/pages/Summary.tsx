import Sidebar from "../components/Sidebar";
import OrderDetailsCard from "../components/OrderDetailsCard";
import OrderSummaryCard from "../components/OrderSummaryCard";
import BackButton from "../components/BackButton";
import Welcome from "../components/Welcome";
import Profile from "../components/Profile";
import ProfileDropDown from "../components/ProfileDropDown";
import { useEffect, useState } from "react";
import ConfirmPopUp from "../components/ConfirmPopUp";
import Axios from "axios";
import { useParams } from "react-router-dom";

interface Order {
    id: number;
    status: string;
    time: Date;
    id_table: number;
    id_tenant: number;
}

interface OrderProduct {
    num_product: number;
    id_product: number;
    id_order: number;
}

interface Product {
    id: number;
    name: string;
    price: number;
}

interface Tenant {
    id: number;
    name: string;
}

interface Payment {
    id: number;
    status: string;
    id_order: number;
}

interface OrderSummary {
    name: string;
    orderlist: (string | number)[][];
}

interface OrderDetails {
    orderid: number;
    code: number;
    tableid: number;
    time: Date;
    orderstatus: string;
    paymentstatus: string;
}

const Summary = () => {
    const { orderid } = useParams();
    const [confirmed, setConfirmed] = useState(false);
    const [showProfileDropDown, setShowProfileDropDown] = useState(false);
    const [showConfirmPopUp, setShowConfirmPopUp] = useState(false);
    const [joinedOrderDetailsData, setJoinedOrderDetailsData] = useState<
        OrderDetails[]
    >([]);
    const [buttonState, setButtonState] = useState({
        label: "Waiting for Payment",
        disabled: true,
        color: "mealshub-greenpalet",
        onClick: () => {},
    });
    const getOrderDetailsData = async () => {
        const orderResponse = await Axios.get(
            `http://localhost:8000/orders/${orderid}`,
        );
        const paymentResponse = await Axios.get(
            "http://localhost:8000/payments",
        );

        const orderData = orderResponse.data.data;
        const paymentData = paymentResponse.data.data;

        // Perform the join based on the specified conditions
        const OrderDataArray = [orderData];
        const result = OrderDataArray.map((order: Order) => {
            const matchingPayment = paymentData.find(
                (payment: Payment) => payment.id_order === order.id,
            );

            return {
                orderid: order.id,
                code: matchingPayment.id,
                tableid: order.id_table,
                time: order.time,
                orderstatus: order.status,
                paymentstatus: matchingPayment.status,
            };
        });

        setJoinedOrderDetailsData(result);
    };
    const [joinedOrderSummaryData, setJoinedOrderSummaryData] = useState<
        OrderSummary[]
    >([]);

    const handleProfileClick = () => {
        setShowProfileDropDown(!showProfileDropDown);
    };

    const handleConfirmPayment = async () => {
        setShowConfirmPopUp(true);

        // Panggil API untuk memperbarui status order menjadi "Confirmed" atau "Completed"
        try {
            console.log("BELOM");
            await Axios.patch(`http://localhost:8000/orders/${orderid}`, {
                status: "Confirmed", // Ubah status order ke "Confirmed"
            });
            console.log("MAASUK");

            // Dapatkan ulang data order setelah perubahan status
            getOrderDetailsData();

            // Atur ulang button state setelah konfirmasi
            setButtonState({
                label: "Confirmed", // Ganti label tombol menjadi "Confirmed"
                disabled: true,
                color: "mealshub-greenpalet",
                onClick: () => {}, // Fungsi kosong karena tombol akan dinonaktifkan setelah diklik
            });
        } catch (error) {
            // Handle error jika terjadi kesalahan saat memanggil API
            console.error("Error confirming payment:", error);
            // Tambahkan penanganan error sesuai kebutuhan aplikasi Anda
        }
    };

    const handleCloseConfirmPopUp = async () => {
        setShowConfirmPopUp(false);
    
        try {
            // Panggil API untuk memperbarui status order menjadi "Confirmed"
            await Axios.patch(`http://localhost:8000/orders/${orderid}`, {
                status: "Completed",
            });
    
            // Dapatkan ulang data order setelah perubahan status
            getOrderDetailsData();
    
            // Atur ulang button state setelah konfirmasi
            setButtonState({
                label: "Confirmed",
                disabled: true,
                color: "mealshub-greenpalet",
                onClick: () => {}, // Tombol dinonaktifkan karena status sudah "Confirmed"
            });
    
            setConfirmed(true); // Setelah menutup pop-up, tandai bahwa konfirmasi telah dilakukan
        } catch (error) {
            console.error("Error confirming payment:", error);
            // Tambahkan penanganan error sesuai kebutuhan aplikasi Anda
        }
    };
    

    const getOrderSummaryData = async () => {
        const orderResponse = await Axios.get(
            `http://localhost:8000/orders/${orderid}`,
        );
        const productResponse = await Axios.get(
            "http://localhost:8000/products",
        );
        const orderProductResponse = await Axios.get(
            "http://localhost:8000/orderproduct",
        );
        const tenantResponse = await Axios.get("http://localhost:8000/tenants");

        const orderData = orderResponse.data.data;
        const productData = productResponse.data.data;
        const orderProductData = orderProductResponse.data.data;
        const tenantData = tenantResponse.data.data;

        // Perform the join based on the specified conditions
        // OrderData is not an array, so we need to convert it into an array
        const orderDataArray = [orderData];
        const result = orderDataArray.map((order: Order) => {
            const tenant = tenantData.find(
                (tenant: Tenant) => tenant.id === order.id_tenant,
            );
            const orderproduct = orderProductData.filter(
                (orderProduct: OrderProduct) =>
                    orderProduct.id_order === order.id,
            );
            const listproduct = orderproduct.map(
                (orderProduct: OrderProduct) => {
                    const product = productData.find(
                        (product: Product) =>
                            product.id === orderProduct.id_product,
                    );
                    return [
                        product.name,
                        orderProduct.num_product,
                        product.price,
                    ];
                },
            );

            return {
                name: tenant.name,
                orderlist: listproduct,
            };
        });

        setJoinedOrderSummaryData(result);
    };
    useEffect(() => {
        getOrderDetailsData();
    }, []);
    useEffect(() => {
        getOrderSummaryData();
    }, []);

    console.log(joinedOrderSummaryData);
    useEffect(() => {
        // Update button state based on payment and order status
        if (joinedOrderDetailsData.length > 0) {
            const paymentStatus = joinedOrderDetailsData[0].paymentstatus;

            if (paymentStatus === "Waiting for Confirmation") {
                setButtonState({
                    label: "Confirm",
                    disabled: false,
                    color: "mealshub-red",
                    onClick: () => setShowConfirmPopUp(true), // Menampilkan pop-up saat tombol diklik
                });
            } else if (paymentStatus === "Confirmed") {
                setButtonState({
                    label: "Confirmed",
                    disabled: true,
                    color: "mealshub-greenpalet",
                    onClick: () => {}, // Tombol dinonaktifkan karena status sudah "Confirmed"
                });
            }
        }
    }, [joinedOrderDetailsData]);

    return (
        // Create grid layout for sidebard, header, and main content
        <div className="grid grid-cols-5 grid-rows-8 bg-mealshub-cream min-h-screen">
            {/* Sidebar */}
            <div className="col-span-1 row-span-8">
                <Sidebar
                    number={1}
                    current={1}
                    menu1="Payment List"
                    path1="M8.22042 7.85718C6.79962 7.85718 5.43701 8.47803 4.43235 9.58316C3.42769 10.6883 2.86328 12.1872 2.86328 13.75V14.9286H37.1433V13.75C37.1433 12.1872 36.5789 10.6883 35.5742 9.58316C34.5696 8.47803 33.2069 7.85718 31.7861 7.85718H8.22042ZM2.86328 30.25V17.2857H37.1433V30.25C37.1433 31.8129 36.5789 33.3118 35.5742 34.4169C34.5696 35.522 33.2069 36.1429 31.7861 36.1429H8.22185C6.80105 36.1429 5.43844 35.522 4.43378 34.4169C3.42912 33.3118 2.86471 31.8129 2.86471 30.25H2.86328ZM26.0719 25.9286C25.7877 25.9286 25.5152 26.0528 25.3142 26.2738C25.1133 26.4948 25.0004 26.7946 25.0004 27.1072C25.0004 27.4198 25.1133 27.7195 25.3142 27.9406C25.5152 28.1616 25.7877 28.2857 26.0719 28.2857H31.0719C31.356 28.2857 31.6285 28.1616 31.8295 27.9406C32.0304 27.7195 32.1433 27.4198 32.1433 27.1072C32.1433 26.7946 32.0304 26.4948 31.8295 26.2738C31.6285 26.0528 31.356 25.9286 31.0719 25.9286H26.0719Z"
                />
            </div>
            {/* Header */}
            <div className="col-span-4">
                <div className="row-span-1 ms-20 mt-9 py-3 w-11/12">
                    <Welcome user="Aldaebaran" />
                </div>
                <div className="absolute top-0 right-0 mt-9 mx-12">
                    <Profile
                        image="/images/ProfileDefault.png"
                        onProfileClick={handleProfileClick}
                    />
                </div>
                <div className="absolute top-12 right-0 mt-9 mx-12">
                    {showProfileDropDown && (
                        <ProfileDropDown
                            name="Aldaebaran"
                            email="Aldaebaran@example.com"
                        />
                    )}
                </div>
                <div className="row-span-7 mt-6 mb-9 w-11/12">
                    <div className="ms-4">
                        <BackButton />
                    </div>
                    <div className="ms-20 py-12 bg-white rounded-3xl">
                        <h2 className="text-mealshub-red text-3xl font-bold ms-16">
                            Order Details
                        </h2>
                        <OrderDetailsCard data={joinedOrderDetailsData} />
                        <OrderSummaryCard data={joinedOrderSummaryData} />
                        <div className="flex mx-16 justify-center">
                            <button
                                onClick={buttonState.onClick}
                                disabled={buttonState.disabled}
                                className={`max-w-xs text-white font-bold text-lg rounded-full px-2 py-1 text-center shadow-xl bg-${buttonState.color}`}
                            >
                                {buttonState.label}
                            </button>
                        </div>
                        {showConfirmPopUp && (
                            <ConfirmPopUp onClose={handleCloseConfirmPopUp} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Summary;
