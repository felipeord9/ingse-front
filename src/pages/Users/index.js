import { useState, useEffect , useContext } from "react";
import * as GoIcons from "react-icons/go"
import TableUsers from "../../components/TableUsuarios"
import ModalUsers from "../../components/ModalUsers";
import { findUsers } from "../../services/userService"
import { Link, useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { RiLogoutBoxLine } from "react-icons/ri";
import { GiBlackBook } from "react-icons/gi";
import * as FaIcons from "react-icons/fa";
import Logo from '../../assest/Logo.png'
import AuthContext from "../../context/authContext";
import { TfiWrite } from "react-icons/tfi";
import { PiUsersThreeFill } from "react-icons/pi";
import TextField from '@mui/material/TextField';
import "./styles.css";

export default function Users() {
  const { isLogged, logout } = useUser();
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [suggestions, setSuggestions] = useState([])
  const [search, setSearch] = useState('')
  const [showModalUsers, setShowModalUsers] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showSideBar, setShowSidebar] = useState(false);
  const [ruta, setRuta] = useState('');

  useEffect(() => {
    getAllUsers();
    setRuta(window.location.pathname);
  }, []);

  const getAllUsers = () => {
    setLoading(true)
    findUsers()
      .then(({ data }) => {
        setUsers(data)
        setSuggestions(data)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
      });
  }

  const searchUsers = (e) => {
    const { value } = e.target
    if(value !== "") {
      const filteredUsers = users.filter((elem) => {
        if(
          elem.rowId.includes(value) ||
          elem.name.toLowerCase().includes(value.toLowerCase()) ||
          elem.role.toLowerCase().includes(value.toLowerCase())
        ) {
          return elem
        }
      })
      if(filteredUsers.length > 0) {
        setSuggestions(filteredUsers)
      } else {
        setSuggestions(users)
     }
    } else {
      setSuggestions(users)
    }
    setSearch(value)
  }

  return (
    <div>
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
              <h2 style={{color:'white'}} className='mt-1 text-head'> INGSE</h2>   
              
            </div>
            
            <span className="menu-bars m-0" style={{ cursor: "pointer" }}>
              <FaIcons.FaBars
                className="mt-2 pt-1"
                style={{color:'white', height:45, }}
                onClick={(e) => setShowSidebar(!showSideBar)}
              />
            </span>
            <nav
            className={showSideBar ? "nav-menu active" : "nav-menu"}
            style={{backgroundColor:'black'}}
            >
              <ul
                className="nav-menu-items"
                onClick={(e) => setShowSidebar(!showSideBar)}
              >
                {(user.role==='admin' || user.role==='superadmin') &&
                  <li className='nav-text fw-bold'>
                  <Link to='/registros' style={{backgroundColor:(ruta==='/registros') ? 'white' : 'black',color:(ruta==='/registros') ? 'black' : 'white'}} >
                    <GiBlackBook />
                    <span>Bitácora</span>
                  </Link>
                </li>
                }
                <li className='nav-text fw-bold'>
                <Link to='/formulario' style={{backgroundColor:(ruta==='/formulario') ? 'white' : 'black',color:(ruta==='/formulario') ? 'black' : 'white'}} >
                  <TfiWrite />
                    <span>Solicitud placa</span>
                  </Link>
                </li>
                {(user.role === 'admin' || user.role === 'superadmin') &&
                  <li className='nav-text fw-bold'>
                    <Link to='/usuarios' style={{backgroundColor:(ruta==='/usuarios') ? 'white' : 'black',color:(ruta==='/usuarios') ? 'black' : 'white'}} >
                      <PiUsersThreeFill  />
                      <span>Usuarios</span>
                    </Link>
                  </li>
                }
              </ul>
              
              <ul
                className="nav-menu-items"
                style={{listStyle:'none'}}
                /* onClick={(e) => setShowSidebar(!showSideBar)} */
              >
                <li className='nav-text-2 fw-bold'>
                  <Link onClick={(e) => logout()}>
                    <RiLogoutBoxLine style={{height:30}}/>
                    <span>Cerrar sesión</span>
                  </Link>
                </li>
                <li className="text-center text-secondary">
                  <span className="m-0">INGSE S.A.S</span>
                </li>
              </ul>
            </nav>
          </div>
      </div>
      <div className="d-flex flex-column container bg-light" style={{border:'5px solid #E5BE01', boxShadow:'0 0 0 5px black', height:'100vh'}}>
            <ModalUsers 
              user={selectedUser}
              setUser={setSelectedUser}
              showModal={showModalUsers} 
              setShowModal={setShowModalUsers} 
              reloadInfo={getAllUsers} 
            />
            <div className="d-flex flex-column gap-2 h-100 mt-5 pt-2">
              <div className="d-flex justify-content-end mt-2 gap-3">
                <TextField id="outlined-basic" 
                  className="d-flex w-100 mt-1 " size="small" 
                  label='Buscar por cédula ó nombre' variant='outlined'
                  type='search'
                  value={search}
                  onChange={searchUsers}
                ></TextField>
                <button
                  title="Nuevo usuario"
                  className="d-flex align-items-center text-nowrap text-light gap-1 pt-2 pb-2 mt-0 mb-0" 
                  style={{backgroundColor:'black'}}
                  onClick={(e) => setShowModalUsers(!showModalUsers)}>
                    Nuevo usuario
                    <GoIcons.GoPersonAdd style={{width: 15, height: 15}} />
                </button>
              </div>
              <TableUsers users={suggestions} setShowModal={setShowModalUsers} setSelectedUser={setSelectedUser} loading={loading}/>
            </div>
      </div>
    </div>
  )
} 