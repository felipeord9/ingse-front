import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useUser from '../../hooks/useUser';
import * as Bs from "react-icons/bs";
import { changeRecoveryPassword } from '../../services/authService'
import { RiArrowGoBackFill } from "react-icons/ri";
import { HiLogin } from "react-icons/hi";
import { TbLogin } from "react-icons/tb";
import { GiSandsOfTime } from "react-icons/gi";
import Logo from '../../assest/Logo.png'
import './styles.css'

export default function RecoveryPassword() {
    const { isLogged } = useUser()
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [errorInput, setErrorInput] = useState('')
    const { token } = useParams()
    const navigate = useNavigate()
    const [vacio,setVacio] = useState(false);
    const [cargando,setCargando] = useState(false);
    const [noCoincede, setNoCoincide] = useState(false);
    useEffect(() => {
      if (isLogged) navigate('/registros');
    }, [isLogged, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCargando(true)
    if(newPassword !== confirmNewPassword) {
      setCargando(false)
      setNoCoincide(true)
      setTimeout(() => setNoCoincide(false), 3000)      
      setErrorInput('La contraseña nueva no coincide')
      return setTimeout(() => setErrorInput (''), 3000)
    }
    if(newPassword !== '' && confirmNewPassword !== ''){
      if(newPassword.length > 4){
        changeRecoveryPassword({token, newPassword})
          .then((data) => {
            setCargando(false)
            Swal.fire({
              title: "¡CORECTO!",
              text: "La contraseña se ha cambiado exitosamente.",
              confirmButtonText: "Aceptar",
              confirmButtonColor:'green',
              timer: 3000
            })
            navigate('/login')
          })
          .catch((error) => {
            setCargando(false)
            Swal.fire({
              icon:'warning',
              title:'!ERROR¡',
              text:'Hubo un error a la hora de cambiar la contraseña, intentalo de nuevo. Si el problema persistema comunicate con los programadores para darte una rápida y oportuna solución.',
              confirmButtonColor:'green'
            })
            /* setErrorInput('El token ha expirado, será redirigido al login')
            return setTimeout(() => navigate('/login'), 4000) */
          })
      }else{
        setCargando(false)
        Swal.fire({
          icon:'warning',
          title:'¡Atención!',
          text:'La contraseña debe tener por lo menos 4 caracteres. verifica la información suministrada.',
          showConfirmButton:true,
          confirmButtonColor:'red'
        })
      }
    }else{
      setCargando(false)
      setVacio(true)
      setTimeout(() => setVacio(false), 3000)      

    }
  }
  const [shown,setShown]=useState("");
  const switchShown =()=>setShown(!shown);

  const [mostrar,setMostrar]=useState('');
  const switchMostart=()=>setMostrar(!mostrar);

  const BotonColorCambiante = ({ children }) => {
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
      transform: hover ? 'scale(1.1)' : 'scale(1)',
      transition: 'all 0.3s ease',
    };
    return (
      <button
        className="fw-bold mb-2"
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        type='submit'
      >
        {children}
      </button>
    );
  };

  return (
    <div >
      <div className="position-fixed shadow w-100" style={{ fontSize: 20, left: 0, height: "60px", zIndex: 2, userSelect:'none' , backgroundColor:'black'}}>
        <div className="d-flex flex-row justify-content-between w-100 h-100 px-4 shadow">
          <nav className="navbar p-0 m-0">
            <button 
              className="pt-2 mt-1 ms-0 p-2" 
              style={{backgroundColor:'black',color:'white'}}
              onClick={(e)=>navigate('/login')}
            >
              <TbLogin className='me-1 mb-1'/>Login
            </button>
          </nav>
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
              <h2 style={{color:'white'}} className='mt-1'> INGSE</h2>   
              
            </div>
          </div>
      </div>
      <div className='container d-flex justify-content-center align-items-center ' style={{height:'100vh'}}>
        <div className='content text-align-center rounded-4 p-4 ' style={{backgroundColor:'white', border:'5px solid #E5BE01', boxShadow:'0 0 0 5px black'}}> 
          <h1 className='fw-bold' style={{color:'black'}}><strong>Cambiar contraseña</strong></h1>
          <form onSubmit={handleSubmit} className=''>
            <div className='input_group mt-3 mb-3 d-flex m-5 '>
              <input type={shown ? 'text':'password'} id='contraseña' className='input_group_input w-100' required onChange={(e)=> setNewPassword(e.target.value)}/>
              <label for="contraseña" className='input_group_label'>Nueva contraseña</label>
              <span className='position-absolute' onClick={switchShown}  style={{ right: 10, cursor: "pointer",fontSize:25 }}>{shown ? <Bs.BsEye/>:<Bs.BsEyeSlash/>}</span>
            </div>
            <div className='input_group mt-3 mb-3 d-flex flex-column m-5'>
              <input type={mostrar ? 'text':'password'} id='confirm' onChange={(e)=>setConfirmNewPassword(e.target.value)} className='input_group_input' required/>
              <label for='confirm' className='input_group_label'>Ingresar de nuevo</label>
              <span className='position-absolute' onClick={switchMostart}  style={{ right: 10, cursor: "pointer",fontSize:25 }}>{mostrar ? <Bs.BsEye/>:<Bs.BsEyeSlash/>}</span>
            </div>
            <div className='align-content-center text-align-center align-items-center'>
              <center>
              <BotonColorCambiante type="submit">{cargando ? <strong>Cargando... <GiSandsOfTime /></strong>:<strong>Reestablecer</strong>}</BotonColorCambiante>
              </center>
            </div>
            {noCoincede && <div className='text-danger text-center mt-2 fw-bold'>Contraseñas no coinciden</div>}
            {vacio && <div className='text-danger text-center mt-2 fw-bold'>Credenciales Inválidas</div>}
          </form>
        </div>
      </div>
    </div>
  )
}