/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Navigate } from 'react-router-dom'


function ProtectedRoute(props) {

  if(localStorage.getItem('userToken') !== null){ 
    return props.children
  }else{
    return <Navigate to="/login" />
  }

}

export default ProtectedRoute