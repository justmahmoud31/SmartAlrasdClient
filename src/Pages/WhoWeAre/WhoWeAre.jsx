/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useState, useEffect } from "react";

function WhoWeAre() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/article/one/2`)
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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">من نحن </h2>
      {loading ? (
        <p className="text-gray-500">Loading content...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-gray-800 leading-relaxed">{content}</p>
      )}
    </div>
  );
}

export default WhoWeAre;
