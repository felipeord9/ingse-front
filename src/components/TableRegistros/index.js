import { useState, useEffect, useContext } from "react";
import * as FaIcons from "react-icons/fa";
import DataTable from 'react-data-table-component'
import useAlert from '../../hooks/useAlert';
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { Modal } from "react-bootstrap";
import useUser from "../../hooks/useUser";
import AuthContext from "../../context/authContext";
import { format } from "date-fns";
import DocReqPdf from "../DocReqPdf";
import DocRequestrPDF from "../../components/DocRequestPDF";
import { PDFViewer, PDFDownloadLink , pdf } from "@react-pdf/renderer";
import './styles.css'

export default function TableRegistros({ registros, loading , getAllRegistros , selectedRequest , setSelectedRequest}) {
  const { successAlert } = useAlert()
  const [selected,setSelected] = useState('');
  const [showModal,setShowModal] = useState('');
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(null);
  const { user } = useContext(AuthContext);

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

  const handleDownload = async (row) => {
    try {
      // Generar PDF en el momento
      const blob = await pdf(<DocRequestrPDF request={row} />).toBlob();

      // Crear enlace temporal
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${row?.numeroFactura}-${new Date(row?.createdAt).getDay()}/${new Date(row?.createdAt).getMonth()}/${new Date(row?.createdAt).getFullYear()}-${(row?.placaDesde)}.pdf`;
      a.click();

      // Liberar memoria
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar el PDF", error);
    }
  };

  const columns = [
    {
      id: "ver",
      name: "",
      center: true,
      sortable: true,
      cell: (row, index, column, id) =>
        isMobile ? (
          <div className="d-flex gap-0 p-0">
            <button
                className="btn btn-sm btn-primary"
                onClick={() => handleDownload(row)}
                style={{
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <FaIcons.FaDownload />
              </button>
            {/* <PDFDownloadLink
              document={<DocRequestrPDF request={row} />}
              fileName={`${row?.numeroFactura}-${new Date(row?.createdAt).getDay()}/${new Date(row?.createdAt).getMonth()}/${new Date(row?.createdAt).getFullYear()}-${(row?.placaDesde)}`}
            >
              <FaIcons.FaDownload />
            </PDFDownloadLink> */}
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
            {user.role === 'admin' &&
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => handleDownload(row)}
                style={{
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <FaIcons.FaDownload />
              </button>
            }
            {/* <PDFDownloadLink
              className="d-flex h-100 w-100 justify-content-center align-items-center m-2"
              document={<DocReqPdf request={row} />}
              fileName={`${format(new Date(row?.createdAt), 'yyyy/MM/dd')}-${row.nombrePropietario}-${(row?.placaDesde)}`}

            >
              <FaIcons.FaDownload />
            </PDFDownloadLink> */}
            
          </div>
        ),
      width: "80px",
    },
    {
      id: "editar",
      name: "",
      center: true,
      cell: (row, index, column, id) => user.role === 'admin' ? (
        <div className='d-flex gap-2 p-1'>
          <button 
            title="Editar registro" className='btn btn-sm'
            style={{color:'white',backgroundColor:'black'}} 
            onClick={(e) => {
              setSelected(row)
              navigate(`/editar/registro/${row.id}`)
            }}
          >
            <FaUserEdit />
          </button>
        </div>
      ):(
        <PDFDownloadLink
          className="d-flex h-100 w-100 justify-content-center align-items-center m-2"
          document={<DocReqPdf request={row} />}
          fileName={`${format(new Date(row?.createdAt), 'yyyy/MM/dd')}-${row.nombrePropietario}-${(row?.placaDesde)}`}
        >
          <FaIcons.FaDownload />
        </PDFDownloadLink>
      ),
      width: '60px'
    },
    {
      id: "cedulaPropietario",
      name: "ID",
      selector: (row) => row?.cedulaPropietario,
      sortable: true,
      width: '140px'
    },
    {
      id: "nombre",
      name: "Nombre",
      selector: (row) => row.nombrePropietario === null ? `${row.primerApellidoPropietario} ${row.segundoApellidoPropietario} ${row.primerNombrePropietario} ${row.segundoNombrePropietario}` : `${row.nombrePropietario}`,
      sortable: true,
      width:'300px'
    },
    {
      id: "numPlacas",
      name: "Cantidad",
      selector: (row) => row?.numPlacas,
      sortable: true,
      width: '115px'
    },
    {
      id: "desde",
      name: "Desde",
      selector: (row) => row?.placaDesde,
      sortable: true,
      width: 'cell-name'
    },
    {
      id: "hasta",
      name: "Hasta",
      selector: (row) => row.placaHasta,
      sortable: true,
      class: 'cell-name'
    },
    {
      id: "tipo",
      name: "Tipo",
      selector: (row) => row?.tipo,
      sortable: true,
      class: 'cell-name'
    },
    {
      id: "servicio",
      name: "Servicio",
      selector: (row) => row?.servicio,
      sortable: true,
      class: 'cell-name'
    },
  ]
  /* {
      id: "celularPropietario",
      name: "No. celular",
      selector: (row) => row?.celularPropietario,
      sortable: true,
      width: '160px'
    },
    {
      id: "correoPropietario",
      name: "Correo Electrónico",
      selector: (row) => row.correoPropietario,
      sortable: true,
      class: 'cell-name'
    }, 
    {
      id: "placa",
      name: "Placa",
      selector: (row) => row?.placa,
      sortable: true,
      width: '130px'
    }*/

  return (
  <div
      className="d-flex flex-column rounded m-0 p-0"
      style={{ height: "calc(100vh - 140px)", width: "100%" }}
    >      
      <DataTable
        className="bg-light text-center border border-2 h-100"
        style={{fontSize:20 /* , height:450 */}}
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
        pagination
        paginationComponentOptions={{
          rowsPerPageText: "Filas por página:",
          rangeSeparatorText: "de",
          selectAllRowsItem: false,
        }}
        paginationPerPage={50}
        paginationRowsPerPageOptions={[15, 25, 50, 100]}
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
          {/* <DocRequestrPDF request={selectedRequest} /> */}
          <DocReqPdf request={selectedRequest} />
        </PDFViewer>
      </Modal>
    </div>
  )
}