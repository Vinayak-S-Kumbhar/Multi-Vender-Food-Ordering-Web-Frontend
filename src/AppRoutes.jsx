// import { Routes, Route, useLocation } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import { useState } from "react";
// import Navbar from "./components/navbar";
// import Home from "./pages/Home";
// import AuthModal from "./components/AuthModal";
// import CategeryItemPage from "./pages/CategeryItemPage";
// import FoodPage from "./pages/FoodPage";
// import Restorent from "./pages/Restorent";
// import RestorentsList from "./pages/RestorentsList";
// import HostHotelForm from "./pages/HostHotelForm";
// import Cart from "./pages/Cart";
// import Order from "./pages/Order";
// import MyOrders from "./pages/MyOrders";
// import AddressPage from "./pages/AddressPage";
// import OAuth2SuccessHandler from "./handalOAuth2";
// import VendorDashboard from "./pages/VendorDashboard";
// import AddItem from "./pages/AddItem";
// import VenderFoodList from "./pages/VenderFoodList";
// import VenderOrders from "./pages/VenderOrders";
// import OwnerDashboard from "./pages/OwnerDashboard";
// import RestaurantsList from "./pages/RestorentsList";
// import OwnerVendorManagement from "./pages/OwnerVendorManagement";
// import OwnerOrdersPage from "./pages/OwnerOrdersPage";
// import OwnerUsersPage from "./pages/OwnerUsersPage";
// import OwnerFoodItemsPage from "./pages/OwnerFoodItemsPage";
// import Ratings from "./components/Ratings";
// import ContactUs from "./pages/ContactUs";
// import RestaurantDetails from "./pages/RestaurantDetails";
// import OrderDetailsPage from "./pages/OrderDetailsPage";
// import UserInfoPage from "./pages/UserInfoPage";

// export default function AppRoutes() {
//   const [authTrigger, setAuthTrigger] = useState(false);
//   const [dashboard, setDashboard] = useState(false);
//   const [activeHotel, setActiveHotel] = useState(null);
//   const [isSigneIn, setSigneIn] = useState(!!localStorage.getItem("userId"));

//   const location = useLocation();

//   const hideNav = location.pathname.startsWith("/Owner");

//   return (
//     <>
//       {!hideNav && (
//         <Navbar
//           authTrigger={authTrigger}
//           dashboard={dashboard}
//           setSigneIn={setSigneIn}
//           isSigneIn={isSigneIn}
//         />
//       )}
//       <Toaster />

//       <Routes>
//         {/* public routes */}
//         <Route path="/" element={<Home />} />
//         <Route
//           path="/login"
//           element={
//             <AuthModal
//               setAuthTrigger={setAuthTrigger}
//               setSigneIn={setSigneIn}
//             />
//           }
//         />
//         <Route path="/category/:category" element={<CategeryItemPage />} />
//         <Route path="/Item/:foodId" element={<FoodPage />} />
//         <Route path="/food/retings/:foodId" element={<Ratings />} />
//         <Route path="/Restorent/retings/:restorentId" element={<Ratings />} />
//         <Route path="/restorent/:restorentId" element={<Restorent />} />
//         <Route path="/restorents" element={<RestaurantsList />} />
//         <Route path="/contact-us" element={<ContactUs />} />
//         <Route path="/form" element={<HostHotelForm />} />
//         <Route
//           path="/Register-your-Hotel"
//           element={
//             <HostHotelForm setDashboard={setDashboard} dashboard={dashboard} />
//           }
//         />
//         <Route
//           path="/oauth-success"
//           element={<OAuth2SuccessHandler setAuthTrigger={setAuthTrigger} />}
//         />
//         <Route path="/Cart" element={<Cart />} />
//         <Route path="/Order" element={<Order />} />
//         <Route path="/My-Orders" element={<MyOrders />} />
//         <Route path="/adress" element={<AddressPage />} />

//         {/* vender paths */}
//         <Route
//           path="/Vender/dashbord"
//           element={
//             <VendorDashboard
//               setActiveHotel={setActiveHotel}
//               activeHotel={activeHotel}
//             />
//           }
//         />
//         <Route
//           path="/Vender/Add-Items"
//           element={<AddItem activeHotel={activeHotel} />}
//         />
//         <Route
//           path="/Vender/List-Item"
//           element={<VenderFoodList activeHotel={activeHotel} />}
//         />
//         <Route
//           path="/Vender/Orders"
//           element={<VenderOrders activeHotel={activeHotel} />}
//         />

//         {/* Owner Routes */}
//         <Route path="/Owner/dashboard" element={<OwnerDashboard />} />
//         <Route
//           path="/Owner/VenderManagement"
//           element={<OwnerVendorManagement />}
//         />
//         <Route
//           path="/Owner/VenderManagement/:restorentId"
//           element={<RestaurantDetails />}
//         />
//         <Route path="/Owner/Orders" element={<OwnerOrdersPage />} />
//         <Route path="/Owner/Order/:orderId" element={<OrderDetailsPage />} />
//         <Route path="/Owner/Users" element={<OwnerUsersPage />} />
//         <Route path="/Owner/User/:userId" element={<UserInfoPage />} />
//         <Route path="/Owner/FoodItems" element={<OwnerFoodItemsPage />} />
//       </Routes>
//     </>
//   );
// }

