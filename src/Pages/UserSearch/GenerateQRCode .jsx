import React, { useState, useEffect } from "react";
import axios from "axios";

const GenerateQRCode = () => {
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const token = localStorage.getItem("userToken"); // Get auth token from storage
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/users/generate-qr`,
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob", // Get image data
          }
        );

        const qrBlob = new Blob([response.data], { type: "image/png" });
        setQrUrl(URL.createObjectURL(qrBlob));
      } catch (error) {
        console.error("Error generating QR code", error);
      }
    };

    fetchQRCode();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center my-16">
      <h2 className="text-xl my-4 font-semibold">قم بمسح الكود للوصول الى البيانات </h2>
      {qrUrl ? <img src={qrUrl} alt="User QR Code" /> : <p>Loading...</p>}
    </div>
  );
};

export default GenerateQRCode;
