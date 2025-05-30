/* eslint-disable no-unused-vars */
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaHome, FaPhone, FaUserSecret } from "react-icons/fa";
import { IoIosPhonePortrait } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import { RiImageEditLine } from "react-icons/ri";
import privatenumber from '../../assets/resume.png';

const ScanQRCode = () => {
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState([]);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Fetch labels once
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/label`)
      .then((res) => setLabels(res.data.labels))
      .catch((err) => console.error("Error fetching labels", err));
  }, []);

  // If token is in URL, fetch user directly
  useEffect(() => {
    const fetchUserByToken = async () => {
      if (token) {
        setLoading(true);
        setError("");
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/users/get-user/${token}`
          );
          setScannedData(res.data.user);
        } catch (err) {
          setError("رمز QR غير صالح أو انتهت صلاحيته");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserByToken();
  }, [token]);

  // QR Code scanner (only if no token in URL)
  useEffect(() => {
    if (token) return; // Skip scanner if token exists in URL

    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: 250,
      fps: 10,
    });

 scanner.render(
  async (decodedText) => {
    scanner.clear();
    setLoading(true);
    setError("");

    try {
      // Extract the token from the scanned URL
      const url = new URL(decodedText);
      const tokenFromQR = url.searchParams.get("token");

      if (!tokenFromQR) {
        throw new Error("Invalid QR code format");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/users/get-user/${tokenFromQR}`
      );

      setScannedData(response.data.user);
    } catch (err) {
      setError("رمز QR غير صالح أو انتهت صلاحيته");
    } finally {
      setLoading(false);
    }
  },
  () => setError("")
);


    return () => scanner.clear();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">مسح رمز QR</h2>

        {!token && !scannedData && <div id="reader" className="mb-4"></div>}
        {loading && <p className="text-blue-600">جاري التحميل...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {scannedData && (
          <div className="mt-6 p-4 bg-sky-500 border text-white border-gray-200 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <img
                src={`${import.meta.env.VITE_BASE_URL}${scannedData.profilepicture}`}
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-blue-500"
              />
              <div className="text-right flex-grow">
                <h2 className="text-lg font-semibold text-white">
                  {scannedData.fullname}
                </h2>
                {scannedData.status === labels[3]?.label ? (
                  <p className="text-red-500 text-sm font-bold">
                    {scannedData.status}
                  </p>
                ) : (
                  <p className="text-green-500 text-sm font-bold">
                    {scannedData.status}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-4 text-right">
              <p className="flex items-center">
                <MdDateRange className="ml-2" />
                <span className="font-semibold mr-1">تاريخ الميلاد:</span>
                {new Date(scannedData.birthdate).toLocaleDateString("ar-EG")}
              </p>
              <p className="flex items-center">
                <FaHome className="ml-2" />
                <span className="font-semibold mr-1">محل الميلاد:</span>
                {scannedData.livesin}
              </p>
              <p className="flex items-center">
                <IoIosPhonePortrait className="ml-2" />
                <span className="font-semibold mr-1">
                  {labels[0]?.label || "المسمى الوظيفي"}:
                </span>
                {scannedData.jobtitle}
              </p>
              <p className="flex items-center">
                <RiImageEditLine className="ml-2" />
                <span className="font-semibold mr-1">
                  {labels[1]?.label || "الطول"}:
                </span>
                {scannedData.height}
              </p>
              <div>
                <p className=" font-bold text-xl">بيانات الاتصال :</p>
              </div>
              <p className="flex items-center">
                <FaPhone className="ml-2" />
                <span className="font-semibold mr-1">رقم الهاتف:</span>
                {scannedData.phonenumber}
              </p>
              <p className="flex items-center">
                <FaPhone className="ml-2" />
                <span className="font-semibold mr-1">
                  {scannedData.fathernumber || "لم يتم اضافه رقم"}
                </span>
              </p>
              <p className="flex items-center">
                <FaPhone className="ml-2" />
                <span className="font-semibold mr-1">
                  {scannedData.brothernumber || "لم يتم اضافه رقم"}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanQRCode;
