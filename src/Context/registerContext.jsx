/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { createContext } from "react";

export let RegisterContext = createContext();


export default function RegisterContextProvider(props) {
  const [registerData, setRegisterData] = useState({});
  const [idCode, setidCode] = useState("");


  return (
    <RegisterContext.Provider value={{ registerData, setRegisterData , idCode, setidCode }}>
      {props.children}
    </RegisterContext.Provider>
  );
}
