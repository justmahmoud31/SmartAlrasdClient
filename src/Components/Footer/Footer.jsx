/* eslint-disable no-unused-vars */
import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <>
      <div className="  w-full bg-[#3c8dad] p-4 text-slate-200">
        <h1 className=" font-bold text-center text-2xl">نظام الرصد الذكي</h1>
        <div>
          <ul className=" lg:flex justify-evenly items-center lg:my-6">
            {/* <li className="pt-1 ">
              <Link to=""> الشروط والاحكام</Link>
            </li> */}
            <li className="pt-1 ">
              <Link to="/whoweare">من نحن</Link>
            </li>
            <li className="pt-1 ">
              <Link to="/policy"> سياسة الخصوصية</Link>
            </li>
            {/* <li className="pt-1">
              <Link to=""> اتصل بنا</Link>
            </li> */}
          </ul>
        </div>
        <div>
          <div className="flex justify-center items-center">
            <div className="pl-3 text-lg  cursor-pointer ">
              <a href="https://www.facebook.com/share/15AUu1FyLG/" target="_blank"><FaFacebook /></a>
            </div>
            <div className="pl-3 text-lg  cursor-pointer ">
              <a href="https://www.instagram.com/_.we_k?igsh=MWZ2aTk3eTh0MXgzMw==" target="_blank"><FaInstagram /></a>
            </div>
            <div className="pl-3 text-lg  cursor-pointer ">
              <a href="https://www.tiktok.com/@.smart.alrasd?_t=ZS-8uAGQCWqa0N&_r=1" target="_blank"><AiFillTikTok /></a>
            </div>
            <div className="pl-3 text-lg  cursor-pointer ">
              <a href="https://wa.me/9647778684131" target="_blank"><FaWhatsapp /></a>
            </div>
          </div>
          <p className="text-center pt-1">جميع الحقوق محفوظة 2025©</p>
        </div>
      </div>
    </>
  );
}
