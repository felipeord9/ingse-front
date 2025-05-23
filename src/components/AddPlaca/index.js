import { useEffect, useRef, useState , useContext } from "react";
import TablePlacas from "../TablePlacas";
import AuthContext from "../../context/authContext";
import { findSolicitudes } from "../../services/solicitudService";
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import Swal from "sweetalert2";
import './styles.css'

function AddPlacas({ placasAgr, setPlacasAgr }) {
  const [datos, setDatos] = useState({
    cedulaPropietario: "",
    nombrePropietario: "",
    celularPropietario: "",
    correoPropietario: "",
    placa: "",
    tipo:'',
    observations:''
  });
  const [clientes, setClientes] = useState();
  const { user } = useContext(AuthContext);

  /* logica para obtener los datos y poder compararlos con los ingresados */
  useEffect(() => {
    getAllRegistros();
  }, []);
  const getAllRegistros = () => {
    findSolicitudes()
      .then(({ data }) => {
        setClientes(data)
      })
      .catch((error) => {
        console.log('error')
      });
  }

  const formater = (number) => {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = "$1.";
    let arr = number.toString().split(".");
    arr[0] = arr[0].replace(exp, rep);
    return arr[1] ? arr.join(".") : arr[0];
  };

  const handlerChange = (e) => {
    const { id, value } = e.target;
    setDatos({
      ...datos,
      [id]: value,
    });
  };

  const handlerSubmit = (e) => {
    e.preventDefault();
    //funcion para comparar las placas, vin y chasis
    const filtroPorPlaca= clientes.filter((item)=>{
      if(item.placa === datos.placa.toUpperCase()){
        return item
      }
    })
    //funcion para buscar si la cedula ya esta registrada
    const filtroCliente = clientes.filter((item)=>{
      if(item.cedulaPropietario === datos.cedulaPropietario){
        return item
      }
    })
    const list = [...placasAgr.agregados];
    
    if(filtroCliente.length > 0){
      Swal.fire({
        icon:'warning',
        title:'¡ATENCIÓN!',
        text:`El numero de identificación: ${datos.cedulaPropietario},
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
          if(filtroPorPlaca.length > 0 ){
            Swal.fire({
              title:'AVISO',
              text:`La placa: "${datos.placa.toUpperCase()}" ya se encuentra registrada en nuestra base de datos
              con las fechas: ${devolverLista(filtroPorPlaca)}. ¿Desea continuar?`,
              showConfirmButton: true,
              showDenyButton: true,
              confirmButtonText: 'Si',
              confirmButtonColor:'green',
              denyButtonText: 'No',
            }).then(({isConfirmed, isDenied})=>{
              if(!datos.placa){
                Swal.fire({
                  icon:'warning',
                  title:'¡ATENCIÓN!',
                  text:'Debes especificar el número de placa para agregar la solicitud.',
                  showConfirmButton: true,
                  confirmButtonColor:'red',
                })
              }else{
                const newPlaca = {
                  cedulaPropietario: datos.cedulaPropietario,
                  nombrePropietario: datos.nombrePropietario.toUpperCase(),
                  celularPropietario: datos.celularPropietario,
                  correoPropietario: datos.correoPropietario.toLowerCase(),
                  placa: datos.placa.toUpperCase(),
                  tipo: datos.tipo.toUpperCase(),
                  createdAt: new Date(),
                  userId: user.id,
                  observations: 'El número de identidad y la placa ya se encontraban registrado al momento de hacer la solicitud. Se le informó al usuario y este continuó con el regustro.'
                };
            
                list.push(newPlaca);
                setPlacasAgr({
                  agregados: list,
                  total: list?.length
                });
                cleanForm();
              }
            })
          }else{
            if(!datos.placa){
              Swal.fire({
                icon:'warning',
                title:'¡ATENCIÓN!',
                text:'Debes especificar el número de placa para agregar la solicitud.',
                showConfirmButton: true,
                confirmButtonColor:'red',
              })
            }else{
              const newPlaca = {
                cedulaPropietario: datos.cedulaPropietario,
                nombrePropietario: datos.nombrePropietario.toUpperCase(),
                celularPropietario: datos.celularPropietario,
                correoPropietario: datos.correoPropietario.toLowerCase(),
                placa: datos.placa.toUpperCase(),
                tipo: datos.tipo.toUpperCase(),
                createdAt: new Date(),
                userId: user.id,
                observations: 'El número de identidad ya se encontraban registrado al momento de hacer la solicitud. Se le informó al usuario y este continuó con el regustro.'
              };
          
              list.push(newPlaca);
              setPlacasAgr({
                agregados: list,
                total: list?.length
              });
              cleanForm();
            }
          }
        }
      })
    }else{
      if(!datos.placa){
        Swal.fire({
          icon:'warning',
          title:'¡ATENCIÓN!',
          text:'Debes especificar el número de placa para agregar la solicitud.',
          showConfirmButton: true,
          confirmButtonColor:'red',
        })
      }else{
        const newPlaca = {
          cedulaPropietario: datos.cedulaPropietario,
          nombrePropietario: datos.nombrePropietario.toUpperCase(),
          celularPropietario: datos.celularPropietario,
          correoPropietario: datos.correoPropietario.toLowerCase(),
          placa: datos.placa.toUpperCase(),
          tipo: datos.tipo.toUpperCase(),
          observations: datos.observations,
          createdAt: new Date(),
          userId: user.id,
        };
    
        list.push(newPlaca);
        setPlacasAgr({
          agregados: list,
          total: list?.length
        });
        cleanForm();
      }
    }
  };
  
  const cleanForm = () => {
    setDatos({
      cedulaPropietario: "",
      nombrePropietario: "",
      celularPropietario: "",
      correoPropietario: "",
      placa: "",
      tipo:'',
      observations:''
    });
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
    <>
      <div className="bg-light rounded shadow-sm p-3 mb-2">
        <div>
          <h6 className="fw-bold">AGREGAR SOLICITUD</h6>
          <form className=" mt-1" /* onSubmit={handlerSubmit} */>
            <div className="row row-cols-sm-3">
              <div className="">
                <label>No. Identificación:</label>
                <input
                  id="cedulaPropietario"
                  type="number"
                  placeholder=""
                  value={datos.cedulaPropietario}
                  className="form-control form-control-sm"
                  min={1000}
                  aria-controls="off"
                  onChange={(e) => {
                    handlerChange(e);
                  }}
                  
                />
              </div>
              <div className="">
                <label>Nombre:</label>
                <div className="d-flex align-items-center position-relative w-100">
                  <input
                    id="nombrePropietario"
                    type="search"
                    autoComplete="off"
                    placeholder=""
                    value={datos.nombrePropietario}
                    onChange={(e)=>handlerChange(e)}
                    style={{textTransform:'uppercase'}}
                    className="form-control form-control-sm input-select"
                  />
                </div>
              </div>
              <div className="">
                <label>Celular:</label>
                <input
                  id="celularPropietario"
                  type="number"
                  value={datos.celularPropietario}
                  onChange={(e)=>handlerChange(e)}
                  className="form-control form-control-sm"
                />
              </div>
            </div>
            <div className="row row-cols-sm-3 mt-2">
              <div className="">
                <label>Correo electrónico:</label>
                <input
                  id="correoPropietario"
                  type="email"
                  placeholder=""
                  style={{textTransform:'lowercase'}}
                  value={datos.correoPropietario}
                  className="form-control form-control-sm"
                  onChange={handlerChange}
                />
              </div>
              <div className="">
                <label>No. Placa:</label>
                <input
                  id="placa"
                  type="text"
                  value={datos.placa}
                  style={{textTransform:'uppercase'}}
                  className="form-control form-control-sm"
                  autoComplete="off"
                  onChange={handlerChange}
                />
              </div>
              <div className="">
                <label>Tipo de vehículo:</label>
                <select
                  className="form-select form-select-sm w-100"
                  value={datos.tipo}
                  id="tipo"
                  required
                  onChange={(e) => handlerChange(e)}
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
            </div>
            <div className="d-flex justify-content-center w-100 mt-3">
              <button
                type="submit"
                className="d-flex align-items-center justify-content-center btn btn-sm btn-primary bt-add"
                onClick={handlerSubmit}
              >
                AGREGAR SOLICITUD
                <VscGitPullRequestNewChanges className="ms-1" style={{ width: 20, height: 20 }} />
              </button>
            </div>
          </form>
        </div>
      </div>
      <TablePlacas
        list={placasAgr}
        setList={setPlacasAgr}
        formater={formater}
      />
    </>
  );
}

export default AddPlacas;
