import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from 'sweetalert2'
import { createBackUp } from "../../services/backUpService";

export default function ModalBackUpBD({
  showModal,
  setShowModal,
  reloadInfo,
}) {
  const [cargando, setCargando] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setCargando(true);
    createBackUp()
    .then(()=>{
      setCargando(false)
      Swal.fire({
        title:'¡CORRECTO!',
        text:'Se ha generado de manera satisfactoria el backup de la base de datos "ingse" en el servidor el día 02/05/2025.',
        timer:8000,
        showConfirmButton:false
      })
      setShowModal(false)
    })
    .catch(()=>{
      setCargando(false)
      Swal.fire({
        icon:'warning',
        title:'¡ERROR!',
        text:'Ha ocurrido un error al momento de hacer el backup de la base de datos "ingse" en el servidor el día 02/05/2025. Intentalo mas tarde, si el problema persiste comunicate con el programador que diseño el programa.',
        showConfirmButton:true,
        showCancelButton:false,
        confirmButtonColor:'red',
      })
    })
  }

  const [shown,setShown]=useState("");
  const switchShown =()=>setShown(!shown);
  
  //logica de el boton de crear
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
    transform: hover ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.3s ease',
  };

  const BotonCaancelar = ({ children }) => {
    const [hover, setHover] = useState(false);
    const handleMouseEnter = () => {
      setHover(true);
    };
    const handleMouseLeave = () => {
      setHover(false);
    };
    const buttonStyle = {
      cursor: 'pointer',
      backgroundColor:'#E5BE01',
      color:'white',
      transform: hover ? 'scale(1.05)' : 'scale(1)',
      transition: 'all 0.3s ease',
    };
    return (
      <button
        className="fw-bold ms-2 mb-3"
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        type='submit'
        /* onClick={(e)=>handleCancelar(e)} */
        onClick={(e) => {
          setShowModal(false)
        }}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="wrapper d-flex justify-content-center align-content-center" style={{userSelect:'none'}}>
    <Modal show={showModal} style={{ fontSize: 18, userSelect:'none' }} centered>
      <Modal.Header>
        <center>
        <Modal.Title className="fw-bold" style={{fontSize:40}}>
          <strong>BackUp Base de datos </strong>
        </Modal.Title>
        </center>
      </Modal.Header>
      <form onSubmit={(e)=>handleSubmit(e)}>
      <Modal.Body className="p-2">
        <div className="m-2 h-100">
          ¿Estas segur@ que deseas realizar una copia de la base de datos de INGSE S.A.S?
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-center gap-2 mt-2 ">
          <button
            className="fw-bold mb-3"
            style={buttonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            type='submit'
            onClick={(e)=>handleSubmit(e)}
          >
            {cargando ? 'Ejecutando...' : 'Ejecutar'}
          </button>
          <BotonCaancelar>
            Cancelar
          </BotonCaancelar>
        </div>
      </Modal.Footer>
      </form>
    </Modal>
    </div>
  );
}
