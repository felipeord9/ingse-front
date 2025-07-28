import { useEffect, useRef, useState , useContext } from "react";
import TablePlacas from "../TablePlacas";
import AuthContext from "../../context/authContext";
import { findSolicitudes } from "../../services/solicitudService";
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import './styles.css'

function AddPlacas({ placasAgr, setPlacasAgr }) {
  const [datos, setDatos] = useState({
    cedulaPropietario: "",
    nombrePropietario: "",
    celularPropietario: "",
    correoPropietario: "",
    placa: "",
    tipo:'',
    concepto: '',
    numPlacas: '',
    servicio: '',
    observations:''
  });
  const [clientes, setClientes] = useState();
  const [errors, setErrors] = useState([]);
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

  const handleChangeConcepto = (e) =>{
    const { id, value } = e.target;
    console.log(value);
    if(value === 'NUEVA'){
      setDatos({
        ...datos,
        [id]: value,
        numPlacas: 2
      });
    }else{
      setDatos({
        ...datos,
        [id]: value,
        numPlacas: 1
      });
    }
  }

  const handlerSubmit = (e) => {
    e.preventDefault();
    //funcion para comparar las placas, vin y chasis
    const filtroPorPlaca= clientes.filter((item)=>{
      if(item.placaDesde === datos.placa.toUpperCase()){
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
              text:`La placa: "${datos.placaDesde.toUpperCase()}" ya se encuentra registrada en nuestra base de datos
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
                  placaDesde: datos.placa.toUpperCase(),
                  concepto: datos.concepto.toUpperCase(),
                  servicio: datos.servicio.toUpperCase(),
                  numPlacas: datos.numPlacas,
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
                placaDesde: datos.placa.toUpperCase(),
                concepto: datos.concepto.toUpperCase(),
                servicio: datos.servicio.toUpperCase(),
                numPlacas: datos.numPlacas,
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
          placaDesde: datos.placa.toUpperCase(),
          concepto: datos.concepto.toUpperCase(),
          servicio: datos.servicio.toUpperCase(),
          numPlacas: datos.numPlacas,
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
      observations:'',
      concepto:'',
      numPlacas:'',
      servicio:''
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

  const handleFileUpload = (e) => {
  const file = e.target.files[0];

  const reader = new FileReader();
  reader.onload = (event) => {
    const bstr = event.target.result;
    const workbook = XLSX.read(bstr, { type: 'binary' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' }); // defval evita undefined

    const newErrors = [];
    const list = [];

    jsonData.forEach((datos, rowIndex) => {
      const requiredFields = [
        'id',
        'nombre',
        'celular',
        'correo',
        'placa',
        'concepto',
        'servicio',
        'noPlacas',
        'tipo'
      ];

      // Validar campos vacíos
      requiredFields.forEach((field) => {
        if (!datos[field] || datos[field].toString().trim() === '') {
          newErrors.push(`Fila ${rowIndex + 2} - Columna "${field}" está vacía.`);
        }
      });

      // Si no hay errores en esta fila, agregar a la lista
      if (!newErrors.length) {
        const newPlaca = {
          cedulaPropietario: datos.id,
          nombrePropietario: datos.nombre.toUpperCase(),
          celularPropietario: datos.celular,
          correoPropietario: datos.correo.toLowerCase(),
          placaDesde: datos.placa.toUpperCase(),
          concepto: datos.concepto.toUpperCase(),
          servicio: datos.servicio.toUpperCase(),
          numPlacas: datos.noPlacas,
          tipo: datos.tipo.toUpperCase(),
          createdAt: new Date(),
          userId: user.id,
          observations: 'El número de identidad y la placa ya se encontraban registrado al momento de hacer la solicitud. Se le informó al usuario y este continuó con el registro.'
        };

        list.push(newPlaca);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      /* setData([]); */ // No mostrar la tabla si hay errores
      setPlacasAgr({ agregados: [], total: 0 });
    } else {
      setErrors([]);
      /* setData(jsonData); */ // Puedes mostrar el json original si gustas
      setPlacasAgr({
        agregados: list,
        total: list.length
      });
    }
  };

  reader.readAsBinaryString(file);
};


  return (
    <>
      <div className="bg-light rounded shadow-sm p-3 mb-2">
        <div>
          <h6 className="fw-bold">AGREGAR SOLICITUD</h6>
          <form className=" mt-1" /* onSubmit={handlerSubmit} */>
            <div className="row row-cols-sm-4">
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
            </div>
            <div className="row row-cols-sm-4 mt-2">
              <div className="">
                <label>Concepto de la solicitud:</label>
                <select
                  className="form-select form-select-sm w-100"
                  value={datos.concepto}
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
              <div>
                <label>Servicio:</label>
                <select
                  className="form-select form-select-sm w-100"
                  value={datos.servicio}
                  id="servicio"
                  required
                  onChange={(e) => handlerChange(e)}
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
            <div className="mt-2">
              <h6>Subir Excel</h6>
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                className="d-flex w-100"
                onChange={handleFileUpload} 
              />

              {errors.length > 0 && (
                <div style={{ color: 'red', marginTop: '10px' }}>
                  <h4>Errores encontrados:</h4>
                  <ul>
                    {errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {placasAgr.length > 0 && (
                <table border="1" style={{ marginTop: '20px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {Object.keys(placasAgr[0]).map((key) => (
                        <th key={key} style={{ padding: '5px' }}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {placasAgr.map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).map((val, i) => (
                          <td key={i} style={{ padding: '5px' }}>{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
