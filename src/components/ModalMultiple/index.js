import { useState, useEffect, useRef , useContext } from "react";
import { createMultipleSolicitud } from "../../services/solicitudService";
import FormControlLabel from '@mui/material/FormControlLabel';
import AuthContext from "../../context/authContext";
import { GiSandsOfTime } from "react-icons/gi";
import Checkbox from '@mui/material/Checkbox';
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";

export default function ModalMultiple({ showModal, setShowModal, reloadInfo }) {
  const [multiple, setMultiple] = useState({
    /* cedula: "",
    name: "",
    cantidad: "",
    letras: "",
    noDesde: "",
    noHasta: "",
    tipo: "",
    letraFinal: "", */
    cedula: "",
    name: "",
    cantidad: "",
    letrasDesde: "",
    noDesde: "",
    letraFinal: "",
    letrasHasta: "",
    noHasta: "",
    tipo: "",
    servicio: '',
    concepto: '',
    numPlacas: '',
    ciudadPlaca: '',
  });
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setMultiple({
      ...multiple,
      [id]: value,
    });
  };

  /* logica del selecto concepto */
  const handleChangeConcepto = (e) =>{
    const { id, value } = e.target;
    if(value === 'NUEVA'){
      setMultiple({
        ...multiple,
        [id]: value,
        numPlacas: 2
      });
    }else{
      setMultiple({
        ...multiple,
        [id]: value,
        numPlacas: 1
      });
    }
  }

  const cleanForm = () => {
    setMultiple({});
  };

  //logica de el boton de crear
  const [hover, setHover] = useState(false);
  const handleMouseEnter = () => {
    setHover(true);
  };
  const handleMouseLeave = () => {
    setHover(false);
  };
  const buttonStyle = {
    cursor: "pointer",
    backgroundColor: "black",
    color: "white",
    transform: hover ? "scale(1.05)" : "scale(1)",
    transition: "all 0.3s ease",
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
      cursor: "pointer",
      backgroundColor: "#E5BE01",
      color: "white",
      transform: hover ? "scale(1.05)" : "scale(1)",
      transition: "all 0.3s ease",
    };
    return (
      <button
        className="fw-bold ms-2 mb-3 rounded-3"
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        type="submit"
        /* onClick={(e)=>handleCancelar(e)} */
        onClick={(e) => {
          handleClear();
          setShowModal(false);
        }}
      >
        {children}
      </button>
    );
  };

  const handleLimit = (e) => {
    const { id, value } = e.target;
    if (value.length <= 3) {
      setMultiple({
        ...multiple,
        [id]: value,
      });
    } else {
      setMultiple({
        ...multiple,
        [id]: "",
      });
    }
  };

  const handleLimitMoto = (e) => {
    const { id, value } = e.target;
    if (value.length <= 2) {
      setMultiple({
        ...multiple,
        [id]: value,
      });
    } else {
      setMultiple({
        ...multiple,
        [id]: "",
      });
    }
  };
  
  const handleLimitLetraFinal = (e) => {
    const { id, value } = e.target;
    if (value.length <= 1) {
      setMultiple({
        ...multiple,
        [id]: value,
      });
    } else {
      setMultiple({
        ...multiple,
        [id]: "",
      });
    }
  };

  /* const [cuentas, setCuentas] = useState({
    ahorros: false,
    corriente: false,
  });

  const handleTipoVehiculo = (type) => {
    setCuentas({
        ahorros: type === 'ahorros' ? true : false,
        corriente: type === 'corriente' ? true : false,
    });
    setCuenta(type)
  }; */

  const handleTipoVehiculo = (type) => {
    setMultiple({
      ...multiple,
      tipo: type
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      multiple.name !== "" && multiple.cedula !== "" &&
      multiple.letrasDesde !== "" && multiple.noDesde !== "" && multiple.noHasta !== "" &&
      multiple.servicio !== "" && multiple.tipo !== "" && multiple.letrasHasta !== '' &&
      multiple.numPlacas !== "" && multiple.concepto !== ""
    ) {
      /* const total = Number(multiple.noHasta) - Number(multiple.noDesde) + 1 ;
      if (total !== Number(multiple.cantidad)) {
        Swal.fire({
          icon: "warning",
          title: "¡ERROR!",
          text: "La cantidad ingresada debe coincidir con la cantidad entre el numero desde y el numero hasta de las placas solicitadas. Verifique la información suministrada.",
          confirmButtonColor: "red",
        });
      } else { */
        setEnviando(true);
        const body = {
          cedulaPropietario: multiple.cedula,
          nombrePropietario: multiple.name.toUpperCase(),
          cantidad: multiple.cantidad,
          letrasDesde: multiple.letrasDesde.toUpperCase(),
          letrasHasta: multiple.letrasHasta.toUpperCase(),
          tipo: multiple.tipo.toUpperCase(),
          desde: parseInt(multiple.noDesde),
          hasta: parseInt(multiple.noHasta),
          letraFinal: multiple.letraFinal.toUpperCase(),
          placaDesde: `${multiple.letrasDesde.toUpperCase()}${multiple.noDesde}${multiple.letraFinal.toUpperCase()}`,
          placaHasta: `${multiple.letrasHasta.toUpperCase()}${multiple.noHasta}${multiple.letraFinal.toUpperCase()}`,
          numPlacas: multiple.numPlacas,
          concepto: multiple.concepto.toUpperCase(),
          servicio: multiple.servicio.toUpperCase(),
          ciudadPlaca: multiple.ciudadPlaca.toUpperCase(),
          createdAt: new Date(),
          userId: user.id,
        };
        createMultipleSolicitud(body)
          .then(() => {
            setEnviando(false);
            Swal.fire({
              /* icon: "success", */
              title: "¡FELICIDADES!",
              text: "Se ha hecho el registro de la solicitud de todas las placas de manera satisfactoria.",
              confirmButtonColor: "green",
            }).then(() => {
              handleClear();
              /* reloadInfo(); */
              setShowModal(false);
            });
          })
          .catch((error) => {
            setEnviando(false);
            Swal.fire({
              icon: "warning",
              /* title: "¡ERROR!", */
              title: `${error}`,
              text: "Ha ocurrido un error al momento de hacer el registro de las solicitudes. Vuelve a intentarlo mas tarde.",
              confirmButtonColor: "red",
            });
          });
      /* } */
    } else {
      Swal.fire({
        icon: "warning",
        title: "¡ATENCION!",
        text: "En este formulario todos los campos deben ser diligenciados para poder hacer el registro de la solicitudes. Verifique la información suministrada.",
        confirmButtonColor: "red",
      });
    }
  };

  const handleClear = () => {
    setMultiple({
      cantidad: "",
      cedula: "",
      letras: "",
      name: "",
      noDesde: "",
      noHasta: "",
      tipo: '',
      letraFinal: '',
      concepto: '',
      letrasDesde: '',
      letrasHasta: '',
      numPlacas: '',
      servicio: '',
      ciudadPlaca: '',
    });
    setEnviando(false);
  };

  return (
    <div
      className="wrapper d-flex justify-content-center align-content-center"
      style={{ userSelect: "none" }}
    >
      <Modal
        show={showModal}
        style={{ fontSize: 18, userSelect: "none" }}
        centered
      >
        <Modal.Header>
          <center>
            <Modal.Title className="fw-bold" style={{ fontSize: 30 }}>
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
                      onChange={(e) => handleChange(e)}
                      autoComplete="off"
                      required
                    />
                  </div>
                  <div>
                    <label className="fw-bold">Nombre</label>
                    <input
                      id="name"
                      type="text"
                      value={multiple?.name}
                      style={{ textTransform: "uppercase" }}
                      className="form-control form-control-sm"
                      onChange={(e) => handleChange(e)}
                      autoComplete="off"
                      required
                    />
                  </div>
                  <div>
                    <label className="fw-bold">Concepto de la solicitud</label>
                    <select
                      className="form-select form-select-sm w-100 mt-2"
                      value={multiple.concepto}
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
                    {/* <input
                      id="numPlacas"
                      type="text"
                      value={multiple?.numPlacas}
                      disabled = {multiple.concepto === 'NUEVA'}
                      className="form-control form-control-sm"
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value, 10);
                        if (newValue >= 1 && newValue <= 3) {
                          setMultiple({
                            ...multiple,
                            numPlacas: newValue
                          });
                        } else if (e.target.value === '') {
                          setMultiple({
                            ...multiple,
                            numPlacas: ''
                          });
                        }
                      }}
                      autoComplete="off"
                      required
                    /> */}
                  </div>
                  <div>
                    <label className="fw-bold">Intervalo de placas</label>
                    <select
                      className="form-select form-select-sm w-100"
                      value={multiple.tipo}
                      id="tipo"
                      required
                      onChange={(e) => handleChange(e)}
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
                    {(multiple.tipo === 'AUTOMOVILES' || multiple.tipo === 'TRACTOMULA') &&
                      <div>
                        <div className="row row-cols-sm-2 justify-content-center align-items-center">
                          <div className="">
                            <label className="fw-bold">Desde</label>
                            <input
                              id="letrasDesde"
                              type="text"
                              placeholder="LETRAS"
                              value={multiple?.letrasDesde}
                              className="form-control form-control-sm"
                              onChange={(e) => (handleChange(e), handleLimit(e))}
                              autoComplete="off"
                              style={{ textTransform: "uppercase" }}
                              required
                              ref={input1Ref}
                            />
                          </div>
                          <div className="">
                            <label></label>
                            <input
                              id="noDesde"
                              type="number"
                              value={multiple?.noDesde}
                              className="form-control form-control-sm"
                              onChange={(e) => (handleChange(e), handleLimit(e))}
                              autoComplete="off"
                              placeholder="Desde"
                              required
                              ref={input2Ref}
                            />
                          </div>
                        </div>
                        <div className="row row-cols-sm-2 justify-content-center align-items-center">
                          <div className="">
                            <label className="fw-bold">Hasta</label>
                            <input
                              id="letrasHasta"
                              type="text"
                              placeholder="LETRAS"
                              value={multiple?.letrasHasta}
                              className="form-control form-control-sm"
                              onChange={(e) => (handleChange(e), handleLimit(e))}
                              autoComplete="off"
                              style={{ textTransform: "uppercase" }}
                              required
                              ref={input1Ref}
                            />
                          </div>
                          <div className="">
                            <label></label>
                            <input
                              id="noHasta"
                              type="number"
                              value={multiple?.noHasta}
                              placeholder="Hasta"
                              className="form-control form-control-sm"
                              onChange={(e) => (handleChange(e), handleLimit(e))}
                              autoComplete="off"
                              disabled={multiple?.noDesde === ""}
                              min={multiple.noDesde}
                              required
                              ref={input3Ref}
                            />
                          </div>
                        </div>
                      </div>
                    }
                    {(multiple.tipo === 'MOTOCICLETAS') &&
                      <div>
                        <div className="row row-cols-sm-3 justify-content-center align-items-center">
                          <div className="">
                            <label className="fw-bold">Desde</label>
                            <input
                              id="letrasDesde"
                              type="text"
                              placeholder="Letras"
                              value={multiple?.letrasDesde}
                              className="form-control form-control-sm"
                              onChange={(e) => (handleChange(e), handleLimit(e))}
                              autoComplete="off"
                              style={{ textTransform: "uppercase" }}
                              required
                              ref={input1Ref}
                            />
                          </div>
                          <div className="">
                            <label> </label>
                            <input
                              id="noDesde"
                              type="number"
                              placeholder="Desde"
                              value={multiple?.noDesde}
                              className="form-control form-control-sm"
                              onChange={(e) => (handleChange(e), handleLimitMoto(e))}
                              autoComplete="off"
                              required
                              ref={input2Ref}
                            />
                          </div>
                          <div className="">
                            <label> </label>
                            <input
                              id="letraFinal"
                              type="text"
                              value={multiple?.letraFinal}
                              className="form-control form-control-sm"
                              style={{textTransform:'uppercase'}}
                              onChange={(e) => (handleChange(e), handleLimitLetraFinal(e))}
                              autoComplete="off"
                              /* disabled={multiple?.noDesde === ""}
                              min={multiple.noDesde} */
                              required
                              /* ref={input3Ref} */
                            />
                          </div>
                        </div>
                        <div className="row row-cols-sm-3 justify-content-center align-items-center">
                          <div className="">
                            <label className="fw-bold">Hasta</label>
                            <input
                              id="letrasHasta"
                              type="text"
                              placeholder="Letras"
                              value={multiple?.letrasHasta}
                              className="form-control form-control-sm"
                              onChange={(e) => (handleChange(e), handleLimit(e))}
                              autoComplete="off"
                              style={{ textTransform: "uppercase" }}
                              required
                              ref={input1Ref}
                            />
                          </div>
                          <div className="">
                            <label> </label>
                            <input
                              id="noHasta"
                              type="number"
                              placeholder="Hasta"
                              value={multiple?.noHasta}
                              className="form-control form-control-sm"
                              onChange={(e) => (handleChange(e), handleLimitMoto(e))}
                              autoComplete="off"
                              required
                              ref={input2Ref}
                            />
                          </div>
                          <div className="">
                            <label> </label>
                            <input
                              id="letraFinal"
                              type="text"
                              value={multiple?.letraFinal}
                              className="form-control form-control-sm"
                              style={{textTransform:'uppercase'}}
                              onChange={(e) => (handleChange(e), handleLimitLetraFinal(e))}
                              autoComplete="off"
                              disabled
                              required
                            />
                          </div>
                        </div>
                      </div>
                    }
                    {(multiple.tipo === 'MOTOCARRO') &&
                      <div>
                        <div className="row row-cols-sm-2 justify-content-center align-items-center">
                        <div className="">
                            <label className="fw-bold">Desde</label>
                            <input
                              id="noDesde"
                              type="number"
                              value={multiple?.noDesde}
                              className="form-control form-control-sm"
                              onChange={(e) => (handleChange(e), handleLimit(e))}
                              autoComplete="off"
                              placeholder="NUMEROS"
                              required
                              ref={input2Ref}
                            />
                          </div>
                          <div className="">
                            <label></label>
                            <input
                              id="letrasDesde"
                              type="text"
                              placeholder="LETRAS"
                              value={multiple?.letrasDesde}
                              className="form-control form-control-sm"
                              onChange={(e) => (handleChange(e), handleLimit(e))}
                              autoComplete="off"
                              style={{ textTransform: "uppercase" }}
                              required
                              ref={input1Ref}
                            />
                          </div>
                          
                        </div>
                        <div className="row row-cols-sm-2 justify-content-center align-items-center">
                        <div className="">
                            <label className="fw-bold">Hasta</label>
                            <input
                              id="noHasta"
                              type="number"
                              value={multiple?.noHasta}
                              placeholder="NUMEROS"
                              className="form-control form-control-sm"
                              onChange={(e) => (handleChange(e), handleLimit(e))}
                              autoComplete="off"
                              disabled={multiple?.noDesde === ""}
                              min={multiple.noDesde}
                              required
                              ref={input3Ref}
                            />
                          </div>
                          <div className="">
                            <label></label>
                            <input
                              id="letrasHasta"
                              type="text"
                              placeholder="LETRAS"
                              value={multiple?.letrasHasta}
                              className="form-control form-control-sm"
                              onChange={(e) => (handleChange(e), handleLimit(e))}
                              autoComplete="off"
                              style={{ textTransform: "uppercase" }}
                              required
                              ref={input1Ref}
                            />
                          </div>
                          
                        </div>
                      </div>
                    }
                    <div>
                    <label className="fw-bold">Ciudad placa</label>
                      <input
                        id="ciudadPlaca"
                        type="text"
                        value={multiple?.ciudadPlaca}
                        style={{ textTransform: "uppercase" }}
                        className="form-control form-control-sm"
                        onChange={(e) => handleChange(e)}
                        autoComplete="off"
                        placeholder="-- Ciudad donde esta matriculada la placa --"
                        required
                      />
                    </div>
                    <label className="fw-bold">Servicio del vehículo</label>
                    <select
                      className="form-select form-select-sm w-100 mt-2"
                      value={multiple.servicio}
                      id="servicio"
                      required
                      onChange={(e) => handleChange(e)}
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
              <div className="d-flex w-100 mt-2">
                <span
                  className="text-center text-danger w-100 m-0"
                  style={{ height: 15 }}
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
                onClick={(e) => handleSubmit(e)}
              >
                {enviando ? (
                  <strong>
                    REGISTRANDO...
                    <GiSandsOfTime />
                  </strong>
                ) : (
                  "REGISTRAR"
                )}
              </button>
              <BotonCaancelar>Cancelar</BotonCaancelar>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}
