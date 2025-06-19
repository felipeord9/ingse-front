import React, { useEffect, useState, useContext } from 'react';
import AuthContext from "../../context/authContext";
import useUser from '../../hooks/useUser';
import * as Bs from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { GiSandsOfTime } from "react-icons/gi";
import Logo from '../../assest/Logo.png'
import './login.css';

export default function Login() {
  const {login,isLoginLoading,hasLoginError,isLogged}=useUser()
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [cargando,setCargando] = useState(false);
  const [vacio,setVacio] = useState(false);
  const navigate =useNavigate()
  useEffect(()=>{
    if(isLogged && user.role==='admin')navigate('/registros');
    if(isLogged && user.role==='superadmin')navigate('/registros');
    if(isLogged && user.role==='usuario')navigate('/registros');
  },[isLogged,navigate]);

  const handleLogin=async(e)=>{
    e.preventDefault();
    setCargando(true)
    if(email!=='' && password !==''){
      setCargando(false)
      login({email,password})
    }else{
      setCargando(false)
      setVacio(true)
      setTimeout(() => setVacio(false), 3000)      
    }
  }

  const [shown,setShown]=useState("");
  const switchShown =()=>setShown(!shown);

  const BotonColorCambiante = ({ children }) => {
    const [hover, setHover] = useState(false);
    const handleMouseEnter = () => {
      setHover(true);
    };
    const handleMouseLeave = () => {
      setHover(false);
    };
    const buttonStyle = {
      cursor: 'pointer',
      backgroundColor:'black',
      color:'white',
      transform: hover ? 'scale(1.1)' : 'scale(1)',
      transition: 'all 0.3s ease',
    };
    
    return (
      <button
        className="fw-bold rounded rounded-3"
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        type='submit'
        onSubmit={handleLogin}
      >
        {children}
      </button>
    );
  };

  return(
    <div >
      <div className="position-fixed shadow w-100" style={{ fontSize: 20, left: 0, height: "60px", zIndex: 2, userSelect:'none' , backgroundColor:'black'}}>
        <div className="d-flex flex-row justify-content-between w-100 h-100 px-4 shadow">
            <div
              id="logo-header"
              className="d-flex flex-row align-items-center gap-2"
            >
              <img
                src={Logo}
                
                unselectable="false"
                aria-invalid
                
                alt=""
                style={{ height:45, width:50 , userSelect:'none'}}
              />
              <h2 style={{color:'white'}} className='mt-1'> INGSE</h2>   
              
            </div>
          </div>
      </div>
      <div className='container d-flex justify-content-center align-items-center ' style={{height:'100vh'}}>
        <div className='content text-align-center rounded-4 p-4 mt-3 ' style={{backgroundColor:'white', border:'5px solid #E5BE01', boxShadow:'0 0 0 5px black'}}> 
          <h1 className='fw-bold pb-1 w-100 d-flex justify-content-center text-align-center h1-login' style={{color:'black'}}><strong className=''>Inicio de sesión</strong></h1>
          <form onSubmit={handleLogin} className=''>
            <div className='input_group m-5 mt-4 mb-0 d-flex '>
              <input type='text' id='usuario' className='input_group_input w-100 ' required onChange={(e)=> setEmail(e.target.value)}/>
              <label for="usuario" className='input_group_label '>Username</label>
            </div>
            <div className='input_group m-5 mt-3 mb-3 d-flex flex-column'>
              <input type={shown ? 'text':'password'} onChange={(e)=>setPassword(e.target.value)} id='email' className='input_group_input' required/>
              <label for="email" className='input_group_label'>Password</label>
              <span className='position-absolute' onClick={switchShown} style={{ right: 10, cursor: "pointer",fontSize:25 }}>{shown ? <Bs.BsEye/>:<Bs.BsEyeSlash/>}</span>
            </div>
            <div className='align-content-center text-align-center align-items-center'>
              <center>
                {/* <button type="submit" style={{backgroundColor:'black',color:'white'}} ><strong>Entrar</strong></button> */}
                <BotonColorCambiante>{cargando ? <strong>Cargando... <GiSandsOfTime /></strong>:<strong>Ingresar</strong>}</BotonColorCambiante>
              </center>
            </div>
            <center>
            <label className='mt-1'><a href='/send/recovery' className='text-decoration-none' style={{fontSize:'medium'}}><strong>¿Olvidaste tu constraseña?</strong></a></label>
            </center>
          </form>
          {isLoginLoading && <div className='loading'>Cargando...</div>}
          {hasLoginError && <div className='text-danger text-center mt-2 fw-bold'>Credenciales Incorrectas</div>}
          {vacio && <div className='text-danger text-center mt-2 fw-bold'>Sin Credenciales</div>}
        </div>
      </div>
    </div>
    )
  }
