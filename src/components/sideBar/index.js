import React, {useState, useEffect , useContext } from 'react';
import Usuario from "../../assest/usuario.png";
import Entrenador from "../../assest/entrenador.png";
import Roles from "../../assest/roles.png";
import UsuarioBlack from "../../assest/usuario-black.png";
import EntrenadorBlack from "../../assest/entrenador-black.png";
import RolesBlack from "../../assest/roles-black.png";
import Swal from 'sweetalert2';
import useUser from "../../hooks/useUser";
import { Link, useLocation , useNavigate } from 'react-router-dom';
import AuthContext from "../../context/authContext";
import './styles.css';

function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isLogged, logout } = useUser();
  const { user, setUser } = useContext(AuthContext);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const cerrarSesion = (e) =>{
    e.preventDefault();
    Swal.fire({
      icon:'question',
      title:'Cierre de Sesión',
      text:'¿Estás segur@ que deseas cerrar sesión?',
      showConfirmButton:true,
      confirmButtonColor:'green',
      confirmButtonText:'Confirmar',
      
      showCancelButton:true,
      cancelButtonColor:'red',
      cancelButtonText:'Cancelar'
    }).then(({isConfirmed})=>{
      if(isConfirmed){
        /* navigate('/') */
        logout(e)
      }
    })
  }

  const [button1Color, setButton1Color] = useState(''); // Estado del color del botón 1
  const [button2Color, setButton2Color] = useState(''); // Estado del color del botón 2
  const [button3Color, setButton3Color] = useState('')

  const location = useLocation();
  const precisa = location.pathname;

  const handleOptionChange = (event) => {
    // Según la opción seleccionada, actualiza el color de cada botón
    switch (precisa) {
      case '/clientes':
        setButton1Color('white');
        setButton2Color('transparent');
        setButton3Color('transparent');
        break;
      case '/entrenadores':
        setButton1Color('transparent');
        setButton2Color('white');
        setButton3Color('transparent');
        break;
      case '/roles':
        setButton1Color('transparent');
        setButton2Color('transparent');
        setButton3Color('white');
        break;
      default:
        setButton1Color('transparent');
        setButton2Color('transparent');
        setButton3Color('transparent');
    }
  };

  const [ruta, setRuta] = useState('');

  useEffect(() => {
    // Obtiene la ruta actual
    setRuta(window.location.pathname);
  }, []);

  return (
    <>
      {isLogged && (
        <div className={`sidebar ${isMenuOpen ? 'compressed' : ''}`}>
          <span className="menu-bars m-0 menu-toggle p-0" style={{ cursor: "pointer"}}>
              <button className="toggle-btn fw-bold" style={{border:'5px solid transparent'}} onClick={toggleMenu}>
                ☰
              </button>
          </span>
          <div className='div-in w-100 h-100'>
            <ul className='ul-inicio pt-5 w-100'>
                {( user.role==='recepcionista' || user.role==='coach') && (
                  <li className='w-100 me-1'>
                    <button 
                      onClick={(e)=>navigate('/clientes')} 
                      style={{backgroundColor:(ruta==='/clientes' || ruta==='/registrar/cliente' || ruta==='/editar/cliente') ? '#9A9A9A' : 'black',color:'white'}} 
                      className='d-flex flex-row w-100 li-inicio pe-1 '
                      >
                      <div className='w-35 d-flex' >
                        <img src={Usuario} style={{width:65}} className='me-3 p-0'/>
                      </div>
                      <div className='w-75 d-flex justify-content-start text-align-start pt-3'>
                        Clientes
                      </div>
                    </button>
                  </li>
                )}
                {user.role==='admin' && (
                  <div className='w-100'>
                    <li className='w-100 pe-1 pb-1'>
                    <button 
                      onClick={(e)=>navigate('/clientes')} 
                      style={{backgroundColor:ruta==='/clientes' || ruta==='/registrar/cliente' || ruta==='/editar/cliente' ? '#9A9A9A' : 'black',color:'white'}} 
                      className='d-flex flex-row w-100 li-inicio me-1'
                      >
                      <div className='w-35 d-flex' >
                        <img src={Usuario} style={{width:65}} className='me-3 p-0'/>
                      </div>
                      <div className='w-75 d-flex justify-content-start text-align-start pt-3'>
                        Clientes
                      </div>
                    </button>
                    </li>
                    <li className='w-100 pe-1 pb-1'>
                      <button 
                        onClick={(e)=>navigate('/empleados')} 
                        style={{backgroundColor:ruta==='/empleados' || ruta==='/registrar/empleado' || ruta==='/editar/empleado' ? '#9A9A9A' : 'black',color:'white'}} 
                        className='d-flex flex-row w-100 li-inicio' 
                      >
                        <div className='w-35 d-flex' >
                          <img src={Entrenador} style={{width:65}} className='me-3 p-0'/>
                        </div>
                        <div className='w-85 d-flex justify-content-start text-align-start pt-3'>
                          Empleados
                        </div>
                      </button>
                    </li>
                    <li className='d-flex w-100 pe-1'>
                      <button 
                        style={{backgroundColor:ruta==='/usuarios/roles' ? '#9A9A9A' : 'black',color:'white'}} 
                        className='d-flex flex-row w-100 li-inicio' 
                        onClick={(e)=>navigate('/usuarios/roles')}
                      >
                        <div className='w-35 d-flex' >
                          <img src={Roles} style={{width:65}} className='me-3 p-0'/>
                        </div>
                        <div className='w-85 d-flex justify-content-start text-align-start pt-3'>
                          Roles
                        </div>
                      </button>
                    </li>
                  </div>
                )}
            </ul>
            {/* <lu> */}
              <li style={{ listStyleType: 'none'}}>
                <button onClick={(e)=>cerrarSesion(e)} className='w-100 fw-bold' style={{fontSize:20,backgroundColor:'#EED112',color:'black', height:60}}><strong>Cerrar Sesión</strong></button>
              </li>
            {/* </lu> */}
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
