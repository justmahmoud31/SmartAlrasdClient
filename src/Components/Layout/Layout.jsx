/* eslint-disable no-unused-vars */
import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'

function Layout() {
  return <>
    <Navbar />
    <div className="container mx-auto my-10 pt-2 px-5">
    <Outlet />
    </div>
    <Footer />
  </>
}

export default Layout