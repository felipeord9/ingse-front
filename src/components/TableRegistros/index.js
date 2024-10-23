import { useState, useEffect, useContext } from "react";
import * as FaIcons from "react-icons/fa";
import DataTable from 'react-data-table-component'
import useAlert from '../../hooks/useAlert';
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { Modal } from "react-bootstrap";
import DocRequestrPDF from "../../components/DocRequestPDF";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import './styles.css'

export default function TableRegistros({ registros, loading , getAllRegistros , selectedRequest , setSelectedRequest}) {
  const { successAlert } = useAlert()
  const [selected,setSelected] = useState('');
  const [showModal,setShowModal] = useState('');
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 600px)");
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", () =>
      setIsMobile(mediaQuery.matches)
    );
    return () =>
      mediaQuery.removeEventListener("change", () =>
        setIsMobile(mediaQuery.matches)
      );
  }, []);

  const columns = [
    {
      id: "ver",
      name: "ver",
      center: true,
      sortable: true,
      cell: (row, index, column, id) =>
        isMobile ? (
          <div className="d-flex gap-2 p-1">
            <PDFDownloadLink
              document={<DocRequestrPDF request={row} />}
              fileName={`${row?.nitClient}-PDV-${row?.nameClient}.pdf`}
              onClick={(e) => {
                e.download();
              }}
            >
              <FaIcons.FaDownload />
            </PDFDownloadLink>
          </div>
        ) : (
          <div className="d-flex gap-2 p-1">
            <button
              title="Ver PDF de Solicitud"
              className="btn btn-sm btn-primary"
              onClick={(e) => {
                setSelectedRequest(row);
              }}
            >
              <FaIcons.FaEye />
            </button>
          </div>
        ),
      width: "50px",
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
      <DataTable
        className="bg-light text-center border border-2 h-100"
        style={{fontSize:20 , height:450}}
        columns={columns}
        data={registros}
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
      <Modal
        size="lg"
        show={Boolean(selectedRequest && !isMobile)}
        onHide={() => setSelectedRequest(null)}
      >
        <PDFViewer
          className="rounded"
          style={{
            width: "100%",
            height: "90vh",
          }}
          showToolbar={true}
        >
          <DocRequestrPDF request={selectedRequest} />
        </PDFViewer>
      </Modal>
    </div>
  )
}