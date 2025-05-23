import { useEffect, useState, useContext, useRef } from "react";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { GiBlackBook } from "react-icons/gi";
import useUser from "../../hooks/useUser";
import { RiLogoutBoxLine } from "react-icons/ri";
import Logo from '../../assest/Logo.png'
import * as FaIcons from "react-icons/fa";
import { TfiWrite } from "react-icons/tfi";
import AuthContext from "../../context/authContext";
import { PiUsersThreeFill } from "react-icons/pi";
import { GiSandsOfTime } from "react-icons/gi";
import { RiCheckboxMultipleLine } from "react-icons/ri";
import ModalMultiple from "../../components/ModalMultiple";
import { createSolicitud, updateSolicitud } from "../../services/solicitudService";
import { TbReportSearch } from "react-icons/tb";
import { findSolicitudes } from "../../services/solicitudService";
import { FcDataBackup } from "react-icons/fc";
import { createWithDiffPlaca } from "../../services/solicitudService";
import ModalBackUpBD from "../../components/ModalBackUpBD";
import AddPlacas from "../../components/AddPlaca";
import { FaListOl } from "react-icons/fa6";
import "./styles.css";

export default function FormPlacasDiferentes() {
  const { isLogged, logout } = useUser();
  const [showSideBar, setShowSidebar] = useState(false);
  const [ruta, setRuta] = useState('');
  const { user } = useContext(AuthContext);
  const [showModalMultiple, setShowModalMultiple] = useState(false);
  const [clientes, setClientes] = useState();
  const [modalBackUp, setModalBackUp] = useState(false);
  const navigate = useNavigate()
  const [search, setSearch] = useState({
    cedulaPropietario:'',
    primerApellidoPropietario:'',
    segundoApellidoPropietario:'',
    primerNombrePropietario:'',
    segundoNombrePropietario:'',
    direccionPropietario:'',
    municipioPropietario:'',
    celularPropietario:'',
    correoPropietario:'',
    licenciaTransito:'',
    placa:'',
    vin:'',
    chasis:'',
    ciudadPlaca:'',
    marca:'',
    tipo:'',
    servicio:'',
    cedulaPersonAuth:'',
    primerApellidoPersonAuth:'',
    segundoApellidoPersonAuth:'',
    primerNombrePersonAuth:'',
    segundoNombrePersonAuth:'',
    direccionPersonAuth:'',
    municipioPersonAuth:'',
    celularPersonAuth:'',
    correoPersonAuth:'',
    numeroFactura: null,
    concepto:'',
    numPlacas:'',
    observations:'',
  });

  const [placasAgr, setPlacasAgr] = useState({
    agregados: [],
  });

  /* logica para obtener los datos y poder compararlos con los ingresados */
  useEffect(() => {
    getAllRegistros();
  }, []);

  const getAllRegistros = () => {
    setLoading(true)
    findSolicitudes()
      .then(({ data }) => {
        setClientes(data)
        setLoading(false)
      })
      .catch((error) => {
        console.log('error')
        setLoading(false)
      });
  }

  const [loading, setLoading] = useState(false);
  const limitDeliveryDateField = new Date()
  limitDeliveryDateField.setHours(2)

  useEffect(() => {
    setRuta(window.location.pathname);

  }, []);

  const handlerChangeSearch = (e) => {
    const { id, value } = e.target;
    console.log(value);
    setSearch({
      ...search,
      [id]: value,
    });
  };

  const refreshForm = () => {
    Swal.fire({
      title: "¿Está seguro?",
      text: "Se descartará todo el proceso que lleva",
      icon: "warning",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#dc3545",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    }).then(({ isConfirmed }) => {
      if (isConfirmed){
        handleClear()
        navigate('/registros')
      }
    });
  };

  const handleSubmit = (e) =>{
    e.preventDefault();
    if (placasAgr.agregados.length <= 0) {
      Swal.fire({
        title: "¡Atención!",
        text: "No hay solicitudes en la lista, agregue al menos uno",
        icon: "warning",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#198754",
        timer: 2500,
      });
    }else{
      const body = {
        placas: placasAgr,
        createdAt: new Date(),
        userId: user.id,
      }
      createWithDiffPlaca(body)
      .then(()=>{
        handleClear()
        Swal.fire({
          title:'¡FELICIDADES!',
          text:'Se han registrado las solicitudes de forma exitosa',
          showConfirmButton:true,
          showCancelButton:false,
          confirmButtonColor:'green'
        })
      })
      .catch((error)=>{
        setLoading(false)
        Swal.fire({
          title:`¡ERROR!`, 
          text:'Ha ocurrido un error al momento de hacer el registro de las solicitudes. Vuelve a intentarlo mas tarde.',
          showConfirmButton:true,
          showCancelButton:false,
          confirmButtonColor:'red'
        })
      })
    }
  }

  const handleClear = () =>{
    setPlacasAgr({
      agregados:[]
    });
    setShowModalMultiple(false);
  }

  const handleCedula = (e) => {
    let { id, value } = e.target;

    // Si el primer carácter es 0, lo eliminamos
    if (value.length === 1 && value === "0") {
      value = "";
    }

    // También puedes evitar múltiples ceros al principio
    if (value.length > 1 && value.startsWith("0")) {
      value = value.replace(/^0+/, "");
    }

    setSearch({
      ...search,
      [id]: value
    });
  };

  //funcion para limitar el numero de caracteres de el campo celular 
  const handleMaxCel = (e) => {
    let { id, value } = e.target;
    // ✅ Permitir solo números
    value = value.replace(/[^0-9]/g, '');
    if (/^\d{0,12}$/.test(value)) {
        /* setPlazo(inputValue); */
        setSearch({
            ...search,
            [id]: value
        })
    }
  };

  const handleClickImg = (e) => {
    if(user.role==='admin'){
      return navigate('/registros')
    }else{
      return navigate('/formulario')
    }
  }

  /* logica de convertir de new date a tipo date */
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  //funcion para devolver todas las fechas en las que aparece la cedula
  const devolverLista = (lista) =>{
    const filtrar = lista.map((item)=>{
      return new Date(item.createdAt).toLocaleDateString("es-CO")
    })
    const conjunto = new Set(filtrar)
    return Array.from(conjunto)
  }

  return (
    <div >
      {/* Navbar */}
      <div className="position-fixed shadow w-100" style={{ fontSize: 20, left: 0, height: "60px", zIndex: 2, userSelect:'none' , backgroundColor:'black'}}>
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
                        <FaListOl   />
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
      {/* formulario */}
      <div
        className="container d-flex flex-column w-100 py-3 bg-light border border-2"
        style={{ fontSize: 10.5 , border:'5px solid #E5BE01', boxShadow:'0 0 0 5px black' }}
      >
        <section className="d-flex flex-row justify-content-center align-items-center mb-2 mt-5 pt-2">
          <div className="d-flex flex-column align-items-center">
            <h1 className="fs-5 fw-bold ">ASUNTO: <label>DECLARACIÓN JURAMENTADA</label></h1>
            <h1 className="text-center fs-6 fw-bold">Documento Solicitud Copia Placa(s) Vehiculares</h1>
            <h1 className="text-center fs-6 fw-bold">Solicitud multiple con diferentes placas</h1>
            <h1 className="text-center fs-6 fw-bold">INGSE S.A.S</h1>
          </div>
        </section>
        <form className="" >
          <AddPlacas
            placasAgr={placasAgr}
            setPlacasAgr={setPlacasAgr}
          />
          <Modal show={loading} centered>
            <Modal.Body>
              <div className="d-flex align-items-center">
                <strong className="text-danger" role="status">
                  Cargando...
                </strong>
                <div
                  className="spinner-grow text-danger ms-auto"
                  role="status"
                ></div>
              </div>
            </Modal.Body>
          </Modal>
          <div className="d-flex flex-row gap-3 mb-3 w-100 justify-content-end align-items-end pt-3">
            <button
              /* type="submit" */
              className="btn btn-sm btn-success fw-bold w-100"
              onClick={(e)=>handleSubmit(e)}
            >
              {loading ? <strong>REGISTRANDO...<GiSandsOfTime /></strong>: 'REGISTRAR'}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-danger fw-bold w-100"
              onClick={refreshForm}
            >
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
