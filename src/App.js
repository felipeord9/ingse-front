import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { AuthContextProvider } from './context/authContext';
import Login from '../src/pages/Login/login'
import RecoveryPassword from './pages/RecoveryPassword';
import SendRecovery from './pages/SendRecoveryPassword'
import ChangePassword from './pages/ChangePassword'
import React, { Component } from "react";
import PrivateRoute from '../src/components/PrivateRoute';
import Registros from './pages/registros';
import Users from './pages/Users'
import Page404 from "./pages/Page404"
import Form from './pages/Form';
import EditarRegistro from './pages/EditarRegistro';
import Inactivity from "./components/Inactivity"
import { CellarContextProvider } from "./context/cellarContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

function App() {
  const limitCounter = 150;
  const limitInactive = 15;
  const [counter, setCounter] = useState(0);
  const [inactiveCounter, setInactiveCounter] = useState(limitInactive);

  useEffect(() => {
    const timer = setInterval(() => {
      if (window.location.pathname !== "/login" ) {
        setCounter((prevCount) => prevCount + 1);
      }
      if (counter >= limitCounter) {
        setInactiveCounter((prev) => prev - 1);
      }
      if (inactiveCounter <= 1) {
        window.localStorage.removeItem("token")
        window.localStorage.removeItem("user")
        window.location.replace("/login");
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [counter, inactiveCounter]);

  const handlerEvent = (e) => {
    if (inactiveCounter >= limitInactive) {
      setCounter(0);
    }
  };

  //const rutaServidor = "/"; //local
  const rutaServidor = "/ingse-placas"; //produccion

  return(
    <AuthContextProvider>
      <CellarContextProvider>
        {counter >= limitCounter && (
          <Inactivity
            inactiveCounter={inactiveCounter}
            setCounter={setCounter}
            setInactiveCounter={setInactiveCounter}
            limitInactive={limitInactive}
          />
        )}
        <Router>
          <div 
            id='wrapper' 
            className="vh-100 overflow-auto p-0"
            onMouseMove={handlerEvent}
            onClick={handlerEvent}
            onKeyDown={handlerEvent}
            onTouchMove={handlerEvent}
          >
            <Routes>
              {/* Paginas de login y reestablacion de contraseña */}
              <Route exact path="/" element={<Login/>}/* element={<Login/>} *//>
              <Route exact path="/login" element={<Login/>}/* element={<Login/>} *//>
              <Route exact path="/send/recovery" element={<SendRecovery/>}/* element={<SendRecovery/>} *//>
              <Route exact path="/recuperacion/contrasena//:token" element={<RecoveryPassword/>}/* element={<RecoveryPassword/>} */ />
              <Route path='/change/password' element={<PrivateRoute component={ChangePassword}/>}/>

              {/* Paginas privadas */}
              <Route path='/usuarios' element={<PrivateRoute component={Users} />} />
              <Route path='/registros' element={<PrivateRoute component={Registros}/>} />
              <Route path='/formulario' element={<PrivateRoute component={Form} />} />
              <Route path='/editar/registro/:id' element={<PrivateRoute component={EditarRegistro} />} />

              {/* Page not found */}
              <Route path='*' element={<Page404 />} />

            </Routes>
          </div>
        </Router>
      </CellarContextProvider>
  </AuthContextProvider>
);
}

export default App;
