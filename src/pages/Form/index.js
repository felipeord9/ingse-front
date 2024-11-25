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
import Webcam from 'react-webcam';
import { RiCheckboxMultipleLine } from "react-icons/ri";
import ModalMultiple from "../../components/ModalMultiple";
import "./styles.css";

export default function Form() {
  const { isLogged, logout } = useUser();
  const [showSideBar, setShowSidebar] = useState(false);
  const [ruta, setRuta] = useState('');
  const { user } = useContext(AuthContext);
  const [showModalMultiple, setShowModalMultiple] = useState(false);
  const [agencia, setAgencia] = useState(null);
  const [sucursal, setSucursal] = useState(null);
  const [agencias, setAgencias] = useState([]);
  const [files, setFiles] = useState(null);
  const [productosAgr, setProductosAgr] = useState({
    agregados: [],
    total: "0",
  });
  const [search, setSearch] = useState({
    idCliente: "",
    descCliente: "",
    deliveryDate: "",
    observations: "",
    order: "",
  });

  //constante de las imagenes
  const [userPhoto, setUserPhoto] = useState(null);
  const [frontCp, setFrontCp] = useState(null);
  const [backCp, setBackCp] = useState(null);
  const [frontTp, setFrontTp] = useState(null);
  const [backTp, setBackTp] = useState(null);
  const [frontCauth, setFrontCauth] = useState(null);
  const [backCauth, setBackCauth] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const [nameField, setNameField] = useState(null);
  const webcamRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null); // Foto en previsualización
  const [photos, setPhotos] = useState({
    photoUser: null,
    frontCp: null,
    backCp: null,
    frontTp: null,
    backTp: null,
    frontCauth: null,
    backCauth: null,
  });
  // Abrir el modal para un campo específico
  const openModal = (field,nameField) => {
    setActiveField(field);
    setNameField(nameField);
    setShowModal(true);
    setPreviewPhoto(null); // Resetear previsualización
  };
  // Cerrar el modal
  const closeModal = () => {
    setShowModal(false);
    setNameField(null);
    setActiveField(null);
    setPreviewPhoto(null); // Resetear previsualización
  };
  // Capturar la foto y guardarla en el estado correspondiente
  const capturePhoto = () => {
    const photo = webcamRef.current.getScreenshot();
    setPreviewPhoto(photo); // Mostrar previsualización
  };
  //descartar foto en el modal
  const discardPhoto = () => {
    setPreviewPhoto(null); // Mostrar previsualización
    setNameField(null);
  };
  // Guardar la foto en el estado correspondiente
  const savePhoto = () => {
    setPhotos((prevPhotos) => ({
      ...prevPhotos,
      [activeField]: previewPhoto,
    }));
    closeModal();
  };
  // Subir una imagen desde el dispositivo
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewPhoto(event.target.result); // Mostrar previsualización
      };
      reader.readAsDataURL(file);
    }
  };

  const [loading, setLoading] = useState(false);
  const [invoiceType, setInvoiceType] = useState(false);
  const selectBranchRef = useRef();
  const limitDeliveryDateField = new Date()
  limitDeliveryDateField.setHours(2)

  useEffect(() => {
    setRuta(window.location.pathname);

  }, []);

  const findById = (id, array, setItem) => {
    const item = array.find((elem) => elem.nit === id);
    if (item) {
      setItem(item);
    } else {
      setItem(null);
      setSucursal(null);
      selectBranchRef.current.selectedIndex = 0;
    }
  };

  const handlerChangeSearch = (e) => {
    const { id, value } = e.target;
    console.log(value);
    setSearch({
      ...search,
      [id]: value,
    });
  };

  const idParser = (id) => {
    let numeroComoTexto = id.toString();
    while (numeroComoTexto.length < 8) {
      numeroComoTexto = "0" + numeroComoTexto;
    }
    return numeroComoTexto;
  };

  const getFiles = (e) => {
    const file = e.target.files[0];
    if (file) {
      const nameFile = file.name.split(".");
      const ext = nameFile[nameFile.length - 1];
      const newFile = new File([file], `Archivo-Adjunto.${ext}`, {
        type: file.type,
      });
      setFiles(newFile);
    }
  };

  const changeType = (e) => {
    setSearch({
      ...search,
      idCliente: "",
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
      if (isConfirmed) window.location.reload();
    });
  };

  const [typeClient, setTypeClient] = useState('propietario');
  const changeBar = (e) => {
    if(typeClient === 'propietario'){
      setTypeClient('autorizado')
    }else if(typeClient === 'autorizado'){
      setTypeClient('propietario')
    }
    setInvoiceType(!invoiceType);
  };

  return (
    <div >
      {/* Navbar */}
      <div className="position-fixed shadow w-100" style={{ fontSize: 20, left: 0, height: "60px", zIndex: 2, userSelect:'none' , backgroundColor:'black'}}>
        <ModalMultiple
          /* reloadInfo={window.location.reload()} */
          showModal={showModalMultiple}
          setShowModal={setShowModalMultiple}
        />
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
      {/* formulario */}
      <div
        className="container d-flex flex-column w-100 py-3 bg-light border border-2"
        style={{ fontSize: 10.5 , border:'5px solid #E5BE01', boxShadow:'0 0 0 5px black' }}
      >
        <section className="d-flex flex-row justify-content-center align-items-center mb-2 mt-5 pt-2">
          {/* <div className="d-flex flex-column align-items-center">
            <h1 className="fs-6 fw-bold ms-5">Foto</h1>
            <img 
              className="ms-5"
              style={{height:145, width:135}}
            />
          </div> */}
          <div className="d-flex flex-column align-items-center">
            <h1 className="fs-5 fw-bold ">ASUNTO: <label>DECLARACIÓN JURAMENTADA</label></h1>
            <h1 className="text-center fs-6 fw-bold">Documento Solicitud Copia Placa(s) Vehiculares</h1>
            <h1 className="fs-6 fw-bold">Fecha: <label>{JSON.stringify(new Date().getDate())}/{JSON.stringify(new Date().getMonth())}/{JSON.stringify(new Date().getFullYear())}</label></h1>
            {/* <h1 className="fs-6 fw-bold me-5">Hora: {JSON.stringify(new Date().getHours())}:{JSON.stringify(new Date().getMinutes())}:{JSON.stringify(new Date().getSeconds())}</h1> */}
            {/* Logica para saber si es el propietario o es persona autorizada */}
            <div className="d-flex flex-column align-items-center">
              <strong className="fw-bold me-3" style={{fontSize:13}}>Tipo de usuario</strong>
              <div className="d-flex flex-row align-items-center gap-2" style={{fontSize:13}}>
                <span className={!invoiceType ? "text-primary fw-bold" : 'fw-bold'} >Propietario</span>
                <button
                  className="position-relative d-flex align-items-center btn bg-body-secondary rounded-pill toggle-container p-0 m-0"
                  onClick={changeBar}
                >
                  <div
                    className={
                      !invoiceType
                        ? "d-flex align-items-center justify-content-center position-absolute bg-primary rounded-circle toggle"
                        : "d-flex align-items-center justify-content-center position-absolute bg-success rounded-circle toggle active"
                    }
                  ></div>
                </button>
                <span className={invoiceType ? "text-success fw-bold ms-0" : 'fw-bold ms-0'}>
                  Persona autorizada
                </span>
              </div>
            </div>
          </div>
          {/* <div className="d-flex flex-column align-items-center">
            <h1 className="fs-6 fw-bold me-5">Huella</h1>
            <img 
              className="me-5"
              style={{height:145, width:135}}
            />
          </div> */}
        </section>
        <form className="" >
          {/* informacion del propietario */}
          <div className="bg-light rounded shadow-sm p-3 mb-3">
            <div className="d-flex flex-column gap-1">
              <div>
                <h6 className="fw-bold">Información del propietario:</h6>
                <div className="row row-cols-sm-4">
                  <div className="d-flex flex-column align-items-start">
                    <label>NIT/Cédula:</label>
                    <input
                      id="idCliente"
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="*Campo obligatorio*"
                      onChange={(e) => {
                        const { value } = e.target;
                        handlerChangeSearch(e);
                      }}
                      min={0}
                      required
                    />
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label>Primer apellido:</label>
                    <input
                        id="idCliente"
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="*Campo obligatorio*"
                        onChange={(e) => {
                          const { value } = e.target;
                          handlerChangeSearch(e);
                        }}
                        min={0}
                        required
                      />
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label>Segundo apellido:</label>
                    <input
                        id="idCliente"
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="*Campo obligatorio*"
                        onChange={(e) => {
                          const { value } = e.target;
                          handlerChangeSearch(e);
                        }}
                        min={0}
                        required
                      />
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label>Primer nombre:</label>
                    <input
                        id="idCliente"
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="*Campo obligatorio*"
                        onChange={(e) => {
                          const { value } = e.target;
                          handlerChangeSearch(e);
                        }}
                        min={0}
                        required
                      />
                  </div>
                </div>
              </div>
              <div>
                <div className="row row-cols-sm-3">
                <div className="d-flex flex-column align-items-start">
                    <label>Segundo nombre:</label>
                    <input
                      id="idCliente"
                      type="text"
                      className="form-control form-control-sm"
                      onChange={(e) => {
                        const { value } = e.target;
                        handlerChangeSearch(e);
                      }}
                    />
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label>Dirección de residencia:</label>
                    <input
                      id="idCliente"
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="*Campo obligatorio*"
                      onChange={(e) => {
                        const { value } = e.target;
                        handlerChangeSearch(e);
                      }}
                      min={0}
                      required
                    />
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label>Municipio de residencia:</label>
                    <input
                        id="idCliente"
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="*Campo obligatorio*"
                        onChange={(e) => {
                          const { value } = e.target;
                          handlerChangeSearch(e);
                        }}
                        min={0}
                        required
                      />
                  </div>
                </div>
              </div>
              <div>
                <div className="row row-cols-sm-2">
                  <div className="d-flex flex-column align-items-start">
                    <label>No. Celular:</label>
                    <input
                      id="idCliente"
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="*Campo obligatorio*"
                      onChange={(e) => {
                        const { value } = e.target;
                        handlerChangeSearch(e);
                      }}
                    />
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label>Correo electrónico:</label>
                    <input
                      id="idCliente"
                      type="email"
                      className="form-control form-control-sm"
                      placeholder="*Campo obligatorio*"
                      onChange={(e) => {
                        const { value } = e.target;
                        handlerChangeSearch(e);
                      }}
                      min={0}
                      required
                    />
                  </div>
                </div>
              </div>
              <hr className="my-1" />

              {/* informacion de la tarjeta de propiedad */}
                <div className="d-flex flex-column gap-1 mt-1">
                  <div>
                    <h6 className="fw-bold">Información de la tarjeta de propiedad:</h6>
                    <div className="row row-cols-sm-4">
                      <div className="d-flex flex-column align-items-start">
                        <label>No. licencia de transito:</label>
                        <input
                          id="idCliente"
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="*Campo obligatorio*"
                          onChange={(e) => {
                            const { value } = e.target;
                            handlerChangeSearch(e);
                          }}
                          min={0}
                          required
                        />
                      </div>
                      <div className="d-flex flex-column align-items-start">
                        <label>Placa:</label>
                        <input
                            id="idCliente"
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="*Campo obligatorio*"
                            onChange={(e) => {
                              const { value } = e.target;
                              handlerChangeSearch(e);
                            }}
                            min={0}
                            required
                          />
                      </div>
                      <div className="d-flex flex-column align-items-start">
                        <label>Marca:</label>
                        <input
                          id="idCliente"
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="*Campo obligatorio*"
                          onChange={(e) => {
                            const { value } = e.target;
                            handlerChangeSearch(e);
                          }}
                          min={0}
                          required
                        />
                      </div>
                      <div className="d-flex flex-column align-items-start">
                        <label>Tipo:</label>
                        <input
                            id="idCliente"
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="*Campo obligatorio*"
                            onChange={(e) => {
                              const { value } = e.target;
                              handlerChangeSearch(e);
                            }}
                            min={0}
                            required
                          />
                      </div>
                    </div>
                  </div>
                  <hr className="my-1" />
                </div>

              {/* informacion de la persona autorizada */}
                { typeClient ==='autorizado' &&
                  <div className="d-flex flex-column gap-1 mt-1">
                  {/* primera linea */}
                <div>
                  <h6 className="fw-bold">Información de la persona autorizada:</h6>
                  <div className="row row-cols-sm-4">
                    <div className="d-flex flex-column align-items-start">
                      <label>NIT/Cédula:</label>
                      <input
                        id="idCliente"
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="*Campo obligatorio*"
                        onChange={(e) => {
                          const { value } = e.target;
                          handlerChangeSearch(e);
                        }}
                        min={0}
                        required
                      />
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <label>Primer apellido:</label>
                      <input
                          id="idCliente"
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="*Campo obligatorio*"
                          onChange={(e) => {
                            const { value } = e.target;
                            handlerChangeSearch(e);
                          }}
                          min={0}
                          required
                        />
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <label>Segundo apellido:</label>
                      <input
                          id="idCliente"
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="*Campo obligatorio*"
                          onChange={(e) => {
                            const { value } = e.target;
                            handlerChangeSearch(e);
                          }}
                          min={0}
                          required
                        />
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <label>Primer nombre:</label>
                      <input
                          id="idCliente"
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="*Campo obligatorio*"
                          onChange={(e) => {
                            const { value } = e.target;
                            handlerChangeSearch(e);
                          }}
                          min={0}
                          required
                        />
                    </div>
                  </div>
                </div>
                {/* segunda linea */}
                <div>
                  <div className="row row-cols-sm-3">
                  <div className="d-flex flex-column align-items-start">
                      <label>Segundo nombre:</label>
                      <input
                        id="idCliente"
                        type="text"
                        className="form-control form-control-sm"
                        onChange={(e) => {
                          const { value } = e.target;
                          handlerChangeSearch(e);
                        }}
                      />
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <label>Dirección de residencia:</label>
                      <input
                        id="idCliente"
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="*Campo obligatorio*"
                        onChange={(e) => {
                          const { value } = e.target;
                          handlerChangeSearch(e);
                        }}
                        min={0}
                        required
                      />
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <label>Municipio de residencia:</label>
                      <input
                          id="idCliente"
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="*Campo obligatorio*"
                          onChange={(e) => {
                            const { value } = e.target;
                            handlerChangeSearch(e);
                          }}
                          min={0}
                          required
                        />
                    </div>
                  </div>
                </div>
                {/* tercera linea */}
                <div>
                  <div className="row row-cols-sm-2">
                  <div className="d-flex flex-column align-items-start">
                      <label>No. Celular:</label>
                      <input
                        id="idCliente"
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="*Campo obligatorio*"
                        onChange={(e) => {
                          const { value } = e.target;
                          handlerChangeSearch(e);
                        }}
                      />
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <label>Correo electrónico:</label>
                      <input
                        id="idCliente"
                        type="email"
                        className="form-control form-control-sm"
                        placeholder="*Campo obligatorio*"
                        onChange={(e) => {
                          const { value } = e.target;
                          handlerChangeSearch(e);
                        }}
                        min={0}
                        required
                      />
                    </div>
                  </div>
                </div>
                  <hr className="my-1" />
                  </div>
                }
            </div>
          </div>
          {/* observaciones */}
          <div className="d-flex flex-column mb-3 ms-5 me-5">
            <h6 className="fw-bold">Archivos Adjuntos:</h6>
            {/* Foto de la cedula */}
            <div className="row row-cols-sm-2">
              <div className="d-flex flex-column align-items-start">
                <label style={{fontSize:12}}>Foto frontal de la cédula propietario:</label>
                <div
                  style={{
                    width: "100%",
                    height: 200,
                    border: "2px solid #ccc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    borderRadius:25
                  }}
                  onClick={() => openModal("frontCp","Cédula frontal propietario")}
                >
                  {photos.frontCp ? (
                    <img 
                      src={photos.frontCp} 
                      alt="frontCp" 
                      style={{ width: "100%", height: "100%"}} 
                    />
                  ):"Haz Click aquí para tomar la foto"}
                </div>
              </div>
              <div className="d-flex flex-column align-items-start">
                <label style={{fontSize:12}}>Foto trasera de la cédula propietario:</label>
                <div
                  style={{
                    width: "100%",
                    height: 200,
                    border: "2px solid #ccc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    borderRadius:25
                  }}
                  onClick={() => openModal("backCp","Cédula trasera propietario")}
                >
                  {photos.backCp ? (
                    <img 
                      src={photos.backCp} 
                      alt="backCp" 
                      style={{ width: "100%", height: "100%"}} 
                    />
                  ):"Haz Click aquí para tomar la foto"}
                </div>
              </div>
            </div>

            {/* Foto de la tarjeta de propiedad */}
            <div className="row row-cols-sm-2 mt-2">
              <div className="d-flex flex-column align-items-start">
                <label style={{fontSize:12}}>Foto frontal de la tarjeta de propiedad:</label>
                <div
                  style={{
                    width: "100%",
                    height: 200,
                    border: "2px solid #ccc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    borderRadius:25
                  }}
                  onClick={() => openModal("frontTp","Tarjeta de propiedad frontal")}
                >
                  {photos.frontTp ? (
                    <img 
                      src={photos.frontTp} 
                      alt="frontTp" 
                      style={{ width: "100%", height: "100%"}} 
                    />
                  ):"Haz Click aquí para tomar la foto"}
                </div>
              </div>
              <div className="d-flex flex-column align-items-start">
                <label style={{fontSize:12}}>Foto trasera de la tarjeta de propiedad:</label>
                <div
                  style={{
                    width: "100%",
                    height: 200,
                    border: "2px solid #ccc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    borderRadius:25
                  }}
                  onClick={() => openModal("backTp","Tarjeta de propiedad trasera")}
                >
                  {photos.backTp ? (
                    <img 
                      src={photos.backTp} 
                      alt="backTp" 
                      style={{ width: "100%", height: "100%"}} 
                    />
                  ):"Haz Click aquí para tomar la foto"}
                </div>
              </div>
            </div>

            {/* Foto cedula si es persona autorizada */}
            { typeClient ==='autorizado' &&
              <div className="row row-cols-sm-2 mt-2">
                <div className="d-flex flex-column align-items-start">
                  <label style={{fontSize:12}}>Foto frontal de la cédula persona autorizada:</label>
                  <div
                    style={{
                      width: "100%",
                      height: 200,
                      border: "2px solid #ccc",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      borderRadius:25
                    }}
                    onClick={() => openModal("frontCauth","Cédula frontal persona autorizada")}
                  >
                    {photos.frontCauth ? (
                      <img 
                        src={photos.frontCauth} 
                        alt="frontCauth" 
                        style={{ width: "100%", height: "100%"}} 
                      />
                    ):"Haz Click aquí para tomar la foto"}
                  </div>
                </div>
                <div className="d-flex flex-column align-items-start">
                  <label style={{fontSize:12}}>Foto trasera de la cédula persona autorizada:</label>
                  <div
                    style={{
                      width: "100%",
                      height: 200,
                      border: "2px solid #ccc",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      borderRadius:25
                    }}
                    onClick={() => openModal("backCauth","Cédula trasera persona autorizada")}
                  >
                    {photos.backCauth ? (
                      <img 
                        src={photos.backCauth} 
                        alt="backCauth" 
                        style={{ width: "100%", height: "100%"}} 
                      />
                    ):"Haz Click aquí para tomar la foto"}
                  </div>
                </div>
              </div>
            }

            {/* firma, huella y foto persona */}
            <div className="row row-cols-sm-2 mt-2">
              <div>
                <div className="d-flex flex-column align-items-start">
                  <label style={{fontSize:12}} className="w-100 d-flex test-center">Firma:</label>
                  <img
                    className="border border-2"
                    style={{width:'100%', height:200, borderRadius:25}}
                  />
                </div>
              </div>
              <div className="d-flex flex-row w-50 ">
                <div className="d-flex flex-column align-items-center w-50">
                  <label style={{fontSize:12}} className="w-100 d-flex align-items-center justify-content-center">Foto del usuario:</label>
                  <div
                    className="w-75"
                    style={{
                      width: "100%",
                      height: 200,
                      border: "2px solid #ccc",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      borderRadius:25
                    }}
                    onClick={() => openModal("photoUser","Usuario")}
                  >
                    {photos.photoUser ? (
                      <img 
                        src={photos.photoUser} 
                        alt="photoUser" 
                        style={{ width: "100%", height: "100%"}} 
                      />
                    ):"Haz Click aquí para tomar la foto"}
                  </div>
                </div>
                <div className="d-flex flex-column align-items-center w-50">
                  <label style={{fontSize:12}}>Huella:</label>
                  <img
                    className="border border-2 w-75"
                    style={{width:'100%', height:200, borderRadius:25}}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Modal para tomar fotos */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Capturar Foto: {nameField}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {!previewPhoto ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode: "enviroment", // 'user' para camara delante O 'enviroment' para la cámara trasera
            }}
            style={{ width: '100%', height: '100%', border: '2px solid #ccc', borderRadius: '10px' }}
          />
        ):(
          <img
            src={previewPhoto}
            alt="Previsualización"
            style={{ width: '100%', height: '100%', border: '2px solid #ccc', borderRadius: '10px' }}
          />
        )}
        </Modal.Body>
          <Modal.Footer>
          {!previewPhoto ? (
          <>
            <button
              onClick={capturePhoto}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Capturar
            </button>
            <label
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Subir
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                style={{ display: "none" }}
              />
            </label>
          </>
          ) : (
            <>
            <button
              onClick={savePhoto}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                marginRight: "10px",
              }}
            >
              Guardar
            </button>
            <button
              onClick={() => discardPhoto()}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Descartar
            </button>
          </>
        )} 
        </Modal.Footer>
        </Modal>
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
              type="submit"
              className="btn btn-sm btn-success fw-bold w-100"
            >
              REGISTRAR
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
