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
    cedula: "",
    name: "",
    cantidad: "",
    letras: "",
    noDesde: "",
    noHasta: "",
    tipo: "",
    letraFinal: "",
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
      (multiple.name !== "" && multiple.cedula !== "",
      multiple.cantidad !== "" && multiple.letras !== "",
      multiple.noDesde !== "" && multiple.noHasta !== "")
    ) {
      const total = Number(multiple.noHasta) - Number(multiple.noDesde) + 1 ;
      if (total !== Number(multiple.cantidad)) {
        Swal.fire({
          icon: "warning",
          /* title: `${total} - ${multiple.cantidad} - ${multiple.letras.toUpperCase()}`, */
          title: "¡ERROR!",
          text: "La cantidad ingresada debe coincidir con la cantidad entre el numero desde y el numero hasta de las placas solicitadas. Verifique la información suministrada.",
          confirmButtonColor: "red",
        });
      } else {
        setEnviando(true);
        const body = {
          cedulaPropietario: multiple.cedula,
          nombrePropietario: multiple.name.toUpperCase(),
          cantidad: multiple.cantidad,
          letras: multiple.letras.toUpperCase(),
          tipo: multiple.tipo.toUpperCase(),
          desde: parseInt(multiple.noDesde),
          hasta: parseInt(multiple.noHasta),
          letraFinal: multiple.letraFinal.toUpperCase(),
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
              reloadInfo();
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
      }
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
                    <label className="fw-bold">Cantidad</label>
                    <input
                      id="cantidad"
                      type="text"
                      value={multiple?.cantidad}
                      className="form-control form-control-sm"
                      onChange={(e) => handleChange(e)}
                      autoComplete="off"
                      required
                    />
                  </div>
                  <div>
                    <label className="fw-bold">intervalo de placas</label>
                    <div className="d-flex w-100 justify-content-center align-items-center gap-3">
                      <FormControlLabel
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "1rem", // Cambia el tamaño del texto del label
                          },
                        }}
                        label="Motocicleta"
                        control={
                          <Checkbox
                            placeholder="Motocicleta"
                            color="warning"
                            checked={multiple.tipo === 'Moto'}
                            onChange={() => handleTipoVehiculo("Moto")}
                            className="mt-0 t-0 pe-2"
                            sx={{
                              "& .MuiSvgIcon-root": { fontSize: 21 }, // Cambia el tamaño del ícono del checkbox
                            }}
                          />
                        }
                      />
                      <FormControlLabel
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "1rem", // Cambia el tamaño del texto del label
                          },
                        }}
                        label="Automóvil"
                        control={
                          <Checkbox
                            placeholder="Automovil"
                            color="warning"
                            className="pe-2"
                            checked={multiple.tipo === 'Automovil'}
                            onChange={() => handleTipoVehiculo("Automovil")}
                            sx={{
                              "& .MuiSvgIcon-root": { fontSize: 21 }, // Cambia el tamaño del ícono del checkbox
                            }}
                          />
                        }
                      />
                    </div>
                    {(multiple.tipo === 'Automovil') &&
                      <div className="row justify-content-center align-items-center">
                        <div className="col col-12 col-lg-3 colmd-12">
                          <label>Letras</label>
                          <input
                            id="letras"
                            type="text"
                            value={multiple?.letras}
                            className="form-control form-control-sm"
                            onChange={(e) => (handleChange(e), handleLimit(e))}
                            autoComplete="off"
                            style={{ textTransform: "uppercase" }}
                            required
                            ref={input1Ref}
                          />
                        </div>
                        <div className="col col-12 col-lg-3 col-md-12">
                          <label>Números</label>
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
                        <label className="fw-bold col col-12 col-lg-1 col-md-1 mt-4">
                          {" "}
                          -{" "}
                        </label>
                        <div className="col col-12 col-lg-3 col-md-12">
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
                    }
                    {(multiple.tipo === 'Moto') &&
                      <div className="row justify-content-center align-items-center">
                        <div className="col col-12 col-lg-3 col-md-12">
                          <label>Letras</label>
                          <input
                            id="letras"
                            type="text"
                            value={multiple?.letras}
                            className="form-control form-control-sm"
                            onChange={(e) => (handleChange(e), handleLimit(e))}
                            autoComplete="off"
                            style={{ textTransform: "uppercase" }}
                            required
                            ref={input1Ref}
                          />
                        </div>
                        <div className="col col-12 col-lg-3 col-md-12">
                          <label>Números</label>
                          <input
                            id="noDesde"
                            type="number"
                            value={multiple?.noDesde}
                            className="form-control form-control-sm"
                            onChange={(e) => (handleChange(e), handleLimitMoto(e))}
                            autoComplete="off"
                            placeholder="Desde"
                            required
                            ref={input2Ref}
                          />
                        </div>
                        <label className="fw-bold col col-12 col-lg-1 col-md-1 mt-4">
                          {/* {" "} */}
                          -{/* {" "} */}
                        </label>
                        <div className="col col-12 col-lg-3 col-md-12">
                          <label></label>
                          <input
                            id="noHasta"
                            type="number"
                            value={multiple?.noHasta}
                            placeholder="Hasta"
                            className="form-control form-control-sm"
                            onChange={(e) => (handleChange(e), handleLimitMoto(e))}
                            autoComplete="off"
                            disabled={multiple?.noDesde === ""}
                            min={multiple.noDesde}
                            required
                            ref={input3Ref}
                          />
                        </div>
                        <div className="col col-12 col-lg-2 col-md-12">
                          <label>Letra</label>
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
                    }
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
