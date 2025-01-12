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
import { GiSandsOfTime } from "react-icons/gi";
import SigWebDemo from "../../components/ModalFirma";
import { RiCheckboxMultipleLine } from "react-icons/ri";
import ModalMultiple from "../../components/ModalMultiple";
import { createSolicitud, updateSolicitud } from "../../services/solicitudService";
import "./styles.css";

export default function Form() {
  const { isLogged, logout } = useUser();
  const [showSideBar, setShowSidebar] = useState(false);
  const [ruta, setRuta] = useState('');
  const { user } = useContext(AuthContext);
  const [showModalMultiple, setShowModalMultiple] = useState(false);
  const [sigImageFirma, setSigImageFirma] = useState("");
  const [showModalFirma, setShowModalFirma] = useState(false);
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
    marca:'',
    tipo:'',
    cedulaPersonAuth:'',
    primerApellidoPersonAuth:'',
    segundoApellidoPersonAuth:'',
    primerNombrePersonAuth:'',
    segundoNombrePersonAuth:'',
    direccionPersonAuth:'',
    municipioPersonAuth:'',
    celularPersonAuth:'',
    correoPersonAuth:'',
  });

  //constante de las imagenes
  const [activeField, setActiveField] = useState(null);
  const [nameField, setNameField] = useState(null);
  const webcamRef = useRef(null);
  const ImgFirmaRef = useRef(null);
  const firmaRef = useRef(null);
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

  const [typeClient, setTypeClient] = useState('propietario');
  const changeBar = (e) => {
    if(typeClient === 'propietario'){
      setTypeClient('autorizado')
    }else if(typeClient === 'autorizado'){
      setTypeClient('propietario')
    }
    setInvoiceType(!invoiceType);
  };

  const handleSubmit = (e) =>{
    e.preventDefault();
    setLoading(true)
    if(search.cedulaPropietario){
      const body = {
        cedulaPropietario: search.cedulaPropietario,
        /* nombrePropietario: `${search.primerApellidoPropietario !== '' ? toString(search.primerApellidoPropietario).toUpperCase():''} ${search.segundoApellidoPropietario !== '' ? toString(search.segundoApellidoPropietario).toUpperCase():''} ${search.primerNombrePropietario !== '' ? toString(search.primerNombrePropietario).toUpperCase():''} ${search.segundoNombrePropietario !== '' ? toString(search.segundoNombrePropietario).toUpperCase():''}`, */
        primerApellidoPropietario: search.primerApellidoPropietario !== '' ? search.primerApellidoPropietario.toUpperCase():'' ,
        segundoApellidoPropietario: search.segundoApellidoPropietario !== '' ? search.segundoApellidoPropietario.toUpperCase():'',
        primerNombrePropietario: search.primerNombrePropietario !== '' ? search.primerNombrePropietario.toUpperCase():'',
        segundoNombrePropietario: search.segundoNombrePropietario !== '' ? search.segundoNombrePropietario.toUpperCase():'',

        direccionPropietario: search.direccionPropietario !== '' ? search.direccionPropietario.toUpperCase():'',
        municipioPropietario: search.municipioPropietario !== '' ? search.municipioPropietario.toUpperCase():'',
        celularPropietario: search.celularPropietario,
        correoPropietario: search.correoPropietario !== '' ? search.correoPropietario.toLowerCase():'',
        licenciaTransito: search.licenciaTransito,
        placa: search.placa !== '' ? search.placa.toUpperCase():'',
        marca: search.marca !== '' ? search.marca.toUpperCase():'',
        tipo: search.tipo !== '' ? search.tipo.toUpperCase():'',
        cedulaPersonAuth: search.cedulaPersonAuth,
        /* nombrePersonAuth: `${search.primerApellidoPersonAuth !== '' ? toString(search.primerApellidoPersonAuth).toUpperCase():''} ${search.segundoApellidoPersonAuth !== '' ? toString(search.segundoApellidoPersonAuth).toUpperCase():''} ${search.primerNombrePersonAuth !== '' ? toString(search.primerNombrePersonAuth).toUpperCase():''} ${search.segundoNombrePersonAuth !== '' ? toString(search.segundoNombrePersonAuth).toUpperCase():''}`, */
        primerApellidoPersonAuth: search.primerApellidoPersonAuth !== '' ? search.primerApellidoPersonAuth.toUpperCase():'',
        segundoApellidoPersonAuth: search.segundoApellidoPersonAuth !== '' ? search.segundoApellidoPersonAuth.toUpperCase():'',
        primerNombrePersonAuth: search.primerNombrePersonAuth !== '' ? search.primerNombrePersonAuth.toUpperCase():'',
        segundoNombrePersonAuth: search.segundoNombrePersonAuth !== '' ? search.segundoNombrePersonAuth.toUpperCase():'',

        direccionPersonAuth: search.direccionPersonAuth !== '' ? search.direccionPersonAuth.toUpperCase():'',
        municipioPersonAuth: search.municipioPersonAuth !== '' ? search.municipioPersonAuth.toUpperCase():'',
        celularPersonAuth: search.celularPersonAuth,
        correoPersonAuth: search.correoPersonAuth !== '' ? search.correoPersonAuth.toLowerCase():'',
  
        fotoUsuario: photos.photoUser,
        cedulaPropietarioFrontal: photos.frontCp,
        cedulaPropietarioTrasera: photos.backCp,
  
        createdAt: new Date(),
        userId: user.id,
      }
      createSolicitud(body)
      .then(({data})=>{
        const info = {
          tarjetaPropiedadFrontal: photos.frontTp,
          tarjetaPropiedadTrasera: photos.backTp,
          cedulaPersonAuthFrontal: photos.frontCauth,
        }
        updateSolicitud(data.id,info)
        .then(()=>{
          const info2 = {
            cedulaPersonAuthTrasera: photos.backCauth,
      
            firma: sigImageFirma !== '' ? sigImageFirma : '',
          }
          updateSolicitud(data.id,info2)
          .then(()=>{
            setLoading(false)
            handleClear()
            Swal.fire({
              title:'¡FELICIDADES!',
              text:'Se ha registrado la solicitud de forma exitosa',
              showConfirmButton:true,
              showCancelButton:false,
              confirmButtonColor:'green'
            })
          })
          .catch((error)=>{
            setLoading(false)
            Swal.fire({
              title:`¡ERROR!`, 
              text:'Ha ocurrido un error al momento de hacer el registro de la solicitud. Vuelve a intentarlo mas tarde.',
              showConfirmButton:true,
              showCancelButton:false,
              confirmButtonColor:'red'
            })
          })
        })
        .catch((error)=>{
          setLoading(false)
          Swal.fire({
            title:`¡ERROR!`, 
            text:'Ha ocurrido un error al momento de hacer el registro de la solicitud. Vuelve a intentarlo mas tarde.',
            showConfirmButton:true,
            showCancelButton:false,
            confirmButtonColor:'red'
          })
        })
      })
      .catch((error)=>{
        setLoading(false)
        Swal.fire({
          title:`¡ERROR!`, 
          text:'Ha ocurrido un error al momento de hacer el registro de la solicitud. Vuelve a intentarlo mas tarde.',
          showConfirmButton:true,
          showCancelButton:false,
          confirmButtonColor:'red'
        })
      })
    }else{
      setLoading(false)
      Swal.fire({
        icon:'warning',
        title:'¡ATENCION!',
        text:'Por favor ingresa por lo menos el número de cédula del propietario para llevar a cabo el registro de la solicitud.',
        showConfirmButton:true,
        confirmButtonColor:'blue'
      })
    }
  }

  const handleClear = () =>{
    setSearch({
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
      marca:'',
      tipo:'',
      cedulaPersonAuth:'',
      primerApellidoPersonAuth:'',
      segundoApellidoPersonAuth:'',
      primerNombrePersonAuth:'',
      segundoNombrePersonAuth:'',
      direccionPersonAuth:'',
      municipioPersonAuth:'',
      celularPersonAuth:'',
      correoPersonAuth:'',
    })
    setSigImageFirma('')
    setShowModalMultiple(false);
    setShowModalFirma(false);
    setActiveField(null);
    setNameField(null);
    setPreviewPhoto(null);
    setShowModal(false);
    setPhotos({
      photoUser: null,
      frontCp: null,
      backCp: null,
      frontTp: null,
      backTp: null,
      frontCauth: null,
      backCauth: null,
    })
    setTypeClient('propietario')
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
            <h1 className="fs-6 fw-bold">Fecha: <label>{JSON.stringify(new Date().getDate())}/{JSON.stringify(new Date().getMonth()+1)}/{JSON.stringify(new Date().getFullYear())}</label></h1>
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
                      id="cedulaPropietario"
                      value={search.cedulaPropietario}
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="*Campo obligatorio*"
                      onChange={(e) => {
                        handlerChangeSearch(e);
                      }}
                      min={0}
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label>Primer apellido:</label>
                    <input
                        id="primerApellidoPropietario"
                        value={search.primerApellidoPropietario}
                        type="text"
                        className="form-control form-control-sm"
                        autoComplete="off"
                        onChange={(e) => {
                          handlerChangeSearch(e);
                        }}
                        style={{textTransform:'uppercase'}}
                      />
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label>Segundo apellido:</label>
                    <input
                        id="segundoApellidoPropietario"
                        value={search.segundoApellidoPropietario}
                        type="text"
                        className="form-control form-control-sm"
                        autoComplete="off"
                        onChange={(e) => {
                          handlerChangeSearch(e);
                        }}
                        style={{textTransform:'uppercase'}}
                      />
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label>Primer nombre:</label>
                    <input
                        id="primerNombrePropietario"
                        value={search.primerNombrePropietario}
                        type="text"
                        className="form-control form-control-sm"
                        autoComplete="off"
                        onChange={(e) => {
                          handlerChangeSearch(e);
                        }}
                        style={{textTransform:'uppercase'}}
                      />
                  </div>
                </div>
              </div>
              <div>
                <div className="row row-cols-sm-3">
                <div className="d-flex flex-column align-items-start">
                    <label>Segundo nombre:</label>
                    <input
                      id="segundoNombrePropietario"
                      value={search.segundoNombrePropietario}
                      type="text"
                      className="form-control form-control-sm"
                      onChange={(e) => {
                        handlerChangeSearch(e);
                      }}
                      style={{textTransform:'uppercase'}}
                      autoComplete="off"
                    />
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label>Dirección de residencia:</label>
                    <input
                      id="direccionPropietario"
                      value={search.direccionPropietario}
                      type="text"
                      className="form-control form-control-sm"
                      autoComplete="off"
                      onChange={(e) => {
                        handlerChangeSearch(e);
                      }}
                      style={{textTransform:'uppercase'}}
                    />
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label>Municipio de residencia:</label>
                    <input
                        id="municipioPropietario"
                        value={search.municipioPropietario}
                        type="text"
                        className="form-control form-control-sm"
                        autoComplete="off"
                        onChange={(e) => {
                          handlerChangeSearch(e);
                        }}
                        style={{textTransform:'uppercase'}}
                      />
                  </div>
                </div>
              </div>
              <div>
                <div className="row row-cols-sm-2">
                  <div className="d-flex flex-column align-items-start">
                    <label>No. Celular:</label>
                    <input
                      id="celularPropietario"
                      value={search.celularPropietario}
                      type="number"
                      className="form-control form-control-sm"
                      autoComplete="off"
                      onChange={(e) => {
                        handlerChangeSearch(e);
                      }}
                      min={0}
                    />
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label>Correo electrónico:</label>
                    <input
                      id="correoPropietario"
                      value={search.correoPropietario}
                      type="email"
                      className="form-control form-control-sm"
                      autoComplete="off"
                      onChange={(e) => {
                        handlerChangeSearch(e);
                      }}
                      style={{textTransform:'lowercase'}}
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
                          id="licenciaTransito"
                          value={search.licenciaTransito}
                          type="number"
                          className="form-control form-control-sm"
                          autoComplete="off"
                          onChange={(e) => {
                            handlerChangeSearch(e);
                          }}
                          min={0}
                        />
                      </div>
                      <div className="d-flex flex-column align-items-start">
                        <label>Placa:</label>
                        <input
                            id="placa"
                            value={search.placa}
                            type="text"
                            className="form-control form-control-sm"
                            autoComplete="off"
                            onChange={(e) => {
                              handlerChangeSearch(e);
                            }}
                            style={{textTransform:'uppercase'}}
                          />
                      </div>
                      <div className="d-flex flex-column align-items-start">
                        <label>Marca:</label>
                        <input
                          id="marca"
                          value={search.marca}
                          type="text"
                          className="form-control form-control-sm"
                          autoComplete="off"
                          onChange={(e) => {
                            handlerChangeSearch(e);
                          }}
                          style={{textTransform:'uppercase'}}
                        />
                      </div>
                      <div className="d-flex flex-column align-items-start">
                        <label>Tipo:</label>
                        <input
                            id="tipo"
                            value={search.tipo}
                            type="text"
                            className="form-control form-control-sm"
                            autoComplete="off"
                            onChange={(e) => {
                              handlerChangeSearch(e);
                            }}
                            style={{textTransform:'uppercase'}}
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
                        id="cedulaPersonAuth"
                        value={search.cedulaPersonAuth}
                        type="number"
                        className="form-control form-control-sm"
                        autoComplete="off"
                        onChange={(e) => {
                          handlerChangeSearch(e);
                        }}
                        min={0}
                      />
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <label>Primer apellido:</label>
                      <input
                          id="primerApellidoPersonAuth"
                          value={search.primerApellidoPersonAuth}
                          type="text"
                          className="form-control form-control-sm"
                          autoComplete="off"
                          onChange={(e) => {
                            handlerChangeSearch(e);
                          }}
                          style={{textTransform:'uppercase'}}
                        />
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <label>Segundo apellido:</label>
                      <input
                          id="segundoApellidoPersonAuth"
                          value={search.segundoApellidoPersonAuth}
                          type="text"
                          className="form-control form-control-sm"
                          autoComplete="off"
                          onChange={(e) => {
                            handlerChangeSearch(e);
                          }}
                          style={{textTransform:'uppercase'}}
                        />
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <label>Primer nombre:</label>
                      <input
                          id="primerNombrePersonAuth"
                          value={search.primerNombrePersonAuth}
                          type="text"
                          className="form-control form-control-sm"
                          autoComplete="off"
                          onChange={(e) => {
                            handlerChangeSearch(e);
                          }}
                          style={{textTransform:'uppercase'}}
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
                        id="segundoNombrePersonAuth"
                        value={search.segundoNombrePersonAuth}
                        type="text"
                        className="form-control form-control-sm"
                        onChange={(e) => {
                          handlerChangeSearch(e);
                        }}
                        style={{textTransform:'uppercase'}}
                        autoComplete="off"
                      />
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <label>Dirección de residencia:</label>
                      <input
                        id="direccionPersonAuth"
                        value={search.direccionPersonAuth}
                        type="text"
                        className="form-control form-control-sm"
                        autoComplete="off"
                        onChange={(e) => {
                          handlerChangeSearch(e);
                        }}
                        style={{textTransform:'uppercase'}}
                      />
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <label>Municipio de residencia:</label>
                      <input
                          id="municipioPersonAuth"
                          value={search.municipioPersonAuth}
                          type="text"
                          className="form-control form-control-sm"
                          autoComplete="off"
                          onChange={(e) => {
                            handlerChangeSearch(e);
                          }}
                          style={{textTransform:'uppercase'}}
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
                        id="celularPersonAuth"
                        value={search.celularPersonAuth}
                        type="number"
                        className="form-control form-control-sm"
                        autoComplete="off"
                        onChange={(e) => {
                          handlerChangeSearch(e);
                        }}
                        min={0}
                      />
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <label>Correo electrónico:</label>
                      <input
                        id="correoPersonAuth"
                        value={search.correoPersonAuth}
                        type="email"
                        className="form-control form-control-sm"
                        autoComplete="off"
                        onChange={(e) => {
                          handlerChangeSearch(e);
                        }}
                        style={{textTransform:'lowercase'}}
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
                  {/* <img
                    className="border border-2"
                    style={{width:'100%', height:200, borderRadius:25}}
                  /> */}
                  <div
                    className="w-100"
                    style={{
                      height: 200,
                      border: "2px solid #ccc",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      borderRadius:25
                    }}
                    onClick={() => setShowModalFirma(true)}
                  >
                    {sigImageFirma ? (
                        <img 
                          ref={ImgFirmaRef}
                          src={`data:image/png;base64,${sigImageFirma}`} 
                          alt="Firma" 
                          style={{ width: "100%", height: "100%"}} 
                        />
                      ):"Haz Click aquí para hacer la firma"
                    }
                  </div>
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
          {/* Modal de la firma */}
          <SigWebDemo
            sigImage={sigImageFirma}
            setSigImage={setSigImageFirma}
            canvasRef={firmaRef}
            showModal={showModalFirma}
            setShowModal={setShowModalFirma}
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
