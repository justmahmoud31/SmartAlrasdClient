/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { createContext } from "react";

export let UserTokenContext = createContext();


export default function UserTokenContextProvider(props) {
  const [userLogin, setUserLogin] = useState(localStorage.getItem("userToken"));


  return (
    <UserTokenContext.Provider value={{ userLogin, setUserLogin }}>
      {props.children}
    </UserTokenContext.Provider>
  );
}
