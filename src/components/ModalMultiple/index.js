import { useState, useEffect , useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from 'sweetalert2'
import { createUser, findUserByEmail, updateUser } from "../../services/userService";
import { FiEdit3 } from "react-icons/fi";
/* import bcrypt from 'bcrypt';
 */
export default function ModalMultiple({
  showModal,
  setShowModal,
  reloadInfo,
}) {
  const [multiple, setMultiple] = useState({
    cedula: '',
    name: '',
    cantidad:'',
    letras:'',
    noDesde:'',
    noHasta:'',
  });
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { id, value } = e.target;
    setMultiple({
      ...multiple,
      [id]: value,
    });
  };

  const cleanForm = () => {
    setMultiple({})
  }
  
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
        className="fw-bold ms-2 mb-3 rounded-3"
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        type='submit'
        /* onClick={(e)=>handleCancelar(e)} */
        onClick={(e) => {
          cleanForm()
          setShowModal(false)
        }}
      >
        {children}
      </button>
    );
  };

  const handleLimit = (e) => {
    const { id , value } = e.target;
    if (value.length <= 3) {
      setMultiple({
        ...multiple,
        [id]:value
      })
    } else {
      setMultiple({
        ...multiple,
        [id]:''
      })
    }
  }

  return (
    <div className="wrapper d-flex justify-content-center align-content-center" style={{userSelect:'none'}}>
    <Modal show={showModal} style={{ fontSize: 18, userSelect:'none' }} centered>
      <Modal.Header>
        <center>
        <Modal.Title className="fw-bold" style={{fontSize:30}}>
          <strong>Solicitud de placas múltiples (mayorista) </strong>
        </Modal.Title>
        </center>
      </Modal.Header>
      <form /* onSubmit={handleCreateUser} */>
      <Modal.Body className="p-2">
        <div className="m-2 h-100">
            <div>
              <div>
              <div>
                <label className="fw-bold">Cédula ó NIT</label>
                <input
                  id="cedula"
                  type="text"
                  value={multiple?.cedula}
                  className="form-control form-control-sm"
                  onChange={(e)=> (handleChange(e))}
                  autoComplete="off"
                  required
                />
              </div>
              <div>
                <label className="fw-bold">Nombre</label>
                <input
                  id="name"
                  type="text"
                  value={(multiple?.name)}
                  style={{textTransform:'uppercase'}}
                  className="form-control form-control-sm"
                  onChange={(e)=> (handleChange(e))}
                  autoComplete="off"
                  required
                />
              </div>
              <div>
                <label className="fw-bold">Cantidad</label>
                <input
                  id="cantidad"
                  type="text"
                  value={multiple?.cantidad}
                  className="form-control form-control-sm"
                  onChange={(e)=> (handleChange(e))}
                  autoComplete="off"
                  required
                />
              </div>
              <div>
                <label className="fw-bold">intervalo de placas</label>
                <div className="row justify-content-center align-items-center" >
                  <div className="col col-12 col-lg-3 colmd-12">
                    <label>Letras</label>
                    <input
                      id="letras"
                      type="text"
                      value={multiple?.letras}
                      className="form-control form-control-sm"
                      onChange={(e)=> (handleChange(e), handleLimit(e))}
                      autoComplete="off"
                      style={{textTransform:'uppercase'}}
                      required
                      ref={input1Ref}
                    />
                  </div>
                  {/* <div className="col col-12 col-lg-3 colmd-12">
                    <label className="fw-bold">
                      Números
                    </label>
                  </div> */}
                  <div className="col col-12 col-lg-3 col-md-12">
                    <label>Números</label>
                    <input
                      id="noDesde"
                      type="number"
                      value={multiple?.noDesde}
                      className="form-control form-control-sm"
                      onChange={(e)=> (handleChange(e), handleLimit(e))}
                      autoComplete="off"
                      placeholder="Desde"
                      required
                      ref={input2Ref}
                    />
                  </div>
                  <label className="fw-bold col col-12 col-lg-1 col-md-1 mt-4"> - </label>
                  <div className="col col-12 col-lg-3 col-md-12">
                    <label></label>
                    <input
                      id="noHasta"
                      type="number"
                      value={multiple?.noHasta}
                      placeholder="Hasta"
                      className="form-control form-control-sm"
                      onChange={(e)=> (handleChange(e),handleLimit(e))}
                      autoComplete="off"
                      required
                      ref={input3Ref}
                    />
                  </div>
                </div>
              </div>
              </div>
            </div>
            <div className="d-flex w-100 mt-2">
              <span 
                className="text-center text-danger w-100 m-0"
                style={{height: 15}}
              >
                {error}
              </span>
            </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-center gap-2 mt-2 ">
          <button
            className="fw-bold mb-3 rounded-3"
            style={buttonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            type='submit'
            >
            Enviar
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
