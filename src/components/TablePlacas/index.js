import Swal from "sweetalert2";
import * as Fa from "react-icons/fa";

function TablePlacas({ list, setList, formater }) {
  const deleteProductList = (e) => {
    const { id } = e.target.parentNode;
    Swal.fire({
      icon: "warning",
      title: "¡Cuidado!",
      html: `
        <div>¿Está seguro que desea eliminar la solicitud de la lista?</div>
        <div>${list.agregados[id].cedulaPropietario} - ${list.agregados[id].nombrePropietario} -  placa: ${list.agregados[id].placa}</div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Si, eliminar",
      confirmButtonColor: "#dc3545",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      allowEnterKey: true,
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        let newList = [...list.agregados];
        let newTotal = formater(
          list?.length
        );
        if (newList?.length === 1) {
          newList = [];
        } else {
          newList.splice(id, 1);
        }
        setList({
          agregados: newList,
          total: newTotal,
        });
      }
    });
  };

  const restoreProductList = (e) => {
    Swal.fire({
      icon: "warning",
      title: "¡Cuidado!",
      html: `
        <div>¿Está seguro que desea restaurar la lista de solicitudes?</div>
        <div>Vaciará la lista por completo, esta acción no se puede rehacer</div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Si, restaurar",
      confirmButtonColor: "#dc3545",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      allowEnterKey: true,
    }).then(({ isConfirmed }) => {
      if(isConfirmed) {
        setList({
          agregados: [],
          total: "0",
        });
      }
    });
  };

  return (
    <div className="table-responsive mt-2 mb-3 rounded">
      <table className="table table-bordered table-hover align-middle text-center m-0 caption-top">
        <caption>SOLICITUDES AGREGADAS</caption>
        <thead className="table-light">
          <tr>
            <th style={{width:180}}>No. identificación</th>
            <th>Nombre</th>
            <th style={{width:200}}>Concepto</th>
            <th style={{width:150}}>Placa</th>
            <th style={{width:150}}>Tipo</th>
            <th style={{width:200}}>Servicio</th>
            <th style={{ width: 49 }}>
              {list?.agregados?.length > 1 && (
                <button
                  type="button"
                  className="d-flex align-items-center btn btn-danger m-auto p-0"
                  title="Restaurar"
                  onClick={restoreProductList}
                >
                  <Fa.FaTrashRestore
                    style={{ width: 30, height: 30 }}
                    className="p-2"
                  />
                </button>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {list?.agregados?.map((elem, index) => (
            <tr>
              <td>{elem.cedulaPropietario}</td>
              <td className="text-start">{elem.nombrePropietario}</td>
              <td>{(elem.concepto)}</td>
              <td className="text-center">{elem.placaDesde}</td>
              <td className="text-center">{elem.tipo}</td>
              <td>{elem.servicio}</td>
              <td>
                <button
                  id={index}
                  title="Borrar producto"
                  type="button"
                  className="d-flex align-items-center btn btn-danger m-auto p-0"
                  onClick={deleteProductList}
                >
                  <Fa.FaTrash
                    id={index}
                    style={{ width: 30, height: 30 }}
                    className="p-2"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="fw-bold">CANTIDAD</td>
            <td colSpan={5}></td>
            <td className="fw-bold text-center">{list.total}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default TablePlacas;
