import { useEffect, useState, useContext, useRef , Component } from "react";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { Link , useNavigate , useParams } from "react-router-dom";
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
import { findOneSolicitud, updateSolicitud } from "../../services/solicitudService";
import "./styles.css";
import SigWebDemoEmpleado from "../../components/ModalFirmaEmpleado";
import { TbReportSearch } from "react-icons/tb";
import { findSolicitudes } from "../../services/solicitudService";
import { FcDataBackup } from "react-icons/fc";
import ModalBackUpBD from "../../components/ModalBackUpBD";
import { FaListOl } from "react-icons/fa6";
import { FingerprintSdk } from '../../fingerprint_reader/api/sdk_mod';

/* logica de la huella */
class Huella extends Component {
  state = {}
  foto = ''

  componentDidMount() {
    const Fingerprint = new FingerprintSdk()
    this.setState({ Fingerprint },
      () => {
        this.state.Fingerprint.getDeviceList()
        .then(devices => this.setState({ deviceId: devices[0] }), error => console.log(error))
      }
    )
  }

  clearImage() {
    let vDiv = document.getElementById('imagediv')
    if(vDiv){
      vDiv.innerHTML = ""
    }
    localStorage.setItem("imageSrc", "")
  } 

  startCapturing = () => {
    /* this.state.Fingerprint.startCapture() */
    localStorage.setItem("imageSrc", "")
    this.setState(
      ()  => {
        this.state.Fingerprint.startCapture()
        Swal.fire({
          title:'Lector de huella',
          text:'Coloca el dedo en el lector para poder leerlo y presiona capturar.',
          showCancelButton:false,
          showConfirmButton:true,
          confirmButtonText:'Capturar',
          confirmButtonColor:'green'
        }).then(({isConfirmed})=>{
          if(isConfirmed){
            if(localStorage.getItem('imageSrc') ){
              this.foto = `${localStorage.getItem('imageSrc')}`
              this.state.Fingerprint.stopCapture()
              Swal.fire({
                title:'Excelente',
                text:'Captura de huella exitosa',
                showCancelButton:false,
                showConfirmButton:false,
                timer:5000
              })
              this.setState({ status: 'success' })     
            }else{
              this.state.Fingerprint.stopCapture()
              this.setState({ status: 'error' })
              Swal.fire({
                icon:'warning',
                title:'¡ERROR',
                text:'Hubo un error al momento de leer la huella. Vuelve a intentarlo. si el problema persiste comunícate con los programadores para darte una oportuna y rápida solucion.',
                showCancelButton:false,
                showConfirmButton:false,
                timer:5000
              })
            }
          }
        })
      }
    )
    }

  stopCapturing = () => {
    this.state.Fingerprint.stopCapture()
  }

  getInfo = () => {
    this.state.Fingerprint.getDeviceList()
    .then(devices => this.setState({ deviceId: devices[0] }), error => console.log(error))
    
    console.log(this.state.Fingerprint)
  }

  onImageDownload = () => {
    if(localStorage.getItem("imageSrc") === "" || localStorage.getItem("imageSrc") === null || document.getElementById('imagediv').innerHTML === ""  ){
      alert("No image to download");
    }else{
      //alert(localStorage.getItem("imageSrc"));
      this.state.Fingerprint.stopCapture()
      downloadURI(localStorage.getItem("imageSrc"), "huella.png", "image/png");
    }
  }

  render() {
    const { deviceId } = this.state

    const connected = deviceId !== "" ? `Conectado a ${deviceId}` : "No hay lectores de huella conectados"

    return (
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
          id='start'
          onClick={this.startCapturing}
        >
          {this.foto !== '' ? (
            <img
              className="w-75"
              src={`${this.foto}`} 
              style={{width:'100%', height:195, borderRadius:25}}
            />
            ):(
            "Haz Click aquí activar el lector de huella"
          )}
      </div>
    )
  }
}

function downloadURI(uri, name, dataURIType) {
  if (IeVersionInfo() > 0) {
    //alert("This is IE " + IeVersionInfo())
    const blob = dataURItoBlob(uri,dataURIType)
    window.navigator.msSaveOrOpenBlob(blob, name)
  } else {
    //alert("This is not IE.");
    let save = document.createElement('a')
    save.href = uri
    save.download = name
    let event = document.createEvent("MouseEvents")
      event.initMouseEvent(
        "click", true, false, window, 0, 0, 0, 0, 0
        , false, false, false, false, 0, null
      )
    save.dispatchEvent(event)
  }
}

function dataURItoBlob (dataURI, dataURIType) {
  const binary = atob(dataURI.split(',')[1])
  let array = []
  for(let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i))
  }
  return new Blob([new Uint8Array(array)], {type: dataURIType})
}

function IeVersionInfo() {
  const sAgent = window.navigator.userAgent
  const IEVersion = sAgent.indexOf("MSIE")

  // If IE, return version number.
  if (IEVersion > 0) 
    return parseInt(sAgent.substring(IEVersion+ 5, sAgent.indexOf(".", IEVersion)), 10)

  // If IE 11 then look for Updated user agent string.
  else if (!!navigator.userAgent.match(/Trident\/7\./)) 
    return 11

  // Quick and dirty test for Microsoft Edge
  else if (document.documentMode || /Edge/.test(navigator.userAgent))
    return 12

  else
    return 0 //If not IE return 0
}

