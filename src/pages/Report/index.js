import { useContext, useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid , ResponsiveContainer } from 'recharts';
import ModalMultiple from "../../components/ModalMultiple";
import useUser from "../../hooks/useUser";
import { findSolicitudes } from "../../services/solicitudService"
import { RiLogoutBoxLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { PiUsersThreeFill } from "react-icons/pi";
import { TfiWrite } from "react-icons/tfi";
import { RiCheckboxMultipleLine } from "react-icons/ri";
import { GiBlackBook } from "react-icons/gi";
import AuthContext from "../../context/authContext";
import Logo from '../../assest/Logo.png'
import * as FaIcons from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { FcDataBackup } from "react-icons/fc";
import ModalBackUpBD from "../../components/ModalBackUpBD";
import { fillByDate } from "../../services/reportServices";
import { FaListOl } from "react-icons/fa6";
import "./styles.css";
import Swal from "sweetalert2";

function Report() {
  const { isLogged, logout } = useUser();
  const { user } = useContext(AuthContext);
  const [showSideBar, setShowSidebar] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'violet'];
  const [loading, setLoading] = useState(false);
  const [initialDate, setInitialDate] = useState('');
  const [finalDate, setFinalDate] = useState('');
  const navigate = useNavigate();
  
  const [ruta, setRuta] = useState('');
  useEffect(() => {
    getAllRegistros();
    setRuta(window.location.pathname);
  }, []);

  const getAllRegistros = () => {
    setLoading(true)
    // Muestra la barra de carga
    /* let timerInterval;
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor, espera mientras se cargan las solicitudes...',
      timer: 10000,
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup().querySelector("b");
          timerInterval = setInterval(() => {}, 200);
      },
      willClose: () => {
          clearInterval(timerInterval);
      },
      onBeforeOpen: () => {
          Swal.showLoading();
      },
      showConfirmButton: false,
    }); */
    findSolicitudes()
      .then( async ({ data }) => {
        /* timerInterval = 0; */
        let car = 0;
        let mot = 0;
        let tra = 0;
        let cm = 0;
        await data.filter((item)=>{
            if(item.tipo==='AUTOMOVILES'){
              car = car + item.numPlacas
            }else if(item.tipo==='MOTOCICLETAS'){
                mot = mot + item.numPlacas
            }else if(item.tipo==='MOTOCARRO'){
                cm = cm + item.numPlacas
            }else if(item.tipo==='TRACTOMULA'){
                tra = tra + item.numPlacas
          }
        })
        setInitialData([
            { name: 'Automoviles', value: car },
            { name: 'Motocicletas', value: mot },            
            { name: 'Motocarro', value: cm },
            { name: 'Tractomula', value: tra },
        ]);
        setRegistros(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false)
      });
  }

  const [showModalMultiple, setShowModalMultiple] = useState(false);
  const [modalBackUp, setModalBackUp] = useState(false);

  const handleClickImg = (e) => {
    if(user.role==='admin'){
      return navigate('/registros')
    }else{
      return navigate('/formulario')
    }
  }

  /* const handlefillDate = (e) => {
    e.preventDefault();
    if(initialDate !== '' || initialDate !== null || finalDate !== '' || finalDate !== null ){
      const body = {
        initialDate: new Date(initialDate).toISOString(),
        finalDate: new Date(finalDate).toISOString(),
      }
      fillByDate(body)
      .then(async({data})=>{
        let car = 0;
        let mot = 0;
        let tax = 0;
        let bus = 0;
        let cm = 0;
        await data.filter((item)=>{
            if(item.tipo==='AUTOMOVILES PERSONALES'){
                car++
            }else if(item.tipo==='MOTOCICLETAS'){
                mot++
            }else if(item.tipo==='TAXIS Y VEHICULOS DE CARGA'){
                tax++
            }else if(item.tipo==='BUSES Y MICROBUSES'){
                bus++
            }else if(item.tipo==='MOTOCARRO'){
              cm++
            }
        })
        setInitialData([
            { name: 'Automoviles', value: car },
            { name: 'Motocicletas', value: mot },
            { name: 'Taxis y vehículos de carga', value: tax },
            { name: 'Buses y microbuses', value: bus },
            { name: 'Motocarro', value: cm },
        ]);
      })
      .catch(()=>{
        console.log('error')
      })
    }
  }  */

  const duoSearch = (e) =>{
    e.preventDefault();
    if(initialDate !== '' && finalDate !== ''){
      const inicialDate = new Date(initialDate?.split('-').join('/')).toLocaleDateString();
      const finalDat = new Date(finalDate?.split('-').join('/')).toLocaleDateString();
      const filtered = registros.filter((elem) => {
        const splitDate = new Date(elem.createdAt).toLocaleDateString();
        if (splitDate >= inicialDate && splitDate <= finalDat) {
          return elem;
        }
        return 0;
      });
      if(filtered.length > 0) {  
        setSuggestions(filtered)
        let car = 0;
        let mot = 0;
        let tra = 0;
        let cm = 0;
        filtered.filter((item)=>{
          if(item.tipo==='AUTOMOVILES'){
            car = car + item.numPlacas
          }else if(item.tipo==='MOTOCICLETAS'){
              mot = mot + item.numPlacas
          }else if(item.tipo==='MOTOCARRO'){
              cm = cm + item.numPlacas
          }else if(item.tipo==='TRACTOMULA'){
              tra = tra + item.numPlacas
          }
        })
        setInitialData([
          { name: 'Automoviles', value: car },
          { name: 'Motocicletas', value: mot },            
          { name: 'Motocarro', value: cm },
          { name: 'Tractomula', value: tra },
        ]);
      } else {
        setSuggestions([])
        setInitialData([
          { name: 'Automoviles', value: 0 },
          { name: 'Motocicletas', value: 0 },
          { name: 'Tractomula', value: 0 },
          { name: 'Motocarro', value: 0 },
      ]);
      }
    }else if((finalDate !== '' && initialDate === '')||(finalDate === '' && initialDate !== '')){
      return 0;
    }
  }

  const clearFillDate = (e) => {
    e.preventDefault();
    setInitialDate('');
    setFinalDate('');
    setSuggestions([]);
    getAllRegistros();
  }

  return (
    <div className="div-principal">
      {/* Navbar */}
      <div 
        className="position-fixed shadow w-100" style={{ fontSize: 20, left: 0, height: "60px", zIndex: 2, userSelect:'none' , backgroundColor:'black'}}
      >
        <ModalMultiple
          /* reloadInfo={window.location.reload()} */
          showModal={showModalMultiple}
          setShowModal={setShowModalMultiple}
        />
        <ModalBackUpBD
          /* reloadInfo={window.location.reload()} */
          showModal={modalBackUp}
          setShowModal={setModalBackUp}
        />
        <div className="d-flex flex-row justify-content-between w-100 h-100 px-4 shadow">
            <div
              id="logo-header"
              className="d-flex flex-row align-items-center gap-2"
              onClick={(e)=>handleClickImg(e)}
              style={{cursor:'pointer'}}
            >
                <img
                src={Logo}
                
                unselectable="false"
                aria-invalid
                onClick={(e)=>handleClickImg(e)}
                alt=""
                style={{ height:45, width:50 , userSelect:'none', cursor:'pointer'}}
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
                </li>}
                <li className='nav-text fw-bold'>
                  <Link to='/formulario' style={{backgroundColor:(ruta==='/formulario') ? 'white' : 'black',color:(ruta==='/formulario') ? 'black' : 'white'}} >
                    <TfiWrite />
                    <span>Solicitud placa</span>
                  </Link>
                </li>
                <li className='nav-text fw-bold'>
                  <Link onClick={(e)=>setShowModalMultiple(!showModalMultiple)} style={{backgroundColor:(ruta==='/multiple') ? 'white' : 'black',color:(ruta==='/multiple') ? 'black' : 'white'}} >
                    <RiCheckboxMultipleLine  />
                    <span>Solicitud múltiple</span>
                  </Link>
                </li>
                <li className='nav-text fw-bold'>
                  <Link to='/placas/diferentes' style={{backgroundColor:(ruta==='/placas/diferentes') ? 'white' : 'black',color:(ruta==='/placas/diferentes') ? 'black' : 'white'}} >
                    <FaListOl />
                    <span>MultiSolicitud con diferente placa</span>
                  </Link>
                </li>
                {(user.role === 'admin' || user.role === 'superadmin') &&
                <div>
                  <li className='nav-text fw-bold'>
                      <Link to='/informe' style={{backgroundColor:(ruta==='/informe') ? 'white' : 'black',color:(ruta==='/informe') ? 'black' : 'white'}} >
                        <TbReportSearch  />
                        <span>Informe de ventas</span>
                      </Link>
                  </li>
                  <li className='nav-text fw-bold'>
                      <Link onClick={(e)=>setModalBackUp(!modalBackUp)}  >
                        <FcDataBackup  />
                        <span>BackUp BD</span>
                      </Link>
                  </li>
                  <li className='nav-text fw-bold'>
                    <Link to='/usuarios' style={{backgroundColor:(ruta==='/usuarios') ? 'white' : 'black',color:(ruta==='/usuarios') ? 'black' : 'white'}} >
                      <PiUsersThreeFill  />
                      <span>Usuarios</span>
                    </Link>
                  </li>
                </div>
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
      <div className="container d-flex align-items-center py-3 justify-content-center w-100 bg-light border border-2">
        <div className="d-flex flex-column p-div">
            <h1 className="fs-2 fw-bold d-flex w-100 justify-content-center mb-3">INFORME DE VENTAS</h1>
            <div className="div-diagram gap-4 w-100 justify-content-center ">
                <h4 className="d-flex justify-content-center">Filtro:</h4>
                <div>
                  <input 
                    id="initialDate"
                    type="date"
                    className="form-control form-control-sm"
                    value={initialDate}
                    onChange={(e)=>setInitialDate(e.target.value)}
                  />
                </div>
                <div>
                  <input 
                    type="date"
                    className="form-control form-control-sm"
                    value={finalDate}
                    disabled={initialDate === '' ? true : false}
                    onChange={(e)=>setFinalDate(e.target.value)}
                    min={initialDate}
                  />
                </div>
                <div className="bt-fill">
                  <button 
                    className="form-control form-control-sm"
                    style={{backgroundColor:'black', color:'white'}}
                    onClick={(e)=>duoSearch(e)}
                  >
                    Filtrar
                  </button>
                </div>
                <div className="bt-fill">
                  <button 
                    className="form-control form-control-sm"
                    style={{backgroundColor:'red', color:'white'}}
                    onClick={(e)=>clearFillDate(e)}
                  >
                    Borrar
                  </button>
                </div>
            </div>
            {/* Inputs para editar los valores */}
            <div className="d-flex div-diagram">
                {initialData.map((item, index) => (
                <div className="col-md-2 col-sm-4 mb-2" key={index}>
                    <label>{item.name}</label>
                    <input
                        type="number"
                        className="form-control"
                        value={item.value}
                        min="0"
                        disabled
                    />
                </div>
                ))}
            </div>
            <div className="div-diagram">
              {/* Diagrama de torta */}
              <div className="d-flex  mb-5" style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <PieChart >
                  <Pie
                      data={initialData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                      dataKey="value"
                  >
                      {initialData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Diagrama de barras */}
              <div className="d-flex " style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <BarChart data={initialData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value">
                      {initialData?.map((entry, index) => (
                          <Cell key={`bar-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                      </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Report;