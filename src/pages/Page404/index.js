import Logo from '../../assest/Logo.png'
import './styles.css'

export default function Page404() {
  return (
    <div>
      <div className="position-fixed shadow w-100" style={{ fontSize: 20, left: 0, height: "60px", zIndex: 2, userSelect:'none' , backgroundColor:'black'}}>
        <div className="d-flex flex-row justify-content-between w-100 h-100 px-4 shadow">
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
      <div className=" wrapper d-flex flex-row justify-content-center align-items-center vh-100 w-100 m-auto" >
        <div className='rounded rounded-4' style={{backgroundColor:'white', border:'5px solid #E5BE01', boxShadow:'0 0 0 5px black'}}>
        <div className='d-flex flex-row p-2 m-2'>
        <img className='img-error' src={Logo} style={{borderRadius:10}} alt=''/>
        <div >
        <center>
        <label className='d-flex w-100 font-title' style={{color:'black'}}>¡¡ERROR!!</label>
        <h2>404 - page no found</h2>
        </center>
        </div>
      </div>
      </div>
      </div>
    </div>
  )
}