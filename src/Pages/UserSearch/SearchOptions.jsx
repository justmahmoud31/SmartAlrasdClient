import React from "react";
import { Link } from "react-router-dom";
import search from "../../assets/search.jpg";
function SearchOptions() {
  return (
    <div className="flex flex-col justify-center items-center gap-4 text-white">
      <img src={search} width={400} />
      <div className="flex justify-center items-center gap-4">
        <Link
          to={"/search"}
          className="flex bg-sky-600 px-3 py-2 rounded-lg lg:text-lg text-sm"
        >
          البحث عن طريق أدخال الرقم 
        </Link>
        <Link to={"/scanqr"} className="flex bg-sky-600 px-3 py-2 rounded-lg lg:text-lg text-sm">
          البحث عن طريق الباركود
        </Link>
      </div>
    </div>
  );
}

export default SearchOptions;
