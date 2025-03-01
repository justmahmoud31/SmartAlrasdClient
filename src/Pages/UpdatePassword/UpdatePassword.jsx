/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";

function UpdatePassword() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, seterr] = useState("")
  const [success, setsuccess] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    axios
      .post(`${import.meta.env.VITE_BASE_URL}/api/users/resetpassword`, {
        otp,
        newPassword,
      })
      .then(() => {
        setsuccess("تم تعيين كلمة المرور بنجاح");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      })
      .catch(() => {
        seterr(" خطاء في تعيين كلمة المرور");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        {err && <p className="text-red-500 mb-4">{err}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <h2 className="text-2xl font-semibold text-center mb-4">
          اعاده تعيين كلمة المرور
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 pb-2">
              {" "}
              ادخل رمز التحقق المرسل علي الايميل
            </label>
            <input
              type="text"
              value={otp}
              required
              onChange={(e) => setOtp(e.target.value)}
              placeholder="ادخل رمز التحقق   "
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 pb-2">
              {" "}
              ادخل كلمة المرور الجديدة{" "}
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="كلمة المرور الجديدة"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "..." : "تحديث كلمة المرور"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePassword;
