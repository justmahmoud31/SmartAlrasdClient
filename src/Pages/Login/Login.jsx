import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

function Login() {
  let navigate = useNavigate();
  const [isLoding, setisLoding] = useState(false);
  const [apiErr, setapiErr] = useState(null);
  const [userNotVerified, setNotVerifiedUser] = useState(false);
  const [requestId, setrequestId] = useState("");
  let validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  function handleLogin(values) {
    setisLoding(true);
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/api/users/login`, values)
      .then((res) => {
        if (res.data.message === "Login successful") {
          localStorage.setItem("userToken", `${res.data.token}`);
          navigate("/userdata");
        }

        setisLoding(false);
      })
      .catch((err) => {
        if (err.response.data.message === "Your request is under review. Please wait 24-48 hours for approval.") {
          localStorage.setItem("request", err.response.data.id)
          setNotVerifiedUser(true);
          setisLoding(false);
        }
        setapiErr(err.response?.data?.message || "An error occurred");
        setisLoding(false);
      });
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <>
      <div className="md:p-20 py-14 px-8 my-10 rounded-3xl max-w-xl mx-auto main-color">
        <h2 className="text-3xl font-bold mb-6 flex justify-center">
          تسجيل الدخول
        </h2>

        {/* API Error */}
        {apiErr && (
          <div className={userNotVerified ? "hidden" : "p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"}>
            <span className="font-medium">{apiErr}</span>
          </div>
        )}

        {/* User Not Verified Message */}
        {userNotVerified && (
          <div className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50">
            <span className="font-medium">
              طلبك قيد المراجعة. يرجى الانتظار من 24 إلى 48 ساعة للموافقة.
            </span>
            <br />
            <Link
              to="/code"
              className="inline-block mt-2 bg-green-600 text-white rounded-md py-2 px-6"
            >
              تحقق بالكود
            </Link>
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          {/* Email */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              البريد الالكتروني
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            {formik.errors.email && formik.touched.email && (
              <div className="p-2 mt-1 text-sm text-red-800 bg-red-50 rounded-lg">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              الرمز
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            {formik.errors.password && formik.touched.password && (
              <div className="p-2 mt-1 text-sm text-red-800 bg-red-50 rounded-lg">
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="bg-white hover:bg-gray-300 focus:ring-4 font-medium rounded-lg text-sm w-auto px-5 py-3"
            >
              {isLoding ? (
                <i className="fa-solid fa-spinner fa-spin fa-lg"></i>
              ) : (
                "تسجيل الدخول"
              )}
            </button>
          </div>

          {/* Register Link */}
          <div className="flex justify-center text-white mt-2">
            <p className="text-sm md:text-base">
              ليس لديك حساب؟
              <Link
                to="/register"
                className="hover:text-slate-300 hover:underline font-semibold pr-1"
              >
                انشاء حساب
              </Link>
            </p>
          </div>
        </form>
      </div >
    </>
  );
}

export default Login;
