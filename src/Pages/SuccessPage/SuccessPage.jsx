/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainSlider from "../../Components/MainSlider/MainSlider";
import axios from "axios";

function SuccessPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/article/one/3`)
      .then((res) => {
        setContent(res.data.content.text);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load content.");
        setLoading(false);
      });
  }, []);
  return (
    <>
      <h1 className="text-center font-bold text-3xl">تم بنجاح!</h1>
      <div className="text-center mt-14">
        {loading ? (
          <p className="text-gray-500">Loading content...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-gray-800 leading-relaxed">{content}</p>
        )}
      </div>
      <div className="flex justify-center my-10 ">
        <Link
          to="/code"
          className="bg-green-500 text-white font-bold py-2 px-4 rounded"
        >
          تفعيل النظام  
        </Link>
      </div>{" "}
      <MainSlider />
    </>
  );
}

export default SuccessPage;