export default function EditarRegistro() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(()=>{
    findOneSolicitud(id)
    .then(({data})=>{
      setSearch(data)
      setPhotos({
        ...photos,
        fotoUsuario:data.fotoUsuario,
        cedulaPropietarioFrontal:data.cedulaPropietarioFrontal,
        cedulaPropietarioTrasera:data.cedulaPropietarioTrasera,
        tarjetaPropiedadFrontal:data.tarjetaPropiedadFrontal,
        tarjetaPropiedadTrasera:data.tarjetaPropiedadTrasera,
        cedulaPersonAuthFrontal:data.cedulaPersonAuthFrontal,
        cedulaPersonAuthTrasera:data.cedulaPersonAuthTrasera,
        huella: data.huella,
      })
      setSigImageFirma(data.firma)
      setSigFirmaEmpleado(data.firmaEmpleado)
    })
    .catch(()=>{
      Swal.fire({
        icon:'error',
        title:'¡ERROR!',
        text:'Ha ocurrido un error al momento de cargar la información de la solicitud para editarla. vuelve a intentarlo mas tarde.',
        confirmButtonColor:'red'
      })
      .then(()=>{
        navigate('/registros')
      })
    })
  },[])

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

  const { logout } = useUser();
  const [showSideBar, setShowSidebar] = useState(false);
  const [ruta, setRuta] = useState('');
  const { user } = useContext(AuthContext);
  const [showModalMultiple, setShowModalMultiple] = useState(false);
  const [sigImageFirma, setSigImageFirma] = useState("");
  const [sigFirmaEmpleado, setSigFirmaEmpleado] = useState("");
  const [showModalFirmaEmpleado, setShowModalFirmaEmpleado] = useState(false);
  const [clientes, setClientes] = useState();
  const [modalBackUp, setModalBackUp] = useState(false);
  const [showModalFirma, setShowModalFirma] = useState(false);
  const [search, setSearch] = useState({});

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
    fotoUsuario: null,
    cedulaPropietarioFrontal: null,
    cedulaPropietarioTrasera: null,
    tarjetaPropiedadFrontal: null,
    tarjetaPropiedadTrasera: null,
    cedulaPersonAuthFrontal: null,
    cedulaPersonAuthTrasera: null,
    productoDañado: null,
    impronta: null,
    huella: null,
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
      if(item.placaDesde === search.placaDesde.toUpperCase()){
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
              text:`La placa: "${search.placaDesde.toUpperCase()}" ya se encuentra registrada en nuestra base de datos
              con las fechas: ${devolverLista(filtroPorPlaca)}. ¿Desea continuar?`,
              showConfirmButton: true,
              showDenyButton: true,
              confirmButtonText: 'Si',
              confirmButtonColor:'green',
              denyButtonText: 'No',
            }).then(({isConfirmed, isDenied})=>{
              if(isConfirmed){
                setLoading(true)
                if(search.cedulaPropietario !== null && search.primerApellidoPropietario !== null &&
                  search.segundoApellidoPropietario !== null && search.primerNombrePropietario !== null &&
                  search.celularPropietario !== null && search.correoPropietario !== null && search.municipioPropietario !== null &&
                  search.placaDesde !== null && search.tipo !== null && search.servicio !== null && search.ciudadPlaca !== null
                ){
                  if(search.correoPropietario !==null && search.correoPropietario.includes('@') && search.correoPropietario.split('@')[1].includes('.')){
                    const body = {
                      cedulaPropietario: search.cedulaPropietario,
                      nombrePropietario: `${search.primerApellidoPropietario !== null ? search.primerApellidoPropietario.toUpperCase():''} ${search.segundoApellidoPropietario !== '' ? search.segundoApellidoPropietario.toUpperCase():''} ${search.primerNombrePropietario !== '' ? search.primerNombrePropietario.toUpperCase():''} ${search.segundoNombrePropietario !== '' ? search.segundoNombrePropietario.toUpperCase():''}`,
                      primerApellidoPropietario: search.primerApellidoPropietario !== null ? search.primerApellidoPropietario.toUpperCase():'' ,
                      segundoApellidoPropietario: search.segundoApellidoPropietario !== null ? search.segundoApellidoPropietario.toUpperCase():'',
                      primerNombrePropietario: search.primerNombrePropietario !== null ? search.primerNombrePropietario.toUpperCase():'',
                      segundoNombrePropietario: search.segundoNombrePropietario !== null ? search.segundoNombrePropietario.toUpperCase():'',
              
                      direccionPropietario: search.direccionPropietario !== null ? search.direccionPropietario.toUpperCase():'',
                      municipioPropietario: search.municipioPropietario !== null ? search.municipioPropietario.toUpperCase():'',
                      celularPropietario: search.celularPropietario,
                      correoPropietario: search.correoPropietario !== null ? search.correoPropietario.toLowerCase():'',
              
                      licenciaTransito: search.licenciaTransito,
                      placaDesde: search.placaDesde !== null ? search.placaDesde.toUpperCase():'',
                      vin: search.vin !== null ? search.vin.toUpperCase():'',
                      chasis: search.chasis !== null ? search.chasis.toUpperCase():'',
                      marca: search.marca !== null ? search.marca.toUpperCase():'',
                      tipo: search.tipo !== null ? search.tipo.toUpperCase():'',
                      servicio: search.servicio !==null ? search.servicio.toUpperCase():'',
                      
                      cedulaPersonAuth: search.cedulaPersonAuth,
                      nombrePersonAuth: `${search.primerApellidoPersonAuth !== null ? toString(search.primerApellidoPersonAuth).toUpperCase():''} ${search.segundoApellidoPersonAuth !== '' ? toString(search.segundoApellidoPersonAuth).toUpperCase():''} ${search.primerNombrePersonAuth !== '' ? toString(search.primerNombrePersonAuth).toUpperCase():''} ${search.segundoNombrePersonAuth !== '' ? toString(search.segundoNombrePersonAuth).toUpperCase():''}`,
                      primerApellidoPersonAuth: search.primerApellidoPersonAuth !== null ? search.primerApellidoPersonAuth.toUpperCase():'',
                      segundoApellidoPersonAuth: search.segundoApellidoPersonAuth !== null ? search.segundoApellidoPersonAuth.toUpperCase():'',
                      primerNombrePersonAuth: search.primerNombrePersonAuth !== null ? search.primerNombrePersonAuth.toUpperCase():'',
                      segundoNombrePersonAuth: search.segundoNombrePersonAuth !== null ? search.segundoNombrePersonAuth.toUpperCase():'',
              
                      direccionPersonAuth: search.direccionPersonAuth !== null ? search.direccionPersonAuth.toUpperCase():'',
                      municipioPersonAuth: search.municipioPersonAuth !== null ? search.municipioPersonAuth.toUpperCase():'',
                      celularPersonAuth: search.celularPersonAuth,
                      correoPersonAuth: search.correoPersonAuth !== null ? search.correoPersonAuth.toLowerCase():'',
                
                      fotoUsuario: photos.fotoUsuario,
                      cedulaPropietarioFrontal: photos.cedulaPropietarioFrontal,
                      cedulaPropietarioTrasera: photos.cedulaPropietarioTrasera,
      
                      //agregados en la segunda entrega
                      typeClient: typeClient,
                      numeroFactura: search.numeroFactura,
                      concepto: search.concepto,
                      numPlacas: search.numPlacas !== null ? search.numPlacas : 1,
                      ciudadPlaca: search.ciudadPlaca.toUpperCase(),
                      observations: 'La cédula y la placa ya se encontraban registrados al momento de hacer la solicitud (el número de chasis y número de vin SI COINCIDEN con el que ya estaba registrado), se le informó al usuario y este continuó con el registro.'

                    }
                    updateSolicitud(id, body)
                    .then(()=>{
                      const info = {
                        tarjetaPropiedadFrontal: photos.tarjetaPropiedadFrontal,
                        tarjetaPropiedadTrasera: photos.tarjetaPropiedadTrasera,
                        cedulaPersonAuthFrontal: photos.cedulaPersonAuthFrontal,
                      }
                      updateSolicitud(id,info)
                      .then(()=>{
                        const info2 = {
                          cedulaPersonAuthTrasera: photos.cedulaPersonAuthTrasera,
                          huella: localStorage.getItem('imageSrc') ? localStorage.getItem('imageSrc') : photos.huella,
                          firma: sigImageFirma !== null ? sigImageFirma : '',
                        }
                        updateSolicitud(id,info2)
                        .then(()=>{
                          setLoading(false)
                          handleClear()
                          Swal.fire({
                            title:'¡FELICIDADES!',
                            text:'Se ha editado el editado la solicitud de forma exitosa',
                            showConfirmButton:true,
                            showCancelButton:false,
                            confirmButtonColor:'green'
                          })
                          .then(()=>{
                            navigate('/registros')
                          })
                        }) .catch(()=>{
                          setLoading(false)
                          Swal.fire({
                            title:'¡ERROR!',
                            text:'Ha ocurrido un error al momento de hacer la edición del registro de la solicitud. Vuelve a intentarlo mas tarde.',
                            showConfirmButton:true,
                            showCancelButton:false,
                            confirmButtonColor:'red'
                          })
                        })
                      }).catch(()=>{
                        setLoading(false)
                        Swal.fire({
                          title:'¡ERROR!',
                          text:'Ha ocurrido un error al momento de hacer la edición del registro de la solicitud. Vuelve a intentarlo mas tarde.',
                          showConfirmButton:true,
                          showCancelButton:false,
                          confirmButtonColor:'red'
                        })
                      })
                    })
                    .catch(()=>{
                      setLoading(false)
                      Swal.fire({
                        title:'¡ERROR!',
                        text:'Ha ocurrido un error al momento de hacer la edición del registro de la solicitud. Vuelve a intentarlo mas tarde.',
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
                    text:'Por favor ingresa por lo menos los datos del propietario para llevar a cabo el registro de la solicitud.',
                    showConfirmButton:true,
                    showCancelButton:false,
                    confirmButtonColor:'blue'
                  })
                }
              }
            })
          }else if(filtroPorPlaca.length > 0 && (filtroPorPlaca[0].vin !== search.vin || filtroPorPlaca[0].chasis !== search.chasis)){
            Swal.fire({
              icon:'warning',
              title:'AVISO',
              text:`La placa: "${search.placaDesde.toUpperCase()}" ya se encuentra registrada en nuestra base de datos,
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
                if(search.cedulaPropietario !== null && search.primerApellidoPropietario !== null &&
                  search.segundoApellidoPropietario !== null && search.primerNombrePropietario !== null &&
                  search.celularPropietario !== null && search.correoPropietario !== null && search.municipioPropietario !== null &&
                  search.placaDesde !== null && search.tipo !== null && search.servicio !== null && search.ciudadPlaca !== null
                ){
                  if(search.correoPropietario !==null && search.correoPropietario.includes('@') && search.correoPropietario.split('@')[1].includes('.')){
                    const body = {
                      cedulaPropietario: search.cedulaPropietario,
                      nombrePropietario: `${search.primerApellidoPropietario !== null ? search.primerApellidoPropietario.toUpperCase():''} ${search.segundoApellidoPropietario !== '' ? search.segundoApellidoPropietario.toUpperCase():''} ${search.primerNombrePropietario !== '' ? search.primerNombrePropietario.toUpperCase():''} ${search.segundoNombrePropietario !== '' ? search.segundoNombrePropietario.toUpperCase():''}`,
                      primerApellidoPropietario: search.primerApellidoPropietario !== null ? search.primerApellidoPropietario.toUpperCase():'' ,
                      segundoApellidoPropietario: search.segundoApellidoPropietario !== null ? search.segundoApellidoPropietario.toUpperCase():'',
                      primerNombrePropietario: search.primerNombrePropietario !== null ? search.primerNombrePropietario.toUpperCase():'',
                      segundoNombrePropietario: search.segundoNombrePropietario !== null ? search.segundoNombrePropietario.toUpperCase():'',
              
                      direccionPropietario: search.direccionPropietario !== null ? search.direccionPropietario.toUpperCase():'',
                      municipioPropietario: search.municipioPropietario !== null ? search.municipioPropietario.toUpperCase():'',
                      celularPropietario: search.celularPropietario,
                      correoPropietario: search.correoPropietario !== null ? search.correoPropietario.toLowerCase():'',
              
                      licenciaTransito: search.licenciaTransito,
                      placaDesde: search.placaDesde !== null ? search.placaDesde.toUpperCase():'',
                      vin: search.vin !== null ? search.vin.toUpperCase():'',
                      chasis: search.chasis !== null ? search.chasis.toUpperCase():'',
                      marca: search.marca !== null ? search.marca.toUpperCase():'',
                      tipo: search.tipo !== null ? search.tipo.toUpperCase():'',
                      servicio: search.servicio !==null ? search.servicio.toUpperCase():'',
                      
                      cedulaPersonAuth: search.cedulaPersonAuth,
                      nombrePersonAuth: `${search.primerApellidoPersonAuth !== null ? toString(search.primerApellidoPersonAuth).toUpperCase():''} ${search.segundoApellidoPersonAuth !== '' ? toString(search.segundoApellidoPersonAuth).toUpperCase():''} ${search.primerNombrePersonAuth !== '' ? toString(search.primerNombrePersonAuth).toUpperCase():''} ${search.segundoNombrePersonAuth !== '' ? toString(search.segundoNombrePersonAuth).toUpperCase():''}`,
                      primerApellidoPersonAuth: search.primerApellidoPersonAuth !== null ? search.primerApellidoPersonAuth.toUpperCase():'',
                      segundoApellidoPersonAuth: search.segundoApellidoPersonAuth !== null ? search.segundoApellidoPersonAuth.toUpperCase():'',
                      primerNombrePersonAuth: search.primerNombrePersonAuth !== null ? search.primerNombrePersonAuth.toUpperCase():'',
                      segundoNombrePersonAuth: search.segundoNombrePersonAuth !== null ? search.segundoNombrePersonAuth.toUpperCase():'',
              
                      direccionPersonAuth: search.direccionPersonAuth !== null ? search.direccionPersonAuth.toUpperCase():'',
                      municipioPersonAuth: search.municipioPersonAuth !== null ? search.municipioPersonAuth.toUpperCase():'',
                      celularPersonAuth: search.celularPersonAuth,
                      correoPersonAuth: search.correoPersonAuth !== null ? search.correoPersonAuth.toLowerCase():'',
                
                      fotoUsuario: photos.fotoUsuario,
                      cedulaPropietarioFrontal: photos.cedulaPropietarioFrontal,
                      cedulaPropietarioTrasera: photos.cedulaPropietarioTrasera,
      
                      //agregados en la segunda entrega
                      typeClient: typeClient,
                      numeroFactura: search.numeroFactura,
                      concepto: search.concepto,
                      numPlacas: search.numPlacas !== null ? search.numPlacas : 1,
                      ciudadPlaca: search.ciudadPlaca.toUpperCase(),
                      observations: 'La cédula y la placa ya se encontraban registrados al momento de hacer la solicitud (el número de chasis y número de vin SI COINCIDEN con el que ya estaba registrado), se le informó al usuario y este continuó con el registro.'

                    }
                    updateSolicitud(id, body)
                    .then(()=>{
                      const info = {
                        tarjetaPropiedadFrontal: photos.tarjetaPropiedadFrontal,
                        tarjetaPropiedadTrasera: photos.tarjetaPropiedadTrasera,
                        cedulaPersonAuthFrontal: photos.cedulaPersonAuthFrontal,
                      }
                      updateSolicitud(id,info)
                      .then(()=>{
                        const info2 = {
                          cedulaPersonAuthTrasera: photos.cedulaPersonAuthTrasera,
                          huella: localStorage.getItem('imageSrc') ? localStorage.getItem('imageSrc') : photos.huella,
                          firma: sigImageFirma !== '' ? sigImageFirma : '',
                        }
                        updateSolicitud(id,info2)
                        .then(()=>{
                          setLoading(false)
                          handleClear()
                          Swal.fire({
                            title:'¡FELICIDADES!',
                            text:'Se ha editado el editado la solicitud de forma exitosa',
                            showConfirmButton:true,
                            showCancelButton:false,
                            confirmButtonColor:'green'
                          })
                          .then(()=>{
                            navigate('/registros')
                          })
                        }) .catch(()=>{
                          setLoading(false)
                          Swal.fire({
                            title:'¡ERROR!',
                            text:'Ha ocurrido un error al momento de hacer la edición del registro de la solicitud. Vuelve a intentarlo mas tarde.',
                            showConfirmButton:true,
                            showCancelButton:false,
                            confirmButtonColor:'red'
                          })
                        })
                      }).catch(()=>{
                        setLoading(false)
                        Swal.fire({
                          title:'¡ERROR!',
                          text:'Ha ocurrido un error al momento de hacer la edición del registro de la solicitud. Vuelve a intentarlo mas tarde.',
                          showConfirmButton:true,
                          showCancelButton:false,
                          confirmButtonColor:'red'
                        })
                      })
                    })
                    .catch(()=>{
                      setLoading(false)
                      Swal.fire({
                        title:'¡ERROR!',
                        text:'Ha ocurrido un error al momento de hacer la edición del registro de la solicitud. Vuelve a intentarlo mas tarde.',
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
                    text:'Por favor ingresa por lo menos los datos del propietario para llevar a cabo el registro de la solicitud.',
                    showConfirmButton:true,
                    showCancelButton:false,
                    confirmButtonColor:'blue'
                  })
                }
              }
            })
          }else{
            setLoading(true)
            if(search.cedulaPropietario !== null && search.primerApellidoPropietario !== null &&
                  search.segundoApellidoPropietario !== null && search.primerNombrePropietario !== null &&
                  search.celularPropietario !== null && search.correoPropietario !== null && search.municipioPropietario !== null &&
                  search.placaDesde !== null && search.tipo !== null && search.servicio !== null && search.ciudadPlaca !== null
                ){
                  if(search.correoPropietario !==null && search.correoPropietario.includes('@') && search.correoPropietario.split('@')[1].includes('.')){
                    const body = {
                      cedulaPropietario: search.cedulaPropietario,
                      nombrePropietario: `${search.primerApellidoPropietario !== null ? search.primerApellidoPropietario.toUpperCase():''} ${search.segundoApellidoPropietario !== '' ? search.segundoApellidoPropietario.toUpperCase():''} ${search.primerNombrePropietario !== '' ? search.primerNombrePropietario.toUpperCase():''} ${search.segundoNombrePropietario !== '' ? search.segundoNombrePropietario.toUpperCase():''}`,
                      primerApellidoPropietario: search.primerApellidoPropietario !== null ? search.primerApellidoPropietario.toUpperCase():'' ,
                      segundoApellidoPropietario: search.segundoApellidoPropietario !== null ? search.segundoApellidoPropietario.toUpperCase():'',
                      primerNombrePropietario: search.primerNombrePropietario !== null ? search.primerNombrePropietario.toUpperCase():'',
                      segundoNombrePropietario: search.segundoNombrePropietario !== null ? search.segundoNombrePropietario.toUpperCase():'',
              
                      direccionPropietario: search.direccionPropietario !== null ? search.direccionPropietario.toUpperCase():'',
                      municipioPropietario: search.municipioPropietario !== null ? search.municipioPropietario.toUpperCase():'',
                      celularPropietario: search.celularPropietario,
                      correoPropietario: search.correoPropietario !== null ? search.correoPropietario.toLowerCase():'',
              
                      licenciaTransito: search.licenciaTransito,
                      placaDesde: search.placaDesde !== null ? search.placaDesde.toUpperCase():'',
                      vin: search.vin !== null ? search.vin.toUpperCase():'',
                      chasis: search.chasis !== null ? search.chasis.toUpperCase():'',
                      marca: search.marca !== null ? search.marca.toUpperCase():'',
                      tipo: search.tipo !== null ? search.tipo.toUpperCase():'',
                      servicio: search.servicio !==null ? search.servicio.toUpperCase():'',
                      
                      cedulaPersonAuth: search.cedulaPersonAuth,
                      nombrePersonAuth: `${search.primerApellidoPersonAuth !== null ? toString(search.primerApellidoPersonAuth).toUpperCase():''} ${search.segundoApellidoPersonAuth !== '' ? toString(search.segundoApellidoPersonAuth).toUpperCase():''} ${search.primerNombrePersonAuth !== '' ? toString(search.primerNombrePersonAuth).toUpperCase():''} ${search.segundoNombrePersonAuth !== '' ? toString(search.segundoNombrePersonAuth).toUpperCase():''}`,
                      primerApellidoPersonAuth: search.primerApellidoPersonAuth !== null ? search.primerApellidoPersonAuth.toUpperCase():'',
                      segundoApellidoPersonAuth: search.segundoApellidoPersonAuth !== null ? search.segundoApellidoPersonAuth.toUpperCase():'',
                      primerNombrePersonAuth: search.primerNombrePersonAuth !== null ? search.primerNombrePersonAuth.toUpperCase():'',
                      segundoNombrePersonAuth: search.segundoNombrePersonAuth !== null ? search.segundoNombrePersonAuth.toUpperCase():'',
              
                      direccionPersonAuth: search.direccionPersonAuth !== null ? search.direccionPersonAuth.toUpperCase():'',
                      municipioPersonAuth: search.municipioPersonAuth !== null ? search.municipioPersonAuth.toUpperCase():'',
                      celularPersonAuth: search.celularPersonAuth,
                      correoPersonAuth: search.correoPersonAuth !== null ? search.correoPersonAuth.toLowerCase():'',
                
                      fotoUsuario: photos.fotoUsuario,
                      cedulaPropietarioFrontal: photos.cedulaPropietarioFrontal,
                      cedulaPropietarioTrasera: photos.cedulaPropietarioTrasera,
      
                      //agregados en la segunda entrega
                      typeClient: typeClient,
                      numeroFactura: search.numeroFactura,
                      concepto: search.concepto,
                      numPlacas: search.numPlacas !== null ? search.numPlacas : 1,
                      ciudadPlaca: search.ciudadPlaca.toUpperCase(),
                      observations: 'La cédula y la placa ya se encontraban registrados al momento de hacer la solicitud (el número de chasis y número de vin SI COINCIDEN con el que ya estaba registrado), se le informó al usuario y este continuó con el registro.'

                    }
                updateSolicitud(id, body)
                .then(()=>{
                  const info = {
                    tarjetaPropiedadFrontal: photos.tarjetaPropiedadFrontal,
                    tarjetaPropiedadTrasera: photos.tarjetaPropiedadTrasera,
                    cedulaPersonAuthFrontal: photos.cedulaPersonAuthFrontal,
                  }
                  updateSolicitud(id,info)
                  .then(()=>{
                    const info2 = {
                      cedulaPersonAuthTrasera: photos.cedulaPersonAuthTrasera,
                      huella: localStorage.getItem('imageSrc') ? localStorage.getItem('imageSrc') : photos.huella,
                      firma: sigImageFirma !== '' ? sigImageFirma : '',
                    }
                    updateSolicitud(id,info2)
                    .then(()=>{
                      setLoading(false)
                      handleClear()
                      Swal.fire({
                        title:'¡FELICIDADES!',
                        text:'Se ha editado el editado la solicitud de forma exitosa',
                        showConfirmButton:true,
                        showCancelButton:false,
                        confirmButtonColor:'green'
                      })
                      .then(()=>{
                        navigate('/registros')
                      })
                    }) .catch(()=>{
                      setLoading(false)
                      Swal.fire({
                        title:'¡ERROR!',
                        text:'Ha ocurrido un error al momento de hacer la edición del registro de la solicitud. Vuelve a intentarlo mas tarde.',
                        showConfirmButton:true,
                        showCancelButton:false,
                        confirmButtonColor:'red'
                      })
                    })
                  }).catch(()=>{
                    setLoading(false)
                    Swal.fire({
                      title:'¡ERROR!',
                      text:'Ha ocurrido un error al momento de hacer la edición del registro de la solicitud. Vuelve a intentarlo mas tarde.',
                      showConfirmButton:true,
                      showCancelButton:false,
                      confirmButtonColor:'red'
                    })
                  })
                })
                .catch(()=>{
                  setLoading(false)
                  Swal.fire({
                    title:'¡ERROR!',
                    text:'Ha ocurrido un error al momento de hacer la edición del registro de la solicitud. Vuelve a intentarlo mas tarde.',
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
                text:'Por favor ingresa por lo menos los datos del propietario para llevar a cabo el registro de la solicitud.',
                showConfirmButton:true,
                showCancelButton:false,
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
          text:`La placa: "${search.placaDesde.toUpperCase()}" ya se encuentra registrada en nuestra base de datos
          con las fechas: ${devolverLista(filtroPorPlaca)}. ¿Desea continuar?`,
          showConfirmButton: true,
          showDenyButton: true,
          confirmButtonText: 'Si',
          confirmButtonColor:'green',
          denyButtonText: 'No',
        }).then(({isConfirmed, isDenied})=>{
          if(isConfirmed){
            setLoading(true)
            if(search.cedulaPropietario !== null && search.primerApellidoPropietario !== null &&
                  search.segundoApellidoPropietario !== null && search.primerNombrePropietario !== null &&
                  search.celularPropietario !== null && search.correoPropietario !== null && search.municipioPropietario !== null &&
                  search.placaDesde !== null && search.tipo !== null && search.servicio !== null && search.ciudadPlaca !== null
                ){
                  if(search.correoPropietario !==null && search.correoPropietario.includes('@') && search.correoPropietario.split('@')[1].includes('.')){
                    const body = {
                      cedulaPropietario: search.cedulaPropietario,
                      nombrePropietario: `${search.primerApellidoPropietario !== null ? search.primerApellidoPropietario.toUpperCase():''} ${search.segundoApellidoPropietario !== '' ? search.segundoApellidoPropietario.toUpperCase():''} ${search.primerNombrePropietario !== '' ? search.primerNombrePropietario.toUpperCase():''} ${search.segundoNombrePropietario !== '' ? search.segundoNombrePropietario.toUpperCase():''}`,
                      primerApellidoPropietario: search.primerApellidoPropietario !== null ? search.primerApellidoPropietario.toUpperCase():'' ,
                      segundoApellidoPropietario: search.segundoApellidoPropietario !== null ? search.segundoApellidoPropietario.toUpperCase():'',
                      primerNombrePropietario: search.primerNombrePropietario !== null ? search.primerNombrePropietario.toUpperCase():'',
                      segundoNombrePropietario: search.segundoNombrePropietario !== null ? search.segundoNombrePropietario.toUpperCase():'',
              
                      direccionPropietario: search.direccionPropietario !== null ? search.direccionPropietario.toUpperCase():'',
                      municipioPropietario: search.municipioPropietario !== null ? search.municipioPropietario.toUpperCase():'',
                      celularPropietario: search.celularPropietario,
                      correoPropietario: search.correoPropietario !== null ? search.correoPropietario.toLowerCase():'',
              
                      licenciaTransito: search.licenciaTransito,
                      placaDesde: search.placaDesde !== null ? search.placaDesde.toUpperCase():'',
                      vin: search.vin !== null ? search.vin.toUpperCase():'',
                      chasis: search.chasis !== null ? search.chasis.toUpperCase():'',
                      marca: search.marca !== null ? search.marca.toUpperCase():'',
                      tipo: search.tipo !== null ? search.tipo.toUpperCase():'',
                      servicio: search.servicio !==null ? search.servicio.toUpperCase():'',
                      
                      cedulaPersonAuth: search.cedulaPersonAuth,
                      nombrePersonAuth: `${search.primerApellidoPersonAuth !== null ? toString(search.primerApellidoPersonAuth).toUpperCase():''} ${search.segundoApellidoPersonAuth !== '' ? toString(search.segundoApellidoPersonAuth).toUpperCase():''} ${search.primerNombrePersonAuth !== '' ? toString(search.primerNombrePersonAuth).toUpperCase():''} ${search.segundoNombrePersonAuth !== '' ? toString(search.segundoNombrePersonAuth).toUpperCase():''}`,
                      primerApellidoPersonAuth: search.primerApellidoPersonAuth !== null ? search.primerApellidoPersonAuth.toUpperCase():'',
                      segundoApellidoPersonAuth: search.segundoApellidoPersonAuth !== null ? search.segundoApellidoPersonAuth.toUpperCase():'',
                      primerNombrePersonAuth: search.primerNombrePersonAuth !== null ? search.primerNombrePersonAuth.toUpperCase():'',
                      segundoNombrePersonAuth: search.segundoNombrePersonAuth !== null ? search.segundoNombrePersonAuth.toUpperCase():'',
              
                      direccionPersonAuth: search.direccionPersonAuth !== null ? search.direccionPersonAuth.toUpperCase():'',
                      municipioPersonAuth: search.municipioPersonAuth !== null ? search.municipioPersonAuth.toUpperCase():'',
                      celularPersonAuth: search.celularPersonAuth,
                      correoPersonAuth: search.correoPersonAuth !== null ? search.correoPersonAuth.toLowerCase():'',
                
                      fotoUsuario: photos.fotoUsuario,
                      cedulaPropietarioFrontal: photos.cedulaPropietarioFrontal,
                      cedulaPropietarioTrasera: photos.cedulaPropietarioTrasera,
      
                      //agregados en la segunda entrega
                      typeClient: typeClient,
                      numeroFactura: search.numeroFactura,
                      concepto: search.concepto,
                      numPlacas: search.numPlacas !== null ? search.numPlacas : 1,
                      ciudadPlaca: search.ciudadPlaca.toUpperCase(),
                      observations: 'La cédula y la placa ya se encontraban registrados al momento de hacer la solicitud (el número de chasis y número de vin SI COINCIDEN con el que ya estaba registrado), se le informó al usuario y este continuó con el registro.'

                    }
                updateSolicitud(id, body)
                .then(()=>{
                  const info = {
                    tarjetaPropiedadFrontal: photos.tarjetaPropiedadFrontal,
                    tarjetaPropiedadTrasera: photos.tarjetaPropiedadTrasera,
                    cedulaPersonAuthFrontal: photos.cedulaPersonAuthFrontal,
                  }
                  updateSolicitud(id,info)
                  .then(()=>{
                    const info2 = {
                      cedulaPersonAuthTrasera: photos.cedulaPersonAuthTrasera,
                      huella: localStorage.getItem('imageSrc') ? localStorage.getItem('imageSrc') : photos.huella,
                      firma: sigImageFirma !== '' ? sigImageFirma : '',
                    }
                    updateSolicitud(id,info2)
                    .then(()=>{
                      setLoading(false)
                      handleClear()
                      Swal.fire({
                        title:'¡FELICIDADES!',
                        text:'Se ha editado el editado la solicitud de forma exitosa',
                        showConfirmButton:true,
                        showCancelButton:false,
                        confirmButtonColor:'green'
                      })
                      .then(()=>{
                        navigate('/registros')
                      })
                    }) .catch(()=>{
                      setLoading(false)
                      Swal.fire({
                        title:'¡ERROR!',
                        text:'Ha ocurrido un error al momento de hacer la edición del registro de la solicitud. Vuelve a intentarlo mas tarde.',
                        showConfirmButton:true,
                        showCancelButton:false,
                        confirmButtonColor:'red'
                      })
                    })
                  }).catch(()=>{
                    setLoading(false)
                    Swal.fire({
                      title:'¡ERROR!',
                      text:'Ha ocurrido un error al momento de hacer la edición del registro de la solicitud. Vuelve a intentarlo mas tarde.',
                      showConfirmButton:true,
                      showCancelButton:false,
                      confirmButtonColor:'red'
                    })
                  })
                })
                .catch(()=>{
                  setLoading(false)
                  Swal.fire({
                    title:'¡ERROR!',
                    text:'Ha ocurrido un error al momento de hacer la edición del registro de la solicitud. Vuelve a intentarlo mas tarde.',
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
                text:'Por favor ingresa por lo menos los datos del propietario para llevar a cabo el registro de la solicitud.',
                showConfirmButton:true,
                showCancelButton:false,
                confirmButtonColor:'blue'
              })
            }
          }
        })
      }else if(filtroPorPlaca.length > 0 && (filtroPorPlaca[0].vin !== search.vin || filtroPorPlaca[0].chasis !== search.chasis)){
        Swal.fire({
          icon:'warning',
          title:'AVISO',
          text:`La placa: "${search.placaDesde.toUpperCase()}" ya se encuentra registrada en nuestra base de datos,
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
            if(search.cedulaPropietario !== null && search.primerApellidoPropietario !== null &&
                  search.segundoApellidoPropietario !== null && search.primerNombrePropietario !== null &&
                  search.celularPropietario !== null && search.correoPropietario !== null && search.municipioPropietario !== null &&
                  search.placaDesde !== null && search.tipo !== null && search.servicio !== null && search.ciudadPlaca !== null
                ){
                  if(search.correoPropietario !==null && search.correoPropietario.includes('@') && search.correoPropietario.split('@')[1].includes('.')){
                    const body = {
                      cedulaPropietario: search.cedulaPropietario,
                      nombrePropietario: `${search.primerApellidoPropietario !== null ? search.primerApellidoPropietario.toUpperCase():''} ${search.segundoApellidoPropietario !== '' ? search.segundoApellidoPropietario.toUpperCase():''} ${search.primerNombrePropietario !== '' ? search.primerNombrePropietario.toUpperCase():''} ${search.segundoNombrePropietario !== '' ? search.segundoNombrePropietario.toUpperCase():''}`,
                      primerApellidoPropietario: search.primerApellidoPropietario !== null ? search.primerApellidoPropietario.toUpperCase():'' ,
                      segundoApellidoPropietario: search.segundoApellidoPropietario !== null ? search.segundoApellidoPropietario.toUpperCase():'',
                      primerNombrePropietario: search.primerNombrePropietario !== null ? search.primerNombrePropietario.toUpperCase():'',
                      segundoNombrePropietario: search.segundoNombrePropietario !== null ? search.segundoNombrePropietario.toUpperCase():'',
              
                      direccionPropietario: search.direccionPropietario !== null ? search.direccionPropietario.toUpperCase():'',
                      municipioPropietario: search.municipioPropietario !== null ? search.municipioPropietario.toUpperCase():'',
                      celularPropietario: search.celularPropietario,
                      correoPropietario: search.correoPropietario !== null ? search.correoPropietario.toLowerCase():'',
              
                      licenciaTransito: search.licenciaTransito,
                      placaDesde: search.placaDesde !== null ? search.placaDesde.toUpperCase():'',
                      vin: search.vin !== null ? search.vin.toUpperCase():'',
                      chasis: search.chasis !== null ? search.chasis.toUpperCase():'',
                      marca: search.marca !== null ? search.marca.toUpperCase():'',
                      tipo: search.tipo !== null ? search.tipo.toUpperCase():'',
                      servicio: search.servicio !==null ? search.servicio.toUpperCase():'',
                      
                      cedulaPersonAuth: search.cedulaPersonAuth,
                      nombrePersonAuth: `${search.primerApellidoPersonAuth !== null ? toString(search.primerApellidoPersonAuth).toUpperCase():''} ${search.segundoApellidoPersonAuth !== '' ? toString(search.segundoApellidoPersonAuth).toUpperCase():''} ${search.primerNombrePersonAuth !== '' ? toString(search.primerNombrePersonAuth).toUpperCase():''} ${search.segundoNombrePersonAuth !== '' ? toString(search.segundoNombrePersonAuth).toUpperCase():''}`,
                      primerApellidoPersonAuth: search.primerApellidoPersonAuth !== null ? search.primerApellidoPersonAuth.toUpperCase():'',
                      segundoApellidoPersonAuth: search.segundoApellidoPersonAuth !== null ? search.segundoApellidoPersonAuth.toUpperCase():'',
                      primerNombrePersonAuth: search.primerNombrePersonAuth !== null ? search.primerNombrePersonAuth.toUpperCase():'',
                      segundoNombrePersonAuth: search.segundoNombrePersonAuth !== null ? search.segundoNombrePersonAuth.toUpperCase():'',
              
                      direccionPersonAuth: search.direccionPersonAuth !== null ? search.direccionPersonAuth.toUpperCase():'',
                      municipioPersonAuth: search.municipioPersonAuth !== null ? search.municipioPersonAuth.toUpperCase():'',
                      celularPersonAuth: search.celularPersonAuth,
                      correoPersonAuth: search.correoPersonAuth !== null ? search.correoPersonAuth.toLowerCase():'',
                
                      fotoUsuario: photos.fotoUsuario,
                      cedulaPropietarioFrontal: photos.cedulaPropietarioFrontal,
                      cedulaPropietarioTrasera: photos.cedulaPropietarioTrasera,
      
                      //agregados en la segunda entrega
                      typeClient: typeClient,
                      numeroFactura: search.numeroFactura,
                      concepto: search.concepto,
                      numPlacas: search.numPlacas !== null ? search.numPlacas : 1,
                      ciudadPlaca: search.ciudadPlaca.toUpperCase(),
                      observations: 'La cédula y la placa ya se encontraban registrados al momento de hacer la solicitud (el número de chasis y número de vin SI COINCIDEN con el que ya estaba registrado), se le informó al usuario y este continuó con el registro.'

                    }
                updateSolicitud(id, body)
                .then(()=>{
                  const info = {
                    tarjetaPropiedadFrontal: photos.tarjetaPropiedadFrontal,
                    tarjetaPropiedadTrasera: photos.tarjetaPropiedadTrasera,
                    cedulaPersonAuthFrontal: photos.cedulaPersonAuthFrontal,
                  }
                  updateSolicitud(id,info)
                  .then(()=>{
                    const info2 = {
                      cedulaPersonAuthTrasera: photos.cedulaPersonAuthTrasera,
                      huella: localStorage.getItem('imageSrc') ? localStorage.getItem('imageSrc') : photos.huella,
                      firma: sigImageFirma !== '' ? sigImageFirma : '',
                    }
                    updateSolicitud(id,info2)
                    .then(()=>{
                      setLoading(false)
                      handleClear()
                      Swal.fire({
                        title:'¡FELICIDADES!',
                        text:'Se ha editado el editado la solicitud de forma exitosa',
                        showConfirmButton:true,
                        showCancelButton:false,
                        confirmButtonColor:'green'
                      })
                      .then(()=>{
                        navigate('/registros')
                      })
                    }) .catch(()=>{
                      setLoading(false)
                      Swal.fire({
                        title:'¡ERROR!',
                        text:'Ha ocurrido un error al momento de hacer la edición del registro de la solicitud. Vuelve a intentarlo mas tarde.',
                        showConfirmButton:true,
                        showCancelButton:false,
                        confirmButtonColor:'red'
                      })
                    })
                  }).catch(()=>{
                    setLoading(false)
                    Swal.fire({
                      title:'¡ERROR!',
                      text:'Ha ocurrido un error al momento de hacer la edición del registro de la solicitud. Vuelve a intentarlo mas tarde.',
                      showConfirmButton:true,
                      showCancelButton:false,
                      confirmButtonColor:'red'
                    })
                  })
                })
                .catch(()=>{
                  setLoading(false)
                  Swal.fire({
                    title:'¡ERROR!',
                    text:'Ha ocurrido un error al momento de hacer la edición del registro de la solicitud. Vuelve a intentarlo mas tarde.',
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
                text:'Por favor ingresa por lo menos los datos del propietario para llevar a cabo el registro de la solicitud.',
                showConfirmButton:true,
                showCancelButton:false,
                confirmButtonColor:'blue'
              })
            }
          }
        })
      }else{
        setLoading(true)
        if(search.cedulaPropietario !== null && search.primerApellidoPropietario !== null &&
                  search.segundoApellidoPropietario !== null && search.primerNombrePropietario !== null &&
                  search.celularPropietario !== null && search.correoPropietario !== null && search.municipioPropietario !== null &&
                  search.placaDesde !== null && search.tipo !== null && search.servicio !== null && search.ciudadPlaca !== null
                ){
                  if(search.correoPropietario !==null && search.correoPropietario.includes('@') && search.correoPropietario.split('@')[1].includes('.')){
                    const body = {
                      cedulaPropietario: search.cedulaPropietario,
                      nombrePropietario: `${search.primerApellidoPropietario !== null ? search.primerApellidoPropietario.toUpperCase():''} ${search.segundoApellidoPropietario !== '' ? search.segundoApellidoPropietario.toUpperCase():''} ${search.primerNombrePropietario !== '' ? search.primerNombrePropietario.toUpperCase():''} ${search.segundoNombrePropietario !== '' ? search.segundoNombrePropietario.toUpperCase():''}`,
                      primerApellidoPropietario: search.primerApellidoPropietario !== null ? search.primerApellidoPropietario.toUpperCase():'' ,
                      segundoApellidoPropietario: search.segundoApellidoPropietario !== null ? search.segundoApellidoPropietario.toUpperCase():'',
                      primerNombrePropietario: search.primerNombrePropietario !== null ? search.primerNombrePropietario.toUpperCase():'',
                      segundoNombrePropietario: search.segundoNombrePropietario !== null ? search.segundoNombrePropietario.toUpperCase():'',
              
                      direccionPropietario: search.direccionPropietario !== null ? search.direccionPropietario.toUpperCase():'',
                      municipioPropietario: search.municipioPropietario !== null ? search.municipioPropietario.toUpperCase():'',
                      celularPropietario: search.celularPropietario,
                      correoPropietario: search.correoPropietario !== null ? search.correoPropietario.toLowerCase():'',
              
                      licenciaTransito: search.licenciaTransito,
                      placaDesde: search.placaDesde !== null ? search.placaDesde.toUpperCase():'',
                      vin: search.vin !== null ? search.vin.toUpperCase():'',
                      chasis: search.chasis !== null ? search.chasis.toUpperCase():'',
                      marca: search.marca !== null ? search.marca.toUpperCase():'',
                      tipo: search.tipo !== null ? search.tipo.toUpperCase():'',
                      servicio: search.servicio !==null ? search.servicio.toUpperCase():'',
                      
                      cedulaPersonAuth: search.cedulaPersonAuth,
                      nombrePersonAuth: `${search.primerApellidoPersonAuth !== null ? toString(search.primerApellidoPersonAuth).toUpperCase():''} ${search.segundoApellidoPersonAuth !== '' ? toString(search.segundoApellidoPersonAuth).toUpperCase():''} ${search.primerNombrePersonAuth !== '' ? toString(search.primerNombrePersonAuth).toUpperCase():''} ${search.segundoNombrePersonAuth !== '' ? toString(search.segundoNombrePersonAuth).toUpperCase():''}`,
                      primerApellidoPersonAuth: search.primerApellidoPersonAuth !== null ? search.primerApellidoPersonAuth.toUpperCase():'',
                      segundoApellidoPersonAuth: search.segundoApellidoPersonAuth !== null ? search.segundoApellidoPersonAuth.toUpperCase():'',
                      primerNombrePersonAuth: search.primerNombrePersonAuth !== null ? search.primerNombrePersonAuth.toUpperCase():'',
                      segundoNombrePersonAuth: search.segundoNombrePersonAuth !== null ? search.segundoNombrePersonAuth.toUpperCase():'',
              
                      direccionPersonAuth: search.direccionPersonAuth !== null ? search.direccionPersonAuth.toUpperCase():'',
                      municipioPersonAuth: search.municipioPersonAuth !== null ? search.municipioPersonAuth.toUpperCase():'',
                      celularPersonAuth: search.celularPersonAuth,
                      correoPersonAuth: search.correoPersonAuth !== null ? search.correoPersonAuth.toLowerCase():'',
                
                      fotoUsuario: photos.fotoUsuario,
                      cedulaPropietarioFrontal: photos.cedulaPropietarioFrontal,
                      cedulaPropietarioTrasera: photos.cedulaPropietarioTrasera,
      
                      //agregados en la segunda entrega
                      typeClient: typeClient,
                      numeroFactura: search.numeroFactura,
                      concepto: search.concepto,
                      numPlacas: search.numPlacas !== null ? search.numPlacas : 1,
                      ciudadPlaca: search.ciudadPlaca.toUpperCase(),
                      observations: 'La cédula y la placa ya se encontraban registrados al momento de hacer la solicitud (el número de chasis y número de vin SI COINCIDEN con el que ya estaba registrado), se le informó al usuario y este continuó con el registro.'

                    }
            updateSolicitud(id, body)
            .then(()=>{
              const info = {
                tarjetaPropiedadFrontal: photos.tarjetaPropiedadFrontal,
                tarjetaPropiedadTrasera: photos.tarjetaPropiedadTrasera,
                cedulaPersonAuthFrontal: photos.cedulaPersonAuthFrontal,
              }
              updateSolicitud(id,info)
              .then(()=>{
                const info2 = {
                  cedulaPersonAuthTrasera: photos.cedulaPersonAuthTrasera,
                  huella: localStorage.getItem('imageSrc') ? localStorage.getItem('imageSrc') : photos.huella,
                  firma: sigImageFirma !== '' ? sigImageFirma : '',
                }
                updateSolicitud(id,info2)
                .then(()=>{
                  setLoading(false)
                  handleClear()
                  Swal.fire({
                    title:'¡FELICIDADES!',
                    text:'Se ha editado el editado la solicitud de forma exitosa',
                    showConfirmButton:true,
                    showCancelButton:false,
                    confirmButtonColor:'green'
                  })
                  .then(()=>{
                    navigate('/registros')
                  })
                }) .catch(()=>{
                  setLoading(false)
                  Swal.fire({
                    title:'¡ERROR!',
                    text:'Ha ocurrido un error al momento de hacer la edición del registro de la solicitud. Vuelve a intentarlo mas tarde.',
                    showConfirmButton:true,
                    showCancelButton:false,
                    confirmButtonColor:'red'
                  })
                })
              }).catch(()=>{
                setLoading(false)
                Swal.fire({
                  title:'¡ERROR!',
                  text:'Ha ocurrido un error al momento de hacer la edición del registro de la solicitud. Vuelve a intentarlo mas tarde.',
                  showConfirmButton:true,
                  showCancelButton:false,
                  confirmButtonColor:'red'
                })
              })
            })
            .catch(()=>{
              setLoading(false)
              Swal.fire({
                title:'¡ERROR!',
                text:'Ha ocurrido un error al momento de hacer la edición del registro de la solicitud. Vuelve a intentarlo mas tarde.',
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
            text:'Por favor ingresa los datos requeridos para llevar a cabo el registro de la solicitud.',
            showConfirmButton:true,
            showCancelButton:false,
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
      placaDesde:'',
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
      numeroFactura: null,
      numPlacas:'',
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
      fotoUsuario: null,
      cedulaPropietarioFrontal: null,
      cedulaPropietarioTrasera: null,
      tarjetaPropiedadFrontal: null,
      tarjetaPropiedadTrasera: null,
      cedulaPersonAuthFrontal: null,
      cedulaPersonAuthTrasera: null,
      impronta: null,
      productoDañado: null,
    })
    setTypeClient('propietario')
    localStorage.setItem("imageSrc", "")
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
                {/* {(user.role==='admin' || user.role==='superadmin') && */}
                  <li className='nav-text fw-bold'>
                  <Link to='/registros' style={{backgroundColor:(ruta==='/registros') ? 'white' : 'black',color:(ruta==='/registros') ? 'black' : 'white'}} >
                    <GiBlackBook />
                    <span>Bitácora</span>
                  </Link>
                </li>
                {/* } */}
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
                          value={formatDate(new Date(search.createdAt))}                          
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
                        handleCedula(e);
                      }}
                      onBlur={handleInputBlur}
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
                        /* placeholder="*Campo obligatorio*" */
                        onChange={(e) => {
                          handlerChangeSearch(e);
                        }}
                        style={{textTransform:'uppercase'}}
                        autoComplete="off"
                      />
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label>Segundo apellido:</label>
                    <input
                        id="segundoApellidoPropietario"
                        value={search.segundoApellidoPropietario}
                        type="text"
                        className="form-control form-control-sm"
                        /* placeholder="*Campo obligatorio*" */
                        onChange={(e) => {
                          handlerChangeSearch(e);
                        }}
                        style={{textTransform:'uppercase'}}
                        autoComplete="off"
                      />
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label>Primer nombre:</label>
                    <input
                        id="primerNombrePropietario"
                        value={search.primerNombrePropietario}
                        type="text"
                        className="form-control form-control-sm"
                        /* placeholder="*Campo obligatorio*" */
                        onChange={(e) => {
                          handlerChangeSearch(e);
                        }}
                        style={{textTransform:'uppercase'}}
                        autoComplete="off"
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
                      /* placeholder="*Campo obligatorio*" */
                      onChange={(e) => {
                        handlerChangeSearch(e);
                      }}
                      style={{textTransform:'uppercase'}}
                      autoComplete="off"
                    />
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label>Municipio de residencia:</label>
                    <input
                        id="municipioPropietario"
                        value={search.municipioPropietario}
                        type="text"
                        className="form-control form-control-sm"
                        /* placeholder="*Campo obligatorio*" */
                        onChange={(e) => {
                          handlerChangeSearch(e);
                        }}
                        style={{textTransform:'uppercase'}}
                        autoComplete="off"
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
                      /* placeholder="*Campo obligatorio*" */
                      onChange={(e) => {
                        handleMaxCel(e);
                      }}
                      min={0}
                      autoComplete="off"
                    />
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label>Correo electrónico:</label>
                    <input
                      id="correoPropietario"
                      value={search.correoPropietario}
                      type="email"
                      className="form-control form-control-sm"
                      /* placeholder="*Campo obligatorio*" */
                      onChange={(e) => {
                        handlerChangeSearch(e);
                      }}
                      style={{textTransform:'lowercase'}}
                      autoComplete="off"
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
                          /* placeholder="*Campo obligatorio*" */
                          onChange={(e) => {
                            handlerChangeSearch(e);
                          }}
                          min={0}
                          autoComplete="off"
                        />
                      </div>
                      <div className="d-flex flex-column align-items-start">
                        <label>Placa:</label>
                        <input
                            id="placa"
                            value={search.placaDesde}
                            type="text"
                            className="form-control form-control-sm"
                            /* placeholder="*Campo obligatorio*" */
                            onChange={(e) => {
                              handlerChangeSearch(e);
                            }}
                            required
                            placeholder="*CAMPO OBLIGATORIO*"
                            style={{textTransform:'uppercase'}}
                            autoComplete="off"
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
                    <div className="row row-cols-sm-4">
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
                          required
                          placeholder="*CAMPO OBLIGATORIO*"
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
                          /* placeholder="*Campo obligatorio*" */
                          onChange={(e) => {
                            handlerChangeSearch(e);
                          }}
                          style={{textTransform:'uppercase'}}
                          autoComplete="off"
                        />
                      </div>
                      <div className="d-flex flex-column align-items-start">
                        <label>Tipo:</label>
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
                        /* placeholder="*Campo obligatorio*" */
                        onChange={(e) => {
                          handleCedula(e);
                        }}
                        min={0}
                        autoComplete="off"
                      />
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <label>Primer apellido:</label>
                      <input
                          id="primerApellidoPersonAuth"
                          value={search.primerApellidoPersonAuth}
                          type="text"
                          className="form-control form-control-sm"
                          /* placeholder="*Campo obligatorio*" */
                          onChange={(e) => {
                            handlerChangeSearch(e);
                          }}
                          style={{textTransform:'uppercase'}}
                          autoComplete="off"
                        />
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <label>Segundo apellido:</label>
                      <input
                          id="segundoApellidoPersonAuth"
                          value={search.segundoApellidoPersonAuth}
                          type="text"
                          className="form-control form-control-sm"
                          /* placeholder="*Campo obligatorio*" */
                          onChange={(e) => {
                            handlerChangeSearch(e);
                          }}
                          style={{textTransform:'uppercase'}}
                          autoComplete="off"
                        />
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <label>Primer nombre:</label>
                      <input
                          id="primerNombrePersonAuth"
                          value={search.primerNombrePersonAuth}
                          type="text"
                          className="form-control form-control-sm"
                          /* placeholder="*Campo obligatorio*" */
                          onChange={(e) => {
                            handlerChangeSearch(e);
                          }}
                          style={{textTransform:'uppercase'}}
                          autoComplete="off"
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
                        /* placeholder="*Campo obligatorio*" */
                        onChange={(e) => {
                          handlerChangeSearch(e);
                        }}
                        style={{textTransform:'uppercase'}}
                        autoComplete="off"
                      />
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <label>Municipio de residencia:</label>
                      <input
                          id="municipioPersonAuth"
                          value={search.municipioPersonAuth}
                          type="text"
                          className="form-control form-control-sm"
                          /* placeholder="*Campo obligatorio*" */
                          onChange={(e) => {
                            handlerChangeSearch(e);
                          }}
                          style={{textTransform:'uppercase'}}
                          autoComplete="off"
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
                        /* placeholder="*Campo obligatorio*" */
                        onChange={(e) => {
                          handleMaxCel(e);
                        }}
                        min={0}
                        autoComplete="off"
                      />
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <label>Correo electrónico:</label>
                      <input
                        id="correoPersonAuth"
                        value={search.correoPersonAuth}
                        type="email"
                        className="form-control form-control-sm"
                        /* placeholder="*Campo obligatorio*" */
                        onChange={(e) => {
                          handlerChangeSearch(e);
                        }}
                        style={{textTransform:'lowercase'}}
                        autoComplete="off"
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
                    borderRadius:25
                  }}
                  onClick={() => openModal("cedulaPropietarioFrontal","Cédula frontal propietario")}
                >
                  {photos.cedulaPropietarioFrontal ? (
                    <img 
                      src={photos.cedulaPropietarioFrontal} 
                      alt="cedulaPropietarioFrontal" 
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
                  onClick={() => openModal("cedulaPropietarioTrasera","Cédula trasera propietario")}
                >
                  {photos.cedulaPropietarioTrasera ? (
                    <img 
                      src={photos.cedulaPropietarioTrasera} 
                      alt="cedulaPropietarioTrasera" 
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
                  onClick={() => openModal("tarjetaPropiedadFrontal","Tarjeta de propiedad frontal")}
                >
                  {photos.tarjetaPropiedadFrontal ? (
                    <img 
                      src={photos.tarjetaPropiedadFrontal} 
                      alt="tarjetaPropiedadFrontal" 
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
                  onClick={() => openModal("tarjetaPropiedadTrasera","Tarjeta de propiedad trasera")}
                >
                  {photos.tarjetaPropiedadTrasera ? (
                    <img 
                      src={photos.tarjetaPropiedadTrasera} 
                      alt="tarjetaPropiedadTrasera" 
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
                    onClick={() => openModal("cedulaPersonAuthFrontal","Cédula frontal persona autorizada")}
                  >
                    {photos.cedulaPersonAuthFrontal ? (
                      <img 
                        src={photos.cedulaPersonAuthFrontal} 
                        alt="cedulaPersonAuthFrontal" 
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
                    onClick={() => openModal("cedulaPersonAuthTrasera","Cédula trasera persona autorizada")}
                  >
                    {photos.cedulaPersonAuthTrasera ? (
                      <img 
                        src={photos.cedulaPersonAuthTrasera} 
                        alt="cedulaPersonAuthTrasera" 
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
                    onClick={() => openModal("fotoUsuario","Usuario")}
                  >
                    {photos.fotoUsuario ? (
                      <img 
                        src={photos.fotoUsuario} 
                        alt="fotoUsuario" 
                        style={{ width: "100%", height: "100%"}} 
                      />
                    ):"Haz Click aquí para tomar la foto"}
                  </div>
                </div>
                <div className="d-flex flex-column align-items-center w-50">
                  <label style={{fontSize:12}}>Huella:</label>
                  <Huella/>
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

            {/* observaciones */}
            <div className="d-flex flex-column mt-2">
              <label className="fw-bold">OBSERVACIONES</label>
              <textarea
                id="observations"
                className="form-control"
                value={search.observations}
                disabled
                style={{ minHeight: 70, maxHeight: 100, fontSize: 13 }}
              ></textarea>
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
              {loading ? <strong>EDITANDO...<GiSandsOfTime /></strong>: 'EDITAR'}
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
