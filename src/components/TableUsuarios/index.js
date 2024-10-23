import * as FiIcons from 'react-icons/fi';
import DataTable from 'react-data-table-component'
import useAlert from '../../hooks/useAlert';
import { FaUserEdit } from "react-icons/fa";
import { useState } from 'react';
import ModalUsers from '../ModalUsers';
import { useNavigate } from 'react-router-dom';

export default function TableUsuarios({ users, loading , getAllUsers}) {
  const { successAlert } = useAlert()
  const [selected,setSelected] = useState('');
  const [showModal,setShowModal] = useState('');
  const navigate = useNavigate();

  const columns = [
    {
      id: "options",
      name: "",
      center: true,
      cell: (row, index, column, id) => (
        <div className='d-flex gap-2 p-1'>
          <button title="Editar empleado" className='btn btn-sm'
          style={{color:'white',backgroundColor:'black'}} onClick={(e) => {
            setSelected(row)
            /* localStorage.setItem('empleado',JSON.stringify(row))
            navigate('/editar/empleado') */
            setShowModal(true)
          }}>
            <FaUserEdit />
          </button>
        </div>
      ),
      width: '60px'
    },
    {
      id: "name",
      name: "Nombre",
      selector: (row) => row?.name,
      sortable: true,
      width:'cell-name'
    },
    {
      id: "username",
      name: "Username",
      selector: (row) => row?.username,
      sortable: true,
      width:'cell-name'
    },
    {
      id: "email",
      name: "Gmail",
      selector: (row) => row?.email,
      sortable: true,
      width:'cell-name'
    },
    {
      id: "password",
      name: "Contraseña",
      selector: (row) => '**************',
      sortable: true,
      class: 'cell-name'
    },
    {
      id: "role",
      name: "Cargo",
      selector: (row) => row?.role,
      sortable: true,
      width: '150px'
    }
  ]

  return (
  <div
      className="d-flex flex-column rounded m-0 p-0"
      style={{ height: "calc(100% - 60px)", width: "100%" }}
    >      
    <ModalUsers 
        entrenador={selected}
        setEntrenador={setSelected}
        showModal={showModal}
        setShowModal={setShowModal}
        reloadInfo={getAllUsers}
      />
      <DataTable
        className="bg-light text-center border border-2 h-100"
        style={{fontSize:20 , height:450}}
        columns={columns}
        data={users}
        fixedHeaderScrollHeight={200}
        progressPending={loading}
        progressComponent={
          <div class="d-flex align-items-center text-danger gap-2 mt-2">
            <strong>Cargando...</strong>
            <div
              class="spinner-border spinner-border-sm ms-auto"
              role="status"
              aria-hidden="true"
            ></div>
          </div>
        }
        dense
        striped
        fixedHeader
        noDataComponent={
          <div style={{padding: 24}}>Ningún resultado encontrado...</div>}  
      />
    </div>
  )
}