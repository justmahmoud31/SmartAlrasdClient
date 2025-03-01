/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import { FaBars, FaRegUser, FaSignInAlt, FaTimes } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import mainLogo from "../../assets/mainlogo.jpg";
import { UserTokenContext } from "../../Context/userTokenContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  let navigate = useNavigate();
  let { userLogin, setUserLogin } = useContext(UserTokenContext);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    // Ensure userLogin state syncs with token existence
    if (token) {
      setUserLogin(true);
    } else {
      setUserLogin(false);
    }
  }, [token, setUserLogin]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  function deleteToken() {
    localStorage.removeItem("userToken");
    setUserLogin(null);
    navigate("/login");
  }

  return (
    <nav className="bg-[#3c8dad] pl-4  lg:px-10 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center rounded-full">
          <Link to="/">
            <img
              src={mainLogo}
              alt="Main Logo"
              className="w-36 rounded-md"
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-2 text-white">
          {/* Show login/register if NOT authenticated */}
          {!userLogin ? (
            <div className="flex justify-center items-center gap-2 text-lg text-black">
              <NavLink to="/login">تسجيل الدخول</NavLink>
              <NavLink to="/register">انشاء حساب</NavLink>
            </div>
          ) : (
            // Show user icon and logout if authenticated
            <div className="flex items-center gap-4">
              <Link to="/userdata" className="text-white hover:text-blue-500">
                <FaRegUser size={20} />
              </Link>
              <div
                onClick={deleteToken}
                className="flex items-center cursor-pointer text-white hover:text-blue-500"
              >
                <span>تسجيل الخروج</span>
                <FaSignInAlt className="ml-2" />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden">
          <button className="text-xl" onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 py-4">
          <div className="px-4 space-y-4">
            {/* Show user icon and logout if authenticated */}
            {userLogin ? (
              <>
                <div className="flex cursor-pointer rounded-md bg-slate-200 justify-center text-center hover:text-sky-600 py-2">
                  <Link className="px-5" to="/userdata">
                    <FaRegUser />
                  </Link>
                </div>
                <div
                  onClick={deleteToken}
                  className="flex cursor-pointer rounded-md bg-slate-200 justify-center text-center hover:text-sky-600 py-2"
                >
                  <span>تسجيل الخروج</span>
                  <FaSignInAlt className="ml-2" />
                </div>
              </>
            ) : (
              // Show login/register if NOT authenticated
              <>
                <NavLink
                  onClick={toggleMenu}
                  to="/login"
                  className="rounded-md bg-slate-200 block text-center py-2 hover:text-sky-600"
                >
                  تسجيل الدخول
                </NavLink>
                <NavLink
                  onClick={toggleMenu}
                  to="/register"
                  className="rounded-md bg-slate-200 block text-center py-2 hover:text-sky-600"
                >
                  انشاء حساب
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