import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

import Navbar from "./components/navbar";
import Home from "./pages/Home";
import AuthModal from "./components/AuthModal";
import CategeryItemPage from "./pages/CategeryItemPage";
import FoodPage from "./pages/FoodPage";
import Restorent from "./pages/Restorent";
import RestorentsList from "./pages/RestorentsList";
import HostHotelForm from "./pages/HostHotelForm";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import MyOrders from "./pages/MyOrders";
import AddressPage from "./pages/AddressPage";
import OAuth2SuccessHandler from "./handalOAuth2";
import VendorDashboard from "./pages/VendorDashboard";
import AddItem from "./pages/AddItem";
import VenderFoodList from "./pages/VenderFoodList";
import VenderOrders from "./pages/VenderOrders";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerVendorManagement from "./pages/OwnerVendorManagement";
import OwnerOrdersPage from "./pages/OwnerOrdersPage";
import OwnerUsersPage from "./pages/OwnerUsersPage";
import OwnerFoodItemsPage from "./pages/OwnerFoodItemsPage";
import Ratings from "./components/Ratings";
import ContactUs from "./pages/ContactUs";
import RestaurantDetails from "./pages/RestaurantDetails";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import UserInfoPage from "./pages/UserInfoPage";

import RoleProtectedRoute from "./RoleProtectedRoute";
import RequestedRestaurantsPage from "./pages/RequestedRestaurantsPage";

export default function AppRoutes() {
  const [authTrigger, setAuthTrigger] = useState(false);
  const [dashboard, setDashboard] = useState(false);
  const [activeHotel, setActiveHotel] = useState(null);
  const [isSigneIn, setSigneIn] = useState(!!localStorage.getItem("userId"));

  const location = useLocation();

  const hideNav = location.pathname.startsWith("/Owner");

  return (
    <>
      {!hideNav && (
        <Navbar
          authTrigger={authTrigger}
          dashboard={dashboard}
          setSigneIn={setSigneIn}
          isSigneIn={isSigneIn}
        />
      )}

      <Toaster />

      <Routes>
        {/* public routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <AuthModal
              setAuthTrigger={setAuthTrigger}
              setSigneIn={setSigneIn}
            />
          }
        />
        <Route path="/category/:category" element={<CategeryItemPage />} />
        <Route path="/Item/:foodId" element={<FoodPage />} />
        <Route path="/food/retings/:foodId" element={<Ratings />} />
        <Route path="/Restorent/retings/:restorentId" element={<Ratings />} />
        <Route path="/restorent/:restorentId" element={<Restorent />} />
        <Route path="/restorents" element={<RestorentsList />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route
          path="/Register-your-Hotel"
          element={
            <HostHotelForm setDashboard={setDashboard} dashboard={dashboard} />
          }
        />
        <Route
          path="/oauth-success"
          element={<OAuth2SuccessHandler setAuthTrigger={setAuthTrigger} />}
        />

        <Route path="/Cart" element={<Cart />} />
        <Route path="/Order" element={<Order />} />
        <Route path="/My-Orders" element={<MyOrders />} />
        <Route path="/adress" element={<AddressPage />} />
        <Route
          path="/requested-restorents"
          element={<RequestedRestaurantsPage />}
        />

        {/* vender routes */}
        <Route
          path="/Vender/dashbord"
          element={
            <RoleProtectedRoute allowedRoles={["VENDER"]}>
              <VendorDashboard
                setActiveHotel={setActiveHotel}
                activeHotel={activeHotel}
              />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/Vender/Add-Items"
          element={
            <RoleProtectedRoute allowedRoles={["VENDER"]}>
              <AddItem activeHotel={activeHotel} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/Vender/List-Item"
          element={
            <RoleProtectedRoute allowedRoles={["VENDER"]}>
              <VenderFoodList activeHotel={activeHotel} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/Vender/Orders"
          element={
            <RoleProtectedRoute allowedRoles={["VENDER"]}>
              <VenderOrders activeHotel={activeHotel} />
            </RoleProtectedRoute>
          }
        />

        {/* owner routes */}
        <Route
          path="/Owner/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["OWNER"]}>
              <OwnerDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/Owner/VenderManagement"
          element={
            <RoleProtectedRoute allowedRoles={["OWNER"]}>
              <OwnerVendorManagement />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/Owner/VenderManagement/:restorentId"
          element={
            <RoleProtectedRoute allowedRoles={["OWNER"]}>
              <RestaurantDetails />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/Owner/Orders"
          element={
            <RoleProtectedRoute allowedRoles={["OWNER"]}>
              <OwnerOrdersPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/Owner/Order/:orderId"
          element={
            <RoleProtectedRoute allowedRoles={["OWNER"]}>
              <OrderDetailsPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/Owner/Users"
          element={
            <RoleProtectedRoute allowedRoles={["OWNER"]}>
              <OwnerUsersPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/Owner/User/:userId"
          element={
            <RoleProtectedRoute allowedRoles={["OWNER"]}>
              <UserInfoPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/Owner/FoodItems"
          element={
            <RoleProtectedRoute allowedRoles={["OWNER"]}>
              <OwnerFoodItemsPage />
            </RoleProtectedRoute>
          }
        />

        {/* any unknown route goes home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
