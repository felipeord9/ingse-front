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
import SigWebDemoEmpleado from "../../components/ModalFirmaEmpleado";
import { TbReportSearch } from "react-icons/tb";
import { findSolicitudes } from "../../services/solicitudService";
import { FcDataBackup } from "react-icons/fc";
import ModalBackUpBD from "../../components/ModalBackUpBD";
import { FaListOl } from "react-icons/fa6";

export default function Form() {
  const { isLogged, logout } = useUser();
  const [showSideBar, setShowSidebar] = useState(false);
  const [ruta, setRuta] = useState('');
  const { user } = useContext(AuthContext);
  const [showModalMultiple, setShowModalMultiple] = useState(false);
  const [sigImageFirma, setSigImageFirma] = useState("");
  const [showModalFirma, setShowModalFirma] = useState(false);
  const [sigFirmaEmpleado, setSigFirmaEmpleado] = useState("");
  const [showModalFirmaEmpleado, setShowModalFirmaEmpleado] = useState(false);
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

  //constante de las imagenes
  const [activeField, setActiveField] = useState(null);
  const [nameField, setNameField] = useState(null);
  const webcamRef = useRef(null);
  const ImgFirmaRef = useRef(null);
  const firmaRef = useRef(null);
  const ImgFirmEmpleadoRef = useRef(null);
  const firmaEmpleadoRef = useRef(null);
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
    productoDañado: null,
    impronta: null,
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

  const handleChangeConcepto = (e) =>{
    const { id, value } = e.target;
    console.log(value);
    if((value === 'NUEVA' && search.tipo === 'AUTOMOVILES') || (value === 'NUEVA' && search.tipo === 'TRACTOMULA')){
      setSearch({
        ...search,
        [id]: value,
        numPlacas: 2
      });
    }else{
      setSearch({
        ...search,
        [id]: value,
        numPlacas:''
      });
    }
  }

  const handleChangeTipo = (e) =>{
    const { id, value } = e.target;
    console.log(value);
    if((value === 'AUTOMOVILES' && search.concepto === 'NUEVA') || (value === 'TRACTOMULA' && search.concepto === 'NUEVA')){
      setSearch({
        ...search,
        [id]: value,
        numPlacas: 2
      });
    }else{
      setSearch({
        ...search,
        [id]: value,
        numPlacas:''
      });
    }
  }

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
    //funcion para comparar las placas, vin y chasis
    const filtroPorPlaca= clientes.filter((item)=>{
      if(item.placaDesde === search.placa.toUpperCase()){
        return item
      }
    })
    //funcion para buscar si la cedula ya esta registrada
    const filtroCliente = clientes.filter((item)=>{
      if(item.cedulaPropietario === search.cedulaPropietario){
        return item
      }
    })

    if(filtroCliente.length > 0){
      Swal.fire({
        icon:'warning',
        title:'¡ATENCIÓN!',
        text:`El numero de identificación: ${search.cedulaPropietario},
        se encuentra registrado en nuestra base de datos 
        en las siguientes fechas: 
        ${devolverLista(filtroCliente)}. ¿Desea continuar con el registro?`,
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: 'Si',
        confirmButtonColor:'green',
        denyButtonText: 'No',
      })
      .then(({isConfirmed, isDenied})=>{
        if(isConfirmed){
          if(filtroPorPlaca.length > 0 && filtroPorPlaca[0].vin === search.vin && filtroPorPlaca[0].chasis === search.chasis){
            Swal.fire({
              title:'AVISO',
              text:`La placa: "${search.placa.toUpperCase()}" ya se encuentra registrada en nuestra base de datos
              con las fechas: ${devolverLista(filtroPorPlaca)}. ¿Desea continuar?`,
              showConfirmButton: true,
              showDenyButton: true,
              confirmButtonText: 'Si',
              confirmButtonColor:'green',
              denyButtonText: 'No',
            }).then(({isConfirmed, isDenied})=>{
              if(isConfirmed){
                setLoading(true)
                if(search.cedulaPropietario !== '' && search.primerApellidoPropietario !== '' &&
                    search.segundoApellidoPropietario !== '' && search.primerNombrePropietario !== '' &&
                    search.celularPropietario !== '' && search.correoPropietario !== '' && search.municipioPropietario !== '' &&
                    search.placa !== '' && search.tipo !== '' && search.servicio !== '' && search.ciudadPlaca !== ''
                ){
                  if(search.correoPropietario !=='' && search.correoPropietario.includes('@') && search.correoPropietario.split('@')[1].includes('.')){
                    const body = {
                      cedulaPropietario: search.cedulaPropietario,
                      nombrePropietario: `${search.primerApellidoPropietario !== '' ? search.primerApellidoPropietario.toUpperCase():''} ${search.segundoApellidoPropietario !== '' ? search.segundoApellidoPropietario.toUpperCase():''} ${search.primerNombrePropietario !== '' ? search.primerNombrePropietario.toUpperCase():''} ${search.segundoNombrePropietario !== '' ? search.segundoNombrePropietario.toUpperCase():''}`,
                      primerApellidoPropietario: search.primerApellidoPropietario !== '' ? search.primerApellidoPropietario.toUpperCase():'' ,
                      segundoApellidoPropietario: search.segundoApellidoPropietario !== '' ? search.segundoApellidoPropietario.toUpperCase():'',
                      primerNombrePropietario: search.primerNombrePropietario !== '' ? search.primerNombrePropietario.toUpperCase():'',
                      segundoNombrePropietario: search.segundoNombrePropietario !== '' ? search.segundoNombrePropietario.toUpperCase():'',
              
                      direccionPropietario: search.direccionPropietario !== '' ? search.direccionPropietario.toUpperCase():'',
                      municipioPropietario: search.municipioPropietario !== '' ? search.municipioPropietario.toUpperCase():'',
                      celularPropietario: search.celularPropietario,
                      correoPropietario: search.correoPropietario !== '' ? search.correoPropietario.toLowerCase():'',
              
                      licenciaTransito: search.licenciaTransito,
                      vin: search.vin !== '' ? search.vin.toUpperCase():'',
                      chasis: search.chasis !== '' ? search.chasis.toUpperCase():'',
                      placaDesde: search.placa !== '' ? search.placa.toUpperCase():'',
                      /* placaHasta: search.placa !== '' ? search.placa.toUpperCase():'', */
                      marca: search.marca !== '' ? search.marca.toUpperCase():'',
                      tipo: search.tipo !== '' ? search.tipo.toUpperCase():'',
                      servicio: search.servicio !=='' ? search.servicio.toUpperCase():'',
              
                      cedulaPersonAuth: search.cedulaPersonAuth,
                      nombrePersonAuth: `${search.primerApellidoPersonAuth !== '' ? toString(search.primerApellidoPersonAuth).toUpperCase():''} ${search.segundoApellidoPersonAuth !== '' ? toString(search.segundoApellidoPersonAuth).toUpperCase():''} ${search.primerNombrePersonAuth !== '' ? toString(search.primerNombrePersonAuth).toUpperCase():''} ${search.segundoNombrePersonAuth !== '' ? toString(search.segundoNombrePersonAuth).toUpperCase():''}`,
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
      
                      //agregados en la segunda entrega
                      typeClient: typeClient,
                      numeroFactura: search.numeroFactura,
                      concepto: search.concepto,
                      numPlacas: search.numPlacas !== '' ? search.numPlacas : 1,
                      ciudadPlaca: search.ciudadPlaca,
                      observations: 'La cédula y la placa ya se encontraban registrados al momento de hacer la solicitud (el número de chasis y número de vin SI COINCIDEN con el que ya estaba registrado), se le informó al usuario y este continuó con el registro.'
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
                          const info3 = {
                            firmaEmpleado: sigFirmaEmpleado !== '' ? sigFirmaEmpleado : '',
                            impronta: (search.concepto === 'PERDIDA' || search.concepto === 'ROBO') ? photos.impronta : '',
                            productoDañado: search.concepto === 'DETERIORO' ? photos.productoDañado : '',
                          }
                          updateSolicitud(data.id, info3)
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
                      title:'¡CORREO INVALIDO!',
                      /* text:'Por favor ingresa por lo menos el número de cédula del propietario para llevar a cabo el registro de la solicitud.', */
                      text:'Revisa que el correo este bien escrito. Es importante que esté bien digilenciado este campo.',
                      showConfirmButton:true,
                      confirmButtonColor:'blue'
                    })
                  }
                }else{
                  setLoading(false)
                  Swal.fire({
                    icon:'warning',
                    title:'¡ATENCION!',
                    /* text:'Por favor ingresa por lo menos el número de cédula del propietario para llevar a cabo el registro de la solicitud.', */
                    text:'Por favor ingresa por lo menos los datos del propietario para llevar a cabo el registro de la solicitud.',
                    showConfirmButton:true,
                    confirmButtonColor:'blue'
                  })
                }
              }
              
            })
          }else if(filtroPorPlaca.length > 0 && (filtroPorPlaca[0].vin !== search.vin || filtroPorPlaca[0].chasis !== search.chasis)){
            Swal.fire({
              icon:'warning',
              title:'AVISO',
              text:`La placa: "${search.placa.toUpperCase()}" ya se encuentra registrada en nuestra base de datos,
              pero el número vin (Registrado: ${filtroPorPlaca[0].vin} - Actual: ${search.vin}) o 
              número de chasis (Registrado: ${filtroPorPlaca[0].chasis} - Actual: ${search.chasis}) es diferente. ¿Desea continuar?`,
              showConfirmButton: true,
              showDenyButton: true,
              confirmButtonText: 'Si',
              confirmButtonColor:'green',
              denyButtonText: 'No',
            }).then(({isConfirmed, isDenied})=>{
              if(isConfirmed){
                setLoading(true)
                if(search.cedulaPropietario !== '' && search.primerApellidoPropietario !== '' &&
                    search.segundoApellidoPropietario !== '' && search.primerNombrePropietario !== '' &&
                    search.celularPropietario !== '' && search.correoPropietario !== '' && search.municipioPropietario !== '' &&
                    search.placa !== '' && search.tipo !== '' && search.servicio !== '' && search.ciudadPlaca !== ''
                ){
                  if(search.correoPropietario !=='' && search.correoPropietario.includes('@') && search.correoPropietario.split('@')[1].includes('.')){
                    const body = {
                      cedulaPropietario: search.cedulaPropietario,
                      nombrePropietario: `${search.primerApellidoPropietario !== '' ? search.primerApellidoPropietario.toUpperCase():''} ${search.segundoApellidoPropietario !== '' ? search.segundoApellidoPropietario.toUpperCase():''} ${search.primerNombrePropietario !== '' ? search.primerNombrePropietario.toUpperCase():''} ${search.segundoNombrePropietario !== '' ? search.segundoNombrePropietario.toUpperCase():''}`,
                      primerApellidoPropietario: search.primerApellidoPropietario !== '' ? search.primerApellidoPropietario.toUpperCase():'' ,
                      segundoApellidoPropietario: search.segundoApellidoPropietario !== '' ? search.segundoApellidoPropietario.toUpperCase():'',
                      primerNombrePropietario: search.primerNombrePropietario !== '' ? search.primerNombrePropietario.toUpperCase():'',
                      segundoNombrePropietario: search.segundoNombrePropietario !== '' ? search.segundoNombrePropietario.toUpperCase():'',
              
                      direccionPropietario: search.direccionPropietario !== '' ? search.direccionPropietario.toUpperCase():'',
                      municipioPropietario: search.municipioPropietario !== '' ? search.municipioPropietario.toUpperCase():'',
                      celularPropietario: search.celularPropietario,
                      correoPropietario: search.correoPropietario !== '' ? search.correoPropietario.toLowerCase():'',
              
                      licenciaTransito: search.licenciaTransito,
                      vin: search.vin !== '' ? search.vin.toUpperCase():'',
                      chasis: search.chasis !== '' ? search.chasis.toUpperCase():'',
                      placaDesde: search.placa !== '' ? search.placa.toUpperCase():'',
                      /* placaHasta: search.placa !== '' ? search.placa.toUpperCase():'', */
                      marca: search.marca !== '' ? search.marca.toUpperCase():'',
                      tipo: search.tipo !== '' ? search.tipo.toUpperCase():'',
                      servicio: search.servicio !=='' ? search.servicio.toUpperCase():'',
              
                      cedulaPersonAuth: search.cedulaPersonAuth,
                      nombrePersonAuth: `${search.primerApellidoPersonAuth !== '' ? toString(search.primerApellidoPersonAuth).toUpperCase():''} ${search.segundoApellidoPersonAuth !== '' ? toString(search.segundoApellidoPersonAuth).toUpperCase():''} ${search.primerNombrePersonAuth !== '' ? toString(search.primerNombrePersonAuth).toUpperCase():''} ${search.segundoNombrePersonAuth !== '' ? toString(search.segundoNombrePersonAuth).toUpperCase():''}`,
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
      
                      //agregados en la segunda entrega
                      typeClient: typeClient,
                      numeroFactura: search.numeroFactura,
                      concepto: search.concepto,
                      numPlacas: search.numPlacas !== '' ? search.numPlacas : 1,
                      ciudadPlaca: search.ciudadPlaca,
                      observations: 'La cédula y la placa ya se encontraban registrados al momento de hacer la solicitud (el número de chasis ó número de vin NO COINCIDEN con el que ya estaba registrado), se le informó al usuario y este continuó con el registro.'
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
                          const info3 = {
                            firmaEmpleado: sigFirmaEmpleado !== '' ? sigFirmaEmpleado : '',
                            impronta: (search.concepto === 'PERDIDA' || search.concepto === 'ROBO') ? photos.impronta : '',
                            productoDañado: search.concepto === 'DETERIORO' ? photos.productoDañado : '',
                          }
                          updateSolicitud(data.id, info3)
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
                      title:'¡CORREO INVALIDO!',
                      /* text:'Por favor ingresa por lo menos el número de cédula del propietario para llevar a cabo el registro de la solicitud.', */
                      text:'Revisa que el correo este bien escrito. Es importante que esté bien digilenciado este campo.',
                      showConfirmButton:true,
                      confirmButtonColor:'blue'
                    })
                  }
                }else{
                  setLoading(false)
                  Swal.fire({
                    icon:'warning',
                    title:'¡ATENCION!',
                    /* text:'Por favor ingresa por lo menos el número de cédula del propietario para llevar a cabo el registro de la solicitud.', */
                    text:'Por favor ingresa por lo menos los datos del propietario para llevar a cabo el registro de la solicitud.',
                    showConfirmButton:true,
                    confirmButtonColor:'blue'
                  })
                }
              }
            })
          }else{
            setLoading(true)
            if(search.cedulaPropietario !== '' && search.primerApellidoPropietario !== '' &&
                search.segundoApellidoPropietario !== '' && search.primerNombrePropietario !== '' &&
                search.celularPropietario !== '' && search.correoPropietario !== '' && search.municipioPropietario !== '' &&
                search.placa !== '' && search.tipo !== '' && search.servicio !== '' && search.ciudadPlaca !== ''
            ){
              if(search.correoPropietario !=='' && search.correoPropietario.includes('@') && search.correoPropietario.split('@')[1].includes('.')){
                const body = {
                  cedulaPropietario: search.cedulaPropietario,
                  nombrePropietario: `${search.primerApellidoPropietario !== '' ? search.primerApellidoPropietario.toUpperCase():''} ${search.segundoApellidoPropietario !== '' ? search.segundoApellidoPropietario.toUpperCase():''} ${search.primerNombrePropietario !== '' ? search.primerNombrePropietario.toUpperCase():''} ${search.segundoNombrePropietario !== '' ? search.segundoNombrePropietario.toUpperCase():''}`,
                  primerApellidoPropietario: search.primerApellidoPropietario !== '' ? search.primerApellidoPropietario.toUpperCase():'' ,
                  segundoApellidoPropietario: search.segundoApellidoPropietario !== '' ? search.segundoApellidoPropietario.toUpperCase():'',
                  primerNombrePropietario: search.primerNombrePropietario !== '' ? search.primerNombrePropietario.toUpperCase():'',
                  segundoNombrePropietario: search.segundoNombrePropietario !== '' ? search.segundoNombrePropietario.toUpperCase():'',
          
                  direccionPropietario: search.direccionPropietario !== '' ? search.direccionPropietario.toUpperCase():'',
                  municipioPropietario: search.municipioPropietario !== '' ? search.municipioPropietario.toUpperCase():'',
                  celularPropietario: search.celularPropietario,
                  correoPropietario: search.correoPropietario !== '' ? search.correoPropietario.toLowerCase():'',
          
                  licenciaTransito: search.licenciaTransito,
                  vin: search.vin !== '' ? search.vin.toUpperCase():'',
                  chasis: search.chasis !== '' ? search.chasis.toUpperCase():'',
                  placaDesde: search.placa !== '' ? search.placa.toUpperCase():'',
                  /* placaHasta: search.placa !== '' ? search.placa.toUpperCase():'', */
                  marca: search.marca !== '' ? search.marca.toUpperCase():'',
                  tipo: search.tipo !== '' ? search.tipo.toUpperCase():'',
                  servicio: search.servicio !=='' ? search.servicio.toUpperCase():'',
          
                  cedulaPersonAuth: search.cedulaPersonAuth,
                  nombrePersonAuth: `${search.primerApellidoPersonAuth !== '' ? toString(search.primerApellidoPersonAuth).toUpperCase():''} ${search.segundoApellidoPersonAuth !== '' ? toString(search.segundoApellidoPersonAuth).toUpperCase():''} ${search.primerNombrePersonAuth !== '' ? toString(search.primerNombrePersonAuth).toUpperCase():''} ${search.segundoNombrePersonAuth !== '' ? toString(search.segundoNombrePersonAuth).toUpperCase():''}`,
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
        
                  //agregados en la segunda entrega
                  typeClient: typeClient,
                  numeroFactura: search.numeroFactura,
                  concepto: search.concepto,
                  numPlacas: search.numPlacas !== '' ? search.numPlacas : 1,
                  ciudadPlaca: search.ciudadPlaca,
                  observations: 'La cédula ya se encontraba registrada en otra solicitud, se le informó al usuario y este continuó con el registro.'
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
                      const info3 = {
                        firmaEmpleado: sigFirmaEmpleado !== '' ? sigFirmaEmpleado : '',
                        impronta: (search.concepto === 'PERDIDA' || search.concepto === 'ROBO') ? photos.impronta : '',
                        productoDañado: search.concepto === 'DETERIORO' ? photos.productoDañado : '',
                      }
                      updateSolicitud(data.id, info3)
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
                  title:'¡CORREO INVALIDO!',
                  /* text:'Por favor ingresa por lo menos el número de cédula del propietario para llevar a cabo el registro de la solicitud.', */
                  text:'Revisa que el correo este bien escrito. Es importante que esté bien digilenciado este campo.',
                  showConfirmButton:true,
                  confirmButtonColor:'blue'
                })
              }
            }else{
              setLoading(false)
              Swal.fire({
                icon:'warning',
                title:'¡ATENCION!',
                /* text:'Por favor ingresa por lo menos el número de cédula del propietario para llevar a cabo el registro de la solicitud.', */
                text:'Por favor ingresa por lo menos los datos del propietario para llevar a cabo el registro de la solicitud.',
                showConfirmButton:true,
                confirmButtonColor:'blue'
              })
            }
          }
        }
      })
    }else{
      if(filtroPorPlaca.length > 0 && filtroPorPlaca[0].vin === search.vin && filtroPorPlaca[0].chasis === search.chasis){
        Swal.fire({
          title:'AVISO',
          text:`La placa: "${search.placa.toUpperCase()}" ya se encuentra registrada en nuestra base de datos
          con las fechas: ${devolverLista(filtroPorPlaca)}. ¿Desea continuar?`,
          showConfirmButton: true,
          showDenyButton: true,
          confirmButtonText: 'Si',
          confirmButtonColor:'green',
          denyButtonText: 'No',
        }).then(({isConfirmed, isDenied})=>{
          if(isConfirmed){
            setLoading(true)
            if(search.cedulaPropietario !== '' && search.primerApellidoPropietario !== '' &&
                search.segundoApellidoPropietario !== '' && search.primerNombrePropietario !== '' &&
                search.celularPropietario !== '' && search.correoPropietario !== '' && search.municipioPropietario !== '' &&
                search.placa !== '' && search.tipo !== '' && search.servicio !== '' && search.ciudadPlaca !== ''
            ){
              if(search.correoPropietario !=='' && search.correoPropietario.includes('@') && search.correoPropietario.split('@')[1].includes('.')){
                const body = {
                  cedulaPropietario: search.cedulaPropietario,
                  nombrePropietario: `${search.primerApellidoPropietario !== '' ? search.primerApellidoPropietario.toUpperCase():''} ${search.segundoApellidoPropietario !== '' ? search.segundoApellidoPropietario.toUpperCase():''} ${search.primerNombrePropietario !== '' ? search.primerNombrePropietario.toUpperCase():''} ${search.segundoNombrePropietario !== '' ? search.segundoNombrePropietario.toUpperCase():''}`,
                  primerApellidoPropietario: search.primerApellidoPropietario !== '' ? search.primerApellidoPropietario.toUpperCase():'' ,
                  segundoApellidoPropietario: search.segundoApellidoPropietario !== '' ? search.segundoApellidoPropietario.toUpperCase():'',
                  primerNombrePropietario: search.primerNombrePropietario !== '' ? search.primerNombrePropietario.toUpperCase():'',
                  segundoNombrePropietario: search.segundoNombrePropietario !== '' ? search.segundoNombrePropietario.toUpperCase():'',
          
                  direccionPropietario: search.direccionPropietario !== '' ? search.direccionPropietario.toUpperCase():'',
                  municipioPropietario: search.municipioPropietario !== '' ? search.municipioPropietario.toUpperCase():'',
                  celularPropietario: search.celularPropietario,
                  correoPropietario: search.correoPropietario !== '' ? search.correoPropietario.toLowerCase():'',
          
                  licenciaTransito: search.licenciaTransito,
                  vin: search.vin !== '' ? search.vin.toUpperCase():'',
                  chasis: search.chasis !== '' ? search.chasis.toUpperCase():'',
                  placaDesde: search.placa !== '' ? search.placa.toUpperCase():'',
                  /* placaHasta: search.placa !== '' ? search.placa.toUpperCase():'', */
                  marca: search.marca !== '' ? search.marca.toUpperCase():'',
                  tipo: search.tipo !== '' ? search.tipo.toUpperCase():'',
                  servicio: search.servicio !=='' ? search.servicio.toUpperCase():'',
          
                  cedulaPersonAuth: search.cedulaPersonAuth,
                  nombrePersonAuth: `${search.primerApellidoPersonAuth !== '' ? toString(search.primerApellidoPersonAuth).toUpperCase():''} ${search.segundoApellidoPersonAuth !== '' ? toString(search.segundoApellidoPersonAuth).toUpperCase():''} ${search.primerNombrePersonAuth !== '' ? toString(search.primerNombrePersonAuth).toUpperCase():''} ${search.segundoNombrePersonAuth !== '' ? toString(search.segundoNombrePersonAuth).toUpperCase():''}`,
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

                  //agregados en la segunda entrega
                  typeClient: typeClient,
                  numeroFactura: search.numeroFactura,
                  concepto: search.concepto,
                  numPlacas: search.numPlacas !== '' ? search.numPlacas : 1,
                  ciudadPlaca: search.ciudadPlaca,
                  observations: 'La placa ya se encontraban registrados al momento de hacer la solicitud (el número de chasis y número de vin SI COINCIDEN con el que ya estaba registrado), se le informó al usuario y este continuó con el registro.'
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
                      const info3 = {
                        firmaEmpleado: sigFirmaEmpleado !== '' ? sigFirmaEmpleado : '',
                        impronta: (search.concepto === 'PERDIDA' || search.concepto === 'ROBO') ? photos.impronta : '',
                        productoDañado: search.concepto === 'DETERIORO' ? photos.productoDañado : '',
                      }
                      updateSolicitud(data.id, info3)
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
                  title:'¡CORREO INVALIDO!',
                  /* text:'Por favor ingresa por lo menos el número de cédula del propietario para llevar a cabo el registro de la solicitud.', */
                  text:'Revisa que el correo este bien escrito. Es importante que esté bien digilenciado este campo.',
                  showConfirmButton:true,
                  confirmButtonColor:'blue'
                })
              }
            }else{
              setLoading(false)
              Swal.fire({
                icon:'warning',
                title:'¡ATENCION!',
                /* text:'Por favor ingresa por lo menos el número de cédula del propietario para llevar a cabo el registro de la solicitud.', */
                text:'Por favor ingresa por lo menos los datos del propietario para llevar a cabo el registro de la solicitud.',
                showConfirmButton:true,
                confirmButtonColor:'blue'
              })
            }
          }
          
        })
      }else if(filtroPorPlaca.length > 0 && (filtroPorPlaca[0].vin !== search.vin || filtroPorPlaca[0].chasis !== search.chasis)){
        Swal.fire({
          icon:'warning',
          title:'AVISO',
          text:`La placa: "${search.placa.toUpperCase()}" ya se encuentra registrada en nuestra base de datos,
          pero el número vin (Registrado: ${filtroPorPlaca[0].vin} - Actual: ${search.vin}) o 
          número de chasis (Registrado: ${filtroPorPlaca[0].chasis} - Actual: ${search.chasis}) es diferente. ¿Desea continuar?`,
          showConfirmButton: true,
          showDenyButton: true,
          confirmButtonText: 'Si',
          confirmButtonColor:'green',
          denyButtonText: 'No',
        }).then(({isConfirmed, isDenied})=>{
          if(isConfirmed){
            setLoading(true)
            if(search.cedulaPropietario !== '' && search.primerApellidoPropietario !== '' &&
                search.segundoApellidoPropietario !== '' && search.primerNombrePropietario !== '' &&
                search.celularPropietario !== '' && search.correoPropietario !== '' && search.municipioPropietario !== '' &&
                search.placa !== '' && search.tipo !== '' && search.servicio !== '' && search.ciudadPlaca !== ''
            ){
              if(search.correoPropietario !=='' && search.correoPropietario.includes('@') && search.correoPropietario.split('@')[1].includes('.')){
                const body = {
                  cedulaPropietario: search.cedulaPropietario,
                  nombrePropietario: `${search.primerApellidoPropietario !== '' ? search.primerApellidoPropietario.toUpperCase():''} ${search.segundoApellidoPropietario !== '' ? search.segundoApellidoPropietario.toUpperCase():''} ${search.primerNombrePropietario !== '' ? search.primerNombrePropietario.toUpperCase():''} ${search.segundoNombrePropietario !== '' ? search.segundoNombrePropietario.toUpperCase():''}`,
                  primerApellidoPropietario: search.primerApellidoPropietario !== '' ? search.primerApellidoPropietario.toUpperCase():'' ,
                  segundoApellidoPropietario: search.segundoApellidoPropietario !== '' ? search.segundoApellidoPropietario.toUpperCase():'',
                  primerNombrePropietario: search.primerNombrePropietario !== '' ? search.primerNombrePropietario.toUpperCase():'',
                  segundoNombrePropietario: search.segundoNombrePropietario !== '' ? search.segundoNombrePropietario.toUpperCase():'',
          
                  direccionPropietario: search.direccionPropietario !== '' ? search.direccionPropietario.toUpperCase():'',
                  municipioPropietario: search.municipioPropietario !== '' ? search.municipioPropietario.toUpperCase():'',
                  celularPropietario: search.celularPropietario,
                  correoPropietario: search.correoPropietario !== '' ? search.correoPropietario.toLowerCase():'',
          
                  licenciaTransito: search.licenciaTransito,
                  vin: search.vin !== '' ? search.vin.toUpperCase():'',
                  chasis: search.chasis !== '' ? search.chasis.toUpperCase():'',
                  placaDesde: search.placa !== '' ? search.placa.toUpperCase():'',
                  /* placaHasta: search.placa !== '' ? search.placa.toUpperCase():'', */
                  marca: search.marca !== '' ? search.marca.toUpperCase():'',
                  tipo: search.tipo !== '' ? search.tipo.toUpperCase():'',
                  servicio: search.servicio !=='' ? search.servicio.toUpperCase():'',
          
                  cedulaPersonAuth: search.cedulaPersonAuth,
                  nombrePersonAuth: `${search.primerApellidoPersonAuth !== '' ? toString(search.primerApellidoPersonAuth).toUpperCase():''} ${search.segundoApellidoPersonAuth !== '' ? toString(search.segundoApellidoPersonAuth).toUpperCase():''} ${search.primerNombrePersonAuth !== '' ? toString(search.primerNombrePersonAuth).toUpperCase():''} ${search.segundoNombrePersonAuth !== '' ? toString(search.segundoNombrePersonAuth).toUpperCase():''}`,
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

                  //agregados en la segunda entrega
                  typeClient: typeClient,
                  numeroFactura: search.numeroFactura,
                  concepto: search.concepto,
                  numPlacas: search.numPlacas !== '' ? search.numPlacas : 1,
                  ciudadPlaca: search.ciudadPlaca,
                  observations: 'La placa ya se encontraban registrados al momento de hacer la solicitud (el número de chasis y número de vin NO COINCIDEN con el que ya estaba registrado), se le informó al usuario y este continuó con el registro.'
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
                      const info3 = {
                        firmaEmpleado: sigFirmaEmpleado !== '' ? sigFirmaEmpleado : '',
                        impronta: (search.concepto === 'PERDIDA' || search.concepto === 'ROBO') ? photos.impronta : '',
                        productoDañado: search.concepto === 'DETERIORO' ? photos.productoDañado : '',
                      }
                      updateSolicitud(data.id, info3)
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
                  title:'¡CORREO INVALIDO!',
                  /* text:'Por favor ingresa por lo menos el número de cédula del propietario para llevar a cabo el registro de la solicitud.', */
                  text:'Revisa que el correo este bien escrito. Es importante que esté bien digilenciado este campo.',
                  showConfirmButton:true,
                  confirmButtonColor:'blue'
                })
              }
            }else{
              setLoading(false)
              Swal.fire({
                icon:'warning',
                title:'¡ATENCION!',
                /* text:'Por favor ingresa por lo menos el número de cédula del propietario para llevar a cabo el registro de la solicitud.', */
                text:'Por favor ingresa por lo menos los datos del propietario para llevar a cabo el registro de la solicitud.',
                showConfirmButton:true,
                confirmButtonColor:'blue'
              })
            }
          }
        })
      }else{
        setLoading(true)
        if(search.cedulaPropietario !== '' && search.primerApellidoPropietario !== '' &&
            search.segundoApellidoPropietario !== '' && search.primerNombrePropietario !== '' &&
            search.celularPropietario !== '' && search.correoPropietario !== '' && search.municipioPropietario !== '' &&
            search.placa !== '' && search.tipo !== '' && search.servicio !== '' && search.ciudadPlaca !== ''
        ){
          if(search.correoPropietario !=='' && search.correoPropietario.includes('@') && search.correoPropietario.split('@')[1].includes('.')){
            const body = {
              cedulaPropietario: search.cedulaPropietario,
              nombrePropietario: `${search.primerApellidoPropietario !== '' ? search.primerApellidoPropietario.toUpperCase():''} ${search.segundoApellidoPropietario !== '' ? search.segundoApellidoPropietario.toUpperCase():''} ${search.primerNombrePropietario !== '' ? search.primerNombrePropietario.toUpperCase():''} ${search.segundoNombrePropietario !== '' ? search.segundoNombrePropietario.toUpperCase():''}`,
              primerApellidoPropietario: search.primerApellidoPropietario !== '' ? search.primerApellidoPropietario.toUpperCase():'' ,
              segundoApellidoPropietario: search.segundoApellidoPropietario !== '' ? search.segundoApellidoPropietario.toUpperCase():'',
              primerNombrePropietario: search.primerNombrePropietario !== '' ? search.primerNombrePropietario.toUpperCase():'',
              segundoNombrePropietario: search.segundoNombrePropietario !== '' ? search.segundoNombrePropietario.toUpperCase():'',
      
              direccionPropietario: search.direccionPropietario !== '' ? search.direccionPropietario.toUpperCase():'',
              municipioPropietario: search.municipioPropietario !== '' ? search.municipioPropietario.toUpperCase():'',
              celularPropietario: search.celularPropietario,
              correoPropietario: search.correoPropietario !== '' ? search.correoPropietario.toLowerCase():'',
      
              licenciaTransito: search.licenciaTransito,
              vin: search.vin !== '' ? search.vin.toUpperCase():'',
              chasis: search.chasis !== '' ? search.chasis.toUpperCase():'',
              placaDesde: search.placa !== '' ? search.placa.toUpperCase():'',
              /* placaHasta: search.placa !== '' ? search.placa.toUpperCase():'', */
              marca: search.marca !== '' ? search.marca.toUpperCase():'',
              tipo: search.tipo !== '' ? search.tipo.toUpperCase():'',
              servicio: search.servicio !=='' ? search.servicio.toUpperCase():'',
      
              cedulaPersonAuth: search.cedulaPersonAuth,
              nombrePersonAuth: `${search.primerApellidoPersonAuth !== '' ? toString(search.primerApellidoPersonAuth).toUpperCase():''} ${search.segundoApellidoPersonAuth !== '' ? toString(search.segundoApellidoPersonAuth).toUpperCase():''} ${search.primerNombrePersonAuth !== '' ? toString(search.primerNombrePersonAuth).toUpperCase():''} ${search.segundoNombrePersonAuth !== '' ? toString(search.segundoNombrePersonAuth).toUpperCase():''}`,
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
    
              //agregados en la segunda entrega
              typeClient: typeClient,
              numeroFactura: search.numeroFactura,
              concepto: search.concepto,
              numPlacas: search.numPlacas !== '' ? search.numPlacas : 1,
              ciudadPlaca: search.ciudadPlaca,
              observations: ''

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
                  const info3 = {
                    firmaEmpleado: sigFirmaEmpleado !== '' ? sigFirmaEmpleado : '',
                    impronta: (search.concepto === 'PERDIDA' || search.concepto === 'ROBO') ? photos.impronta : '',
                    productoDañado: search.concepto === 'DETERIORO' ? photos.productoDañado : '',
                  }
                  updateSolicitud(data.id, info3)
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
              title:'¡CORREO INVALIDO!',
              /* text:'Por favor ingresa por lo menos el número de cédula del propietario para llevar a cabo el registro de la solicitud.', */
              text:'Revisa que el correo este bien escrito. Es importante que esté bien digilenciado este campo.',
              showConfirmButton:true,
              confirmButtonColor:'blue'
            })
          }
        }else{
          setLoading(false)
          Swal.fire({
            icon:'warning',
            title:'¡ATENCION!',
            /* text:'Por favor ingresa por lo menos el número de cédula del propietario para llevar a cabo el registro de la solicitud.', */
            text:'Por favor ingresa los datos requeridos para llevar a cabo el registro de la solicitud.',
            showConfirmButton:true,
            confirmButtonColor:'blue'
          })
        }
      }
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
      chasis:'',
      servicio:'',
      vin:'',
      concepto:'',
      numeroFactura: '',
      numPlacas:'',
      ciudadPlaca:'',
      observations:''
    })
    setSigImageFirma('')
    setShowModalMultiple(false);
    setShowModalFirma(false);
    setActiveField(null);
    setNameField(null);
    setPreviewPhoto(null);
    setShowModal(false);
    setShowModalFirmaEmpleado(false);
    setSigFirmaEmpleado('');
    setPhotos({
      photoUser: null,
      frontCp: null,
      backCp: null,
      frontTp: null,
      backTp: null,
      frontCauth: null,
      backCauth: null,
      impronta: null,
      productoDañado: null,
    })
    setTypeClient('propietario')
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

  //funcion para que cuando se cambie de input se ejecute 
  const handleInputBlur = () => {
    if(search.cedulaPropietario.length >= 8){
      const filtroCliente = clientes.filter((item)=>{
        if(item.cedulaPropietario === search.cedulaPropietario){
          return item
        }
      })
      if(filtroCliente.length > 0){
        Swal.fire({
          icon:'warning',
          title:'¡ATENCIÓN!',
          text:`El numero de identificación: ${search.cedulaPropietario},
          se encuentra registrado en nuestra base de datos 
          en las siguientes fechas: 
          ${devolverLista(filtroCliente)}.`,
          showConfirmButton:true,
          confirmButtonColor:'green',
          confirmButtonText:'OK',
        })
      }
    }else{
      Swal.fire({
        icon:'warning',
        title:'Recuerda que el NIT debe contener 9 caracteres',
        confirmButtonColor:'#D92121',
        confirmButtonText:'OK'
      })
    }
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
      {/* formulario */}
      <div
        className="container d-flex flex-column w-100 py-3 bg-light border border-2"
        style={{ fontSize: 10.5 , border:'5px solid #E5BE01', boxShadow:'0 0 0 5px black' }}
      >
        <section className="d-flex flex-row justify-content-center align-items-center mb-2 mt-5 pt-2">
          <div className="d-flex flex-column align-items-center">
            <h1 className="fs-5 fw-bold ">ASUNTO: <label>DECLARACIÓN JURAMENTADA</label></h1>
            <h1 className="text-center fs-6 fw-bold">Documento Solicitud Copia Placa(s) Vehiculares</h1>
            <h1 className="text-center fs-6 fw-bold">INGSE S.A.S</h1>
          </div>
        </section>
        <form className="" >
          <div className="bg-light rounded shadow-sm p-3 mb-3">
            <div className="d-flex flex-column gap-1">
              {/* informacion básica de la solicitud */}
              <div className="d-flex flex-column gap-1 mt-1">
                <div>
                  <h6 className="fw-bold">Información básica de la solicitud:</h6>
                  <div className="row row-cols-sm-5">
                    <div className="d-flex flex-column align-items-start">
                      <label>No. de factura:</label>
                      <input
                        id="numeroFactura"
                        value={search.numeroFactura}
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
                      <label>Fecha de la solicitud:</label>
                      <input
                          id=""
                          value={formatDate(new Date())}                          
                          type="date"
                          disabled
                          className="form-control form-control-sm"
                          autoComplete="off"
                          style={{textTransform:'uppercase'}}
                        />
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <label>Concepto de la solicitud:</label>
                      <select
                        className="form-select form-select-sm w-100"
                        value={search.concepto}
                        id="concepto"
                        onChange={(e) => handleChangeConcepto(e)}
                      >
                        <option selected value="" disabled>
                          -- Seleccione el concepto de la solicitud --
                        </option>
                        <option id="NUEVA" value="NUEVA">
                          NUEVA
                        </option>
                        <option id="DETERIORO" value="DETERIORO">
                        DETERIORO
                        </option>
                        <option id="PERDIDA" value="PERDIDA">
                          PERDIDA
                        </option>
                        <option id="ROBO" value="ROBO">
                          ROBO
                        </option>
                      </select>
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <label>No. placas del pedido:</label>
                      <input
                        id="numPlacas"
                        value={search.numPlacas}
                        type="number"
                        min="1"
                        max="3"
                        className="form-control form-control-sm"
                        autoComplete="off"
                        disabled = {(search.concepto === 'NUEVA' && search.tipo === 'AUTOMOVILES') || (search.concepto === 'NUEVA' && search.tipo === 'TRACTOMULA')}
                        /* onChange={(e) => {
                          handlerChangeSearch(e);
                        }} */
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value, 10);
                          if (newValue >= 1 && newValue <= 3) {
                            setSearch({
                              ...search,
                              numPlacas: newValue
                            });
                          } else if (e.target.value === '') {
                            setSearch({
                              ...search,
                              numPlacas: ''
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="d-flex flex-column align-items-center">
                      <label className="me-3" style={{fontSize:11}}>Tipo de usuario</label>
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
                </div>
                <hr className="my-1" />
              </div>
              {/* informacion del propietario */}
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
                        /* handlerChangeSearch(e); */
                        handleCedula(e)
                      }}
                      /* onBlur={handleInputBlur} */
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
                        required
                        placeholder="*Campo obligatorio*"
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
                        required
                        placeholder="*Campo obligatorio*"
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
                        required
                        placeholder="*Campo obligatorio*"
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
                      required
                      placeholder="*Campo obligatorio*"
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
                        required
                        placeholder="*Campo obligatorio*"
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
                        handleMaxCel(e);
                      }}
                      required
                        placeholder="*Campo obligatorio*"
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
                      required
                        placeholder="*Campo obligatorio*"
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
                            required
                            placeholder="*CAMPO OBLIGATORIO*"
                          />
                      </div>
                      <div className="d-flex flex-column align-items-start">
                        <label>No. Vin:</label>
                        <input
                          id="vin"
                          value={search.vin}
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
                        <label>No. Chasis:</label>
                        <input
                          id="chasis"
                          value={search.chasis}
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
                    <div className="row row-cols-sm-4 mt-1">
                      <div className="d-flex flex-column align-items-start">
                        <label>Ciudad de la placa:</label>
                        <input
                          id="ciudadPlaca"
                          value={search.ciudadPlaca}
                          type="text"
                          className="form-control form-control-sm"
                          autoComplete="off"
                          onChange={(e) => {
                            handlerChangeSearch(e);
                          }}
                          style={{textTransform:'uppercase'}}
                          required
                          placeholder="*CAMPO OBLIGATORIO*"
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
                        <label>Tipo vehículo:</label>
                        <select
                          className="form-select form-select-sm w-100"
                          value={search.tipo}
                          id="tipo"
                          required
                          onChange={(e) => handleChangeTipo(e)}
                        >
                          <option selected value="" disabled>
                            -- Seleccione el tipo vehículo --
                          </option>
                          <option id="AUTOMOVILES" value="AUTOMOVILES">
                            AUTOMOVILES
                          </option>
                          <option id="MOTOCICLETAS" value="MOTOCICLETAS">
                            MOTOCICLETAS
                          </option>
                          <option id="MOTOCARRO" value="MOTOCARRO">
                            MOTOCARRO
                          </option>
                          <option id="TRACTOMULA" value="TRACTOMULA">
                            TRACTOMULA
                          </option>
                        </select>
                        {/* <input
                            id="tipo"
                            value={search.tipo}
                            type="text"
                            className="form-control form-control-sm"
                            autoComplete="off"
                            onChange={(e) => {
                              handlerChangeSearch(e);
                            }}
                            style={{textTransform:'uppercase'}}
                          /> */}
                      </div>
                      <div className="d-flex flex-column align-items-start">
                        <label>Servicio:</label>
                        <select
                          className="form-select form-select-sm w-100"
                          value={search.servicio}
                          id="servicio"
                          required
                          onChange={(e) => handlerChangeSearch(e)}
                        >
                          <option selected value="" disabled>
                            -- Seleccione el servicio del vehículo --
                          </option>
                          <option id="PARTICULAR" value="PARTICULAR">
                            PARTICULAR
                          </option>
                          <option id="PÚBLICO" value="PÚBLICO">
                            PÚBLICO
                          </option>
                          <option id="DIPLOMÁTICO - CONSULAR" value="DIPLOMÁTICO - CONSULAR">
                            DIPLOMÁTICO - CONSULAR
                          </option>
                          <option id="ANTIGUO - CLÁSICO" value="ANTIGUO - CLÁSICO">
                            ANTIGUO - CLÁSICO
                          </option>
                        </select>
                        {/* <input
                            id="servicio"
                            value={search.servicio}
                            type="text"
                            className="form-control form-control-sm"
                            autoComplete="off"
                            onChange={(e) => {
                              handlerChangeSearch(e);
                            }}
                            style={{textTransform:'uppercase'}}
                          /> */}
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
                          handleCedula(e);
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
                          handleMaxCel(e);
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
            <h6 className="fw-bold ms-5 me-5">Archivos Adjuntos:</h6>
            {/* Foto de la cedula */}
            <div className="row row-cols-sm-2 ms-5 me-5">
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
                    borderRadius:25,
                    alignContent:'center'
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
            <div className="row row-cols-sm-2 mt-2 ms-5 me-5">
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
              <div className="row row-cols-sm-2 mt-2 ms-5 me-5">
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
            <div className="row row-cols-sm-2 mt-2 ms-5 me-5">
              <div>
                <div className="d-flex flex-column align-items-start">
                  <label style={{fontSize:12}} className="w-100 d-flex test-center">Firma del solicitante:</label>
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

            {/* Firma del empleado y foto dependiendo si es por perdida, robo o DETERIORO */}
            <div className="row row-cols-sm-2 mt-2 ms-5 me-5">
              <div>
                <div className="d-flex flex-column align-items-start">
                  <label style={{fontSize:12}} className="w-100 d-flex test-center">Firma del empleado:</label>
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
                    onClick={() => setShowModalFirmaEmpleado(true)}
                  >
                    {sigFirmaEmpleado ? (
                        <img 
                          ref={ImgFirmEmpleadoRef}
                          src={`data:image/png;base64,${sigFirmaEmpleado}`} 
                          alt="FirmaEmpleado" 
                          style={{ width: "100%", height: "100%"}} 
                        />
                      ):"Haz Click aquí para hacer la firma"
                    }
                  </div>
                </div>
              </div>
              {(search.concepto === 'PERDIDA' || search.concepto === 'ROBO') && (
                <div className="d-flex flex-column align-items-start">
                  <label style={{fontSize:12}}>Foto de la impronta del vehículo:</label>
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
                      onClick={() => openModal("impronta","Impronta del vehículo")}
                    >
                      {photos.impronta ? (
                        <img 
                          src={photos.impronta} 
                          alt="impronta" 
                          style={{ width: "100%", height: "100%"}} 
                        />
                      ):"Haz Click aquí para tomar la foto"}
                  </div>
                </div>
              )}
              {(search.concepto === 'DETERIORO') && (
                <div className="d-flex flex-column align-items-start">
                  <label style={{fontSize:12}}>Foto del producto dañado:</label>
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
                      onClick={() => openModal("productoDañado","Evidencia del producto dañado")}
                    >
                      {photos.productoDañado ? (
                        <img 
                          src={photos.productoDañado} 
                          alt="productoDañado" 
                          style={{ width: "100%", height: "100%"}} 
                        />
                      ):"Haz Click aquí para tomar la foto"}
                  </div>
                </div>
              )}
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
          <SigWebDemoEmpleado
            sigImage={sigFirmaEmpleado}
            setSigImage={setSigFirmaEmpleado}
            canvasRef={firmaEmpleadoRef}
            showModal={showModalFirmaEmpleado}
            setShowModal={setShowModalFirmaEmpleado}
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
