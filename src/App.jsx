import { createBrowserRouter , RouterProvider } from "react-router-dom";
import "./App.css";
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import "../node_modules/@fortawesome/fontawesome-free/js/brands.min.js";
import Layout from "./Components/Layout/Layout";
import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound/NotFound";
import Register from "./Pages/Register/Register";
import Register2 from "./Pages/Register/Register2";
import Login from "./Pages/Login/Login";
import UserTokenContextProvider from "./Context/userTokenContext.jsx";
import RegisterContextProvider from "./Context/registerContext";
import HousingWork from "./Pages/Housing&Work/Housing-Work";
import Age from "./Pages/Age/Age";
import PhoneNumber from "./Pages/PhoneNumber/PhoneNumber";
import SuccessPage from "./Pages/SuccessPage/SuccessPage";
import UserData from "./Pages/UserData/UserData";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Search from "./Pages/UserSearch/UserSearch";
import ConfirmCode from "./Pages/ConfirmCode/ConfirmCode";
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword";
import UpdatePassword from "./Pages/UpdatePassword/UpdatePassword.jsx";
import Policy from "./Pages/Policy/Policy";
import Whoweare from "./Pages/WhoWeAre/WhoWeAre";
import GenerateQRCode from "./Pages/UserSearch/GenerateQRCode .jsx";
import ScanQRCode from "./Pages/UserSearch/ScanQRCode .jsx";
import SearchOptions from "./Pages/UserSearch/SearchOptions.jsx";
import ConfirmUserCode from "./Pages/ConfirmUserCode/ConfirmCode.jsx";


function App() {
  let routing = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "/home", element: <Home /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/register2", element: <Register2 /> },
        { path: "/housing-work", element: <HousingWork /> },
        { path: "/age", element: <Age /> },
        { path: "/phoneNumber", element: <PhoneNumber /> },
        { path: "/successPage", element: <SuccessPage /> },
        { path: "/userdata", element: <ProtectedRoute><UserData /></ProtectedRoute> },
        { path: "/search", element: <Search />  },
        { path: "/searchoptions", element: <SearchOptions />  },
        { path: "/generateqr", element: <GenerateQRCode />  },
        { path: "/scanqr", element: <ScanQRCode />  },
        { path: "/code", element: <ConfirmCode />  },
        { path: "/confirmusercode", element: <ConfirmUserCode />  },
        { path: "/forgetPassword", element: <ForgetPassword />  },
        { path: "/updatePassword", element: <UpdatePassword />  },
        {path: "/policy" , element: <Policy/>},
        {path: "/whoweare" , element: <Whoweare/>},
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return (
    <>
      <UserTokenContextProvider>
        <RegisterContextProvider>
        <RouterProvider router={routing}></RouterProvider>
        </RegisterContextProvider>
      </UserTokenContextProvider>
    </>
  );
}

export default App;
