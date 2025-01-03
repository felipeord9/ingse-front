import React, { useRef, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
// Importar SigWebTablet.js (asegúrate de que esté disponible en tu proyecto)
import "./SigWebTablet.js";

import {
  GetDaysUntilCertificateExpires,
  GetSigWebVersion,
  IsSigWebInstalled,
  SetTabletState,
  SetDisplayXSize,
  SetDisplayYSize,
  SetJustifyMode,
  ClearTablet,
  NumberOfTabletPoints,
  SetSigCompressionMode,
  GetSigImageB64,
  GetSigString,
  SetImageXSize,
  SetImageYSize,
  SetImagePenWidth
} from './SigWebTablet.js'


export default function SigWebDemo ({
    setSigImage,
    canvasRef,
    showModal,
    setShowModal,
}) {
  /* const canvasRef = useRef(null); */ // Ref para el canvas principal
  const [sigString, setSigString] = useState("");
  /*   const [sigImage, setSigImage] = useState(""); */
  const [sigWebVersion, setSigWebVersion] = useState("");
  const [certificateDays, setCertificateDays] = useState(null);
  const [habilitado, setHabilitado] = useState(false);
  let tmr = null;

  useEffect(() => {

    // Al montar el componente, verificar si SigWeb está instalado
    if (IsSigWebInstalled()) {
      
      try {
        const version = GetSigWebVersion();
        setSigWebVersion(version);

        if (isSigWeb_1_7_0_0_Installed(version)) {
          const daysUntilCertExpires = GetDaysUntilCertificateExpires();
          setCertificateDays(daysUntilCertExpires);
        }
      } catch (err) {
        console.error("Error al obtener información de SigWeb:", err);
      }
    } else {
      alert("No se puede comunicar con SigWeb. Verifica que está instalado y ejecutándose.");
    }

    // Al desmontar, limpiar recursos
    return () => {
      if (tmr) {
        SetTabletState(0, tmr);
        ClearTablet();
        tmr = null;
      }
    };
    
  }, []);

  const handleSign = () => {
    if (IsSigWebInstalled()) {
      const ctx = canvasRef.current.getContext("2d");
      SetDisplayXSize(500);
      SetDisplayYSize(100);
      SetTabletState(0, tmr);
      SetJustifyMode(0);
      ClearTablet();

      if (!tmr) {
        tmr = SetTabletState(1, ctx, 50);
      } else {
        SetTabletState(0, tmr);
        tmr = SetTabletState(1, ctx, 50);
      }
    } else {
      alert("No se puede comunicar con SigWeb. Verifica que está instalado y ejecutándose.");
    }
  };

  const handleClear = () => {
    ClearTablet();
  };

  const handleDone = () => {
    if (NumberOfTabletPoints() === 0) {
      alert("Por favor, firma antes de continuar.");
    } else {
      SetTabletState(0, tmr);
      SetSigCompressionMode(1);
      setSigString(GetSigString());

      // Obtener la firma como imagen base64
      SetImageXSize(500);
      SetImageYSize(100);
      SetImagePenWidth(5);
      GetSigImageB64((str) => {
        setSigImage(str);
      });
      handleClose();
    }
  };

  const handleClose = () =>{
    setShowModal(false)
    setHabilitado(false)
  }

  return (
    <div>
    <Modal show={showModal} style={{ fontSize: 18, userSelect:'none' }} centered onHide={(e)=>handleClose()}>
      <Modal.Header closeButton>
        <center>
        <Modal.Title className="fw-bold" style={{fontSize:40}}>
          <strong>Firma de documento</strong>
        </Modal.Title>
        </center>
      </Modal.Header>
      <Modal.Body className="p-2 w-100">
        <div className="d-flex w-100">
            <canvas 
                ref={canvasRef} 
                className="w-100"
                height="100" 
                style={{ border: "1px solid black" }}
            ></canvas>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {(habilitado) ?
            <div className="">
                <button className="btn btn-sm btn-success p-2 me-2" onClick={handleDone}>Guardar</button>
                <button className="btn btn-sm btn-danger p-2" onClick={()=>handleClear()}>Limpiar</button>
            </div> 
            :
            <button className="btn btn-sm btn-primary p-2" onClick={(e)=>(handleSign(),setHabilitado(true))}>Habilitar</button>
        }
      </Modal.Footer>
    </Modal>
    </div>
  );
};

// Verifica la versión mínima de SigWeb instalada
function isSigWeb_1_7_0_0_Installed(version) {
  const minVersion = "1.7.0.0";
  return !isOlderVersion(minVersion, version);
}

function isOlderVersion(minVersion, currentVersion) {
  const minParts = minVersion.split(".").map(Number);
  const currentParts = currentVersion.split(".").map(Number);

  for (let i = 0; i < minParts.length; i++) {
    if (currentParts[i] < minParts[i]) return true;
    if (currentParts[i] > minParts[i]) return false;
  }
  return false;
}