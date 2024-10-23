import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from 'sweetalert2'
import { createUser, findUserByEmail, updateUser } from "../../services/userService";
import { FiEdit3 } from "react-icons/fi";
/* import bcrypt from 'bcrypt';
 */
export default function ModalUsers({
  entrenador,
  setEntrenador,
  showModal,
  setShowModal,
  reloadInfo,
}) {
  const [info, setInfo] = useState({});
  const [user, setUser] = useState({});
  const [nonePass,setNonePass] = useState(false);
  const [newPassword,setNewPassword] = useState(false)
  const [error, setError] = useState('')
 
  useEffect(() => {
    if(entrenador) {
      setInfo(entrenador)
      setUser(entrenador)
    }
  }, [entrenador])

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser({
      ...user,
      [id]: value,
    });
  };

  const [correoInvali,setCorreoInvali] = useState(false)
  const [emailEditado, setemailEditado] = useState(false)
  const [correoExit,setCorreoExist] = useState(false)

  const handleUpdateEntrenador = (e) => {
    e.preventDefault();
    if(newPassword ? user?.password !== '' && user?.password?.length > 4 : user?.password?.length !==''){
      if(emailEditado ? user.email!=='' && user.email.includes('@') && user.email.split('@')[1].includes('.') : user.email !==''){
        if(emailEditado){
          findUserByEmail(user.email)
          .then(()=>{
            setCorreoExist(true)
            setTimeout(() => setCorreoExist(false), 3000) 
          })
          .catch(()=>{
            Swal.fire({
              title: '¿Está segur@ de querer editar este perfil?',
                  showDenyButton: true,
                  confirmButtonText: 'Confirmar',
                  confirmButtonColor: 'green',
                  denyButtonText: `Cancelar`,
                  denyButtonColor:'red',
                  icon:'question'
              }).then((result)=>{
              if(result.isConfirmed){
                const body={
                  email:user.email,
                  username: user.username,
                  name: user.name.toUpperCase(),
                  password: newPassword && user.password,
                  role: user.role,
                }
                updateUser(entrenador.id, body)
                  .then((data) => {  
                    reloadInfo();
                    setShowModal(!showModal)
                    setCorreoExist(false)
                    setemailEditado(false)
                    setCorreoInvali(false)
                    Swal.fire({
                      title: '¡Correcto!',
                      text: 'El usuario se ha actualizado correctamente',
                      showConfirmButton: false,
                      timer: 2500
                    })
                  })
              }else if(result.isDenied){
                Swal.fire('Oops', 'La información suministrada se ha descartado', 'info')
                reloadInfo();
                setShowModal(!showModal)
              }
              cleanForm()
              }).catch((error) => {
                reloadInfo();
                setError('Error al cargar la información del usuario')
                setTimeout(() => setError(''), 2500)
              });
          })
        }else{
          Swal.fire({
          title: '¿Está segur@ de querer editar este perfil?',
              showDenyButton: true,
              confirmButtonText: 'Confirmar',
              confirmButtonColor: 'green',
              denyButtonText: `Cancelar`,
              denyButtonColor:'red',
              icon:'question'
          }).then((result)=>{
          if(result.isConfirmed){
            const body={
              email:user.email,
              username: user.username,
              name: user.name.toUpperCase(),
              password: newPassword && user.password,
              role: user.role,
            }
            updateUser(entrenador.id, body)
              .then((data) => {  
                setShowModal(!showModal)
                reloadInfo();
                setCorreoExist(false)
                setemailEditado(false)
                setCorreoInvali(false)
                Swal.fire({
                  title: '¡Correcto!',
                  text: 'El usuario se ha actualizado correctamente',
                  showConfirmButton: false,
                  timer: 2500
                })
              })
          }else if(result.isDenied){
            Swal.fire('Oops', 'La información suministrada se ha descartado', 'info')
            reloadInfo();
            setShowModal(!showModal)
            setCorreoExist(false)
            setemailEditado(false)
            setCorreoInvali(false)
          }
          cleanForm()
          }).catch((error) => {
            reloadInfo();
            setError('Error al cargar la información del usuario')
            setTimeout(() => setError(''), 2500)
          });
        }
      }else{
        setCorreoInvali(true)
        setTimeout(() => setCorreoInvali(false), 3000) 
      }
    }else{
      setNonePass(true)
      setTimeout(() => setNonePass(false), 3000) 
    }
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if(user.password !== '' && user.password.length > 4){
      if(user.email!=='' && user.email.includes('@') && user.email.split('@')[1].includes('.')){
        const body={
          email:user.email,
          rowId: user.rowId,
          username: user.username,
          name: user.name.toUpperCase(),
          password: user.password,
          role: user.role,
        }
        createUser(body)
        .then((data) => {
          setShowModal(!showModal)
          reloadInfo();
          Swal.fire({
            title: '¡Correcto!',
            text: 'El usuario se ha creado correctamente',
            icon: 'success',
            showConfirmButton: false,
            timer: 2500
          })
          cleanForm()
        })
        .catch((error) => {
          Swal.fire({
            title:`${error}`
          })
          setError('Error al cargar la información del usuario')
          setTimeout(() => setError(''), 2500)
        });
      }else{
        setCorreoInvali(true)
        setTimeout(() => setCorreoInvali(false), 3000) 
      }
    }else{
      setNonePass(true)
      setTimeout(() => setNonePass(false), 3000) 
    }
  }

  const cleanForm = () => {
    setUser({
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
          cleanForm()
          setEntrenador && setEntrenador(null)
          setNewPassword(false)
          setNonePass(false)
        }}
      >
        {children}
      </button>
    );
  };

  const handleCancelar = (e) =>{
    e.preventDefault();
    Swal.fire({
      title:'¡Atención',
      icon:'warning',
      text:'Se continuas con esta acción, se perderán todo lo que hayas realizado. ¿Estás segur@?',
      showCancelButton:true,
      cancelButtonColor:'red',
      cancelButtonText:'Cancelar',

      showConfirmButton:true,
      confirmButtonColor:'green',
      confirmButtonText:'Descartar'
    }).then(({isConfirmed})=>{
      if(isConfirmed){
        window.location.reload();
      }
    })
  }

  return (
    <div className="wrapper d-flex justify-content-center align-content-center" style={{userSelect:'none'}}>
    <Modal show={showModal} style={{ fontSize: 18, userSelect:'none' }} centered>
      <Modal.Header>
        <center>
        <Modal.Title className="fw-bold" style={{fontSize:40}}>
          <strong>{entrenador ? 'Actualizar Usuario' : 'Crear usuario'} </strong>
        </Modal.Title>
        </center>
      </Modal.Header>
      <form onSubmit={entrenador ? handleUpdateEntrenador : handleCreateUser}>
      <Modal.Body className="p-2">
        <div className="m-2 h-100">
            <div>
              <div>
              <div>
                <label className="fw-bold">Cédula</label>
                <input
                  id="rowId"
                  type="text"
                  value={user?.rowId}
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
                  value={(user?.name)}
                  style={{textTransform:'uppercase'}}
                  className="form-control form-control-sm"
                  onChange={(e)=> (handleChange(e))}
                  autoComplete="off"
                  required
                />
              </div>
              <div>
                <label className="fw-bold">Usuario</label>
                <input
                  id="username"
                  type="text"
                  value={user?.username}
                  className="form-control form-control-sm"
                  onChange={(e)=> (handleChange(e))}
                  autoComplete="off"
                  required
                />
              </div>
              {entrenador ? 
                <div>
                  <label className="fw-bold">Correo electrónico</label>
                  <input
                    id="email"
                    type="email"
                    value={user?.email}
                    className="form-control form-control-sm"
                    onChange={(e)=> (handleChange(e),setemailEditado(true))}
                    autoComplete="off"
                    required
                  />
                </div>
                :
                <div>
                  <label className="fw-bold">Correo electrónico</label>
                  <input
                    id="email"
                    type="email"
                    value={user?.email}
                    className="form-control form-control-sm"
                    onChange={(e)=> (handleChange(e))}
                    autoComplete="off"
                    required
                  />
                </div>
              }
              {entrenador ?
                <div>
                <label className="fw-bold">Contraseña</label>
                <div className="d-flex flex-row">
                <input
                  id="password"
                  type="text"
                  value={newPassword ? user?.password : '*************'}
                  className="form-control form-control-sm me-3"
                  onChange={handleChange}
                  disabled={newPassword ? false:true}
                  autoComplete="off"
                  required
                />
                <button title="Editar empleado" className='btn btn-sm'
                  style={{color:'white',backgroundColor:'black'}} onClick={(e) => {
                    setNewPassword(true)
                    setUser({
                      password:''
                    })
                  }}>
                    <FiEdit3 />
                </button>
                </div>
                </div> 
                :
                <div>
                  <label className="fw-bold">Contraseña</label>
                  <div className="d-flex flex-row">
                    <input
                      id="password"
                      type="text"
                      value={ user?.password }
                      className="form-control form-control-sm me-3"
                      onChange={handleChange}
                      autoComplete="off"
                      required
                    />
                  </div>
                </div>
              }
              <div>
                <label className="fw-bold">Cargo</label>
                <select
                  id="role"
                  value={user?.role}
                  className="form-select form-select-sm"
                  onChange={handleChange}
                  required
                >
                  <option selected disabled value="">
                    -- Seleccione un cargo --
                  </option>
                  <option value="usuario">USUARIO</option>
                  <option value="admin">ADMINISTRADOR</option>
                </select>
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
            {/* <div className="d-flex justify-content-center gap-2 mt-2 ">
              <BotonColorCambiante>Actualizar</BotonColorCambiante>
              <BotonCaancelar>
                Cancelar
              </BotonCaancelar>
            </div> */}
            {correoExit && <div className='text-danger text-center p-0 m-0 fw-bold'>Este correo ya está registrado</div> }
            {correoInvali && <div className='text-danger text-center p-0 m-0 fw-bold'>Correo Inválido</div> }
            {nonePass && <div className='text-danger text-center p-0 m-0 fw-bold'>Ingresa una contraseña nueva</div> }
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-center gap-2 mt-2 ">
          {/* <BotonColorCambiante>{entrenador ? 'Actualizar' : 'Crear'}</BotonColorCambiante> */}
          <button
            className="fw-bold mb-3"
            style={buttonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            type='submit'
            /* onSubmit={entrenador ? handleUpdateEntrenador : createUser} */
            >
            {entrenador ? 'Actualizar' : 'Crear'}
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
