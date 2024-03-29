import Sidebar from "../components/Sidebar";
import Welcome from "../components/Welcome";
import MenuCard from "../components/MenuCard";
import AddButton from "../components/AddButton";
import Profile from "../components/Profile";
// import data from "../dataMenu.json";
import EditForm from "../components/EditForm";
import DeletePopUp from "../components/DeletePopUp";
import { useState, useEffect } from "react";
import AddForm from "../components/AddForm";
import ProfileDropDown from "../components/ProfileDropDown";
import { useAuth } from "../hooks/useAuth";

import Axios from "axios";

interface Product {
    id: number;
    image: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    id_tenant: number;
}

interface MenuCard {
    id: number;
    image: string;
    name: string;
    description: string;
    price: number;
    stock: number;
}

export default function PageManageMenu() {
    const { user, logout } = useAuth();
    const idTenant = user!.id;
    const [MenuData, setMenuData] = useState<MenuCard[]>([]);

    const getMenuData = async () => {
        const tenantResponse = await Axios.get(
            `http://localhost:8000/tenants/${idTenant}`,
        );
        const productResponse = await Axios.get(
            "http://localhost:8000/products",
        );

        const tenantData = tenantResponse.data.data;
        const productData = productResponse.data.data;

        // Perform the join based on the specified conditions
        // OrderData is not an array, so we need to convert it into an array
        const producttenant = productData.filter(
            (product: Product) => product.id_tenant === tenantData.id,
        );
        const result = producttenant.map((product: Product) => {
            return {
                id: product.id,
                image: product.image,
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
            };
        });

        setMenuData(result);
    };

    useEffect(() => {
        getMenuData();
    }, []);

    console.log(MenuData);

    const [data, setData] = useState([]);

    const getData = async () => {
        const res = await Axios.get("http://localhost:8000/products");
        setData(res.data);
        setData(res.data.data);
    };

    useEffect(() => {
        getData();
    }, []);

    const [menuToDelete, setMenuToDelete] = useState(null);
    const [menuToEdit, setMenuToEdit] = useState(null);
    const [isEditFormVisible, setEditFormVisible] = useState(false);
    const [isDeletePopUpVisible, setDeletePopUpVisible] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [showProfileDropDown, setShowProfileDropDown] = useState(false);

    const handleEditClick = (menuId: any) => {
        setMenuToEdit(menuId);
        setEditFormVisible(true);
    };

    const handleDeleteClick = (menuId: any) => {
        setMenuToDelete(menuId);
        setDeletePopUpVisible(true);
    };

    const handleCloseEditForm = () => {
        setEditFormVisible(false);
    };

    const handleCloseDeletePopUp = () => {
        setDeletePopUpVisible(false);
    };

    const handleAddMenuClick = () => {
        setShowAddMenu(true);
    };

    const handleCloseAddMenu = () => {
        setShowAddMenu(false);
    };
    const handleProfileClick = () => {
        setShowProfileDropDown(!showProfileDropDown);
    };

    const handleConfirmDelete = async (menuId: any) => {
        try {
            // Lakukan penghapusan menu menggunakan Axios
            await Axios.delete(`http://localhost:8000/products/${menuId}`);
            // Perbarui data setelah penghapusan
            getMenuData();
        } catch (error) {
            console.error("Error deleting menu:", error);
        }
    };

    const maxId = Math.max(...data.map((menu: any) => menu.id));
    return (
        // Create grid layout for sidebard, header, and main content
        <div className="grid grid-cols-5 grid-rows-8 min-h-screen bg-mealshub-cream">
            {/* Sidebar */}
            <div className="col-span-1 row-span-8">
                <Sidebar
                    default="/tenant/menus"
                    number={2}
                    current={1}
                    menu1="Menu"
                    path1="M0 0H27V32H0V0ZM2.7 3.2V12H24.3V3.2H2.7ZM24.3 15.2H2.7V28.8H24.3V15.2ZM5.3946 6.4H8.1V9.6H8.0946V9.6064H5.3946V6.4ZM10.8 6.4H21.6V9.6H10.8V6.4Z"
                    page1="/tenant/menus"
                    menu2="Orders"
                    path2="M4.10306 1.10306C3 2.20612 3 3.97929 3 7.52941V24.4706C3 28.0207 3 29.7939 4.10306 30.8969C5.20612 32 6.97929 32 10.5294 32H21.8235C25.3736 32 27.1468 32 28.2499 30.8969C29.3529 29.7939 29.3529 28.0207 29.3529 24.4706V7.52941C29.3529 3.97929 29.3529 2.20612 28.2499 1.10306C27.1468 -1.12197e-07 25.3736 0 21.8235 0H10.5294C6.97929 0 5.20612 -1.12197e-07 4.10306 1.10306ZM10.5294 7.52941C10.0302 7.52941 9.5514 7.72773 9.19839 8.08074C8.84538 8.43375 8.64706 8.91253 8.64706 9.41176C8.64706 9.911 8.84538 10.3898 9.19839 10.7428C9.5514 11.0958 10.0302 11.2941 10.5294 11.2941H21.8235C22.3228 11.2941 22.8015 11.0958 23.1546 10.7428C23.5076 10.3898 23.7059 9.911 23.7059 9.41176C23.7059 8.91253 23.5076 8.43375 23.1546 8.08074C22.8015 7.72773 22.3228 7.52941 21.8235 7.52941H10.5294ZM10.5294 15.0588C10.0302 15.0588 9.5514 15.2571 9.19839 15.6102C8.84538 15.9632 8.64706 16.4419 8.64706 16.9412C8.64706 17.4404 8.84538 17.9192 9.19839 18.2722C9.5514 18.6252 10.0302 18.8235 10.5294 18.8235H21.8235C22.3228 18.8235 22.8015 18.6252 23.1546 18.2722C23.5076 17.9192 23.7059 17.4404 23.7059 16.9412C23.7059 16.4419 23.5076 15.9632 23.1546 15.6102C22.8015 15.2571 22.3228 15.0588 21.8235 15.0588H10.5294ZM10.5294 22.5882C10.0302 22.5882 9.5514 22.7866 9.19839 23.1396C8.84538 23.4926 8.64706 23.9714 8.64706 24.4706C8.64706 24.9698 8.84538 25.4486 9.19839 25.8016C9.5514 26.1546 10.0302 26.3529 10.5294 26.3529H18.0588C18.5581 26.3529 19.0368 26.1546 19.3898 25.8016C19.7429 25.4486 19.9412 24.9698 19.9412 24.4706C19.9412 23.9714 19.7429 23.4926 19.3898 23.1396C19.0368 22.7866 18.5581 22.5882 18.0588 22.5882H10.5294Z"
                    page2="/tenant/orders"
                />
            </div>
            {/* Header */}
            <div className="col-span-4">
                <div className="ms-20 row-span-1 mt-9 py-3 w-11/12">
                    <Welcome user={user ? user!.fullname : ""} />
                </div>
                <div className="absolute top-0 right-0 mt-9 mx-12">
                    <Profile
                        image="/public/images/ProfileDefault.png"
                        onProfileClick={handleProfileClick}
                    />
                </div>
                <div className="absolute top-12 right-0 mt-9 mx-12">
                    {showProfileDropDown && (
                        <ProfileDropDown
                            name={user!.fullname}
                            email={user!.email}
                            onClick={logout}
                        />
                    )}
                </div>
                <div className="ms-20 row-span-6 mt-6 mb-9 py-7 w-11/12 h-auto bg-white rounded-3xl">
                    <h2 className="text-mealshub-red text-3xl font-bold ps-9">
                        Menu
                    </h2>
                    <div className="grid grid-cols-4 gap-6 h-4/5 my-6 mx-9 justify-items-center">
                        {MenuData.map((menus) => (
                            <div key={menus.id}>
                                <MenuCard
                                    image={menus.image}
                                    stock={menus.stock}
                                    name={menus.name}
                                    onEditClick={() =>
                                        handleEditClick(menus.id)
                                    }
                                    onDeleteClick={() =>
                                        handleDeleteClick(menus.id)
                                    }
                                />
                                {isEditFormVisible && (
                                    <EditForm
                                        onClose={handleCloseEditForm}
                                        idMenu={menuToEdit}
                                    />
                                )}
                                {isDeletePopUpVisible && (
                                    <DeletePopUp
                                        onClose={handleCloseDeletePopUp}
                                        onConfirm={() =>
                                            handleConfirmDelete(menuToDelete)
                                        }
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <AddButton onClick={handleAddMenuClick} />
                        {showAddMenu && (
                            <AddForm
                                onClose={handleCloseAddMenu}
                                idTenant={idTenant}
                                idProduct={maxId + 1}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
