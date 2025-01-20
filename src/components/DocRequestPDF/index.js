import { Document, Page, View, Text, StyleSheet, Font , Image } from "@react-pdf/renderer";
import Foto from '../../assest/sticker.png'
import cedFron from '../../assest/cedulaFrontal.png'
import cedBack from '../../assest/cedulaTrasera.png'
import tpFront from '../../assest/tpFrntal.png'
import tpBack from '../../assest/tpTrasera.png'
import huella from '../../assest/huella.png'
import Firma from '../../assest/firma.jpg'
import "./styles.css";

const styles = StyleSheet.create({
  headerText: {
    fontSize: 8,
    fontWeight: "bold",
  },
  clientText: {
    fontSize: 8,
    textAlign: "left",
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "100%",
    fontSize: 7,
    marginTop: 6,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    fontWeight: 500,
    overflow: "hidden",
    border: "1px solid black",
    padding: "8px 5px",
  },
  columnWidth0: {
    width: "10%",
  },
  columnWidth1: {
    width: "25%",
  },
  columnWidth2: {
    width: "50%",
  },
  columnWidth3: {
    width: "75%",
  },
  columnWidth4: {
    width: "100%",
  },
  image: {
    width: 60,
    height: 60,
    border:'1px solid black'
  },
  imgDocumentos: {
    width: '100%',
    height: 105,
    border:'1px solid black',
    borderRadius:5,
  },
  input: {
    borderBottom: "1 solid black",
    width: "auto",
  }
});

export default function DocRequestrPDF({ request }) {
  /* const idParser = (id) => {
    let numeroComoTexto = id?.toString();
    while (numeroComoTexto?.length < 8) {
      numeroComoTexto = "0" + numeroComoTexto;
    }
    return numeroComoTexto;
  }; */

  return (
    request && (
      <Document
        title={`${request?.cedulaPropietario}-${(request?.nombrePropietario)}`}
        author="Ingse S.A.S"
        subject="Documento Solicitud Copia Placa(s) Vehiculares"
        keywords="Documento Solicitud Copia Placa(s) Vehiculares - Ingese"
        creator="Ingse S.A.S"
        producer="Ingse S.A.S"
        pageMode="fullScreen"
      >
        <Page size={"A4"}>
          <View
            style={{
              fontFamily: "Helvetica",
              display: "flex",
              flexDirection: "column",
              padding: "15px",
              textAlign: "left",
            }}
          >
            <View style={styles.table}>
              <View style={{ ...styles.tableRow, alignItems: "center" }}>
                {/* Visto foto */}
                <View
                  style={{
                    ...styles.columnWidth1,
                    gap: 3,
                    fontSize:8
                  }}
                >
                  {/* <Text style={{ fontFamily: "Helvetica-Bold" }}>
                    Foto Usuario:
                  </Text> */}
                  <Image 
                    style={styles.image}
                    src={request?.fotoUsuario}
                  />
                </View>

                {/* Vista de asunto */}
                <View
                  style={{
                    fontSize: 7,
                    textAlign: "center",
                    ...styles.columnWidth3,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Helvetica-Bold",
                      fontWeight: "extrabold",
                      fontSize:9
                    }}
                  >
                    ASUNTO: DECLARACIÓN JURAMENTADA
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Helvetica-Bold",
                      fontWeight: "extrabold",
                      fontSize:9
                    }}
                  >
                    Documento Solicitud Copia Placa(s) Vehiculares
                  </Text>
                </View>

                {/* Vista de fecha */}
                <View style={styles.columnWidth1}>
                  <View
                    style={{
                      display: "table",
                      border: "1 solid #000",
                    }}
                  >
                    <Text
                      style={{
                        ...styles.tableRow,
                        fontFamily: "Helvetica-Bold",
                        backgroundColor: "#d6d6d6",
                        padding: 5,
                      }}
                    >
                      INGSE S.A.S - Factura No.{request?.id}
                    </Text>
                    <Text style={{ ...styles.tableRow, padding: 3 }}>
                      <Text style={{ fontFamily: "Helvetica-Bold" }}>
                        Fecha:{" "}
                      </Text>
                      {new Date(request?.createdAt).toLocaleString("es-CO")}
                    </Text>
                  </View>
                </View>
              </View>
            </View>


            <View
              style={{
                border: 1,
                borderColor: "#000",
                borderStyle: "solid",
                marginVertical: 5,
              }}
            ></View>
            
            {/* Texto del formato */}
            <View style={{ fontSize: 10 }}>
              {/* primer parrafo */}
              <View
                style={{
                  position: "relative",
                }}
              >
                <Text style={{padding: 7, lineHeight: 1.2}}>
                  Yo, ___{request?.primerApellidoPropietario} {request?.segundoApellidoPropietario} {request?.primerNombrePropietario} {request?.segundoNombrePropietario}___ identificado (a) con (C.C) No. ___<Text style={styles.input}>{request?.cedulaPropietario}</Text>___, con domiciliado (a) en la
                  dirección ___<Text style={styles.input}>{request?.direccionPropietario}</Text>___ del municipio ___<Text style={styles.input}>{request?.municipioPropietario}___</Text>, manifiesto de manera libre y voluntaria, bajo la
                  gravedad del juramento que: 
                </Text>
              </View>

              {/* segundo parrafo */}
              <View
                style={{
                  position: "relative",
                }}
              >
                <Text style={{padding: 7, lineHeight: 1.2}}>
                  Soy el(la) Propietario del vehículo o el(la) representante legal de la empresa ___{request?.empresa}___ con NIT ___{request?.nitEmpresa}___
                  según consta en la Cámara y Comercio adjunta, dueña del vehículo de PLACAS ___{request?.placa}___, TIPO ___{request?.tipo}___, MARCA ___{request?.marca}___,
                  SERVICIO ___{request?.servicio}___, MATRICULADO EN ___{request.ciudadMatricula}___, LICENCIA DE TRÁNSITO NO. ___{request?.licenciaTransito}___, En condición de propietario
                  de este vehículo; Autorizo a la empresa INGSE S.A.S NIT 900773756, dociliada en Palmira Valle del cauca, en su condición de fabricante de la placa única 
                  Nacional para vehículos, fabrique y entregue bajo mi resposabilidad (1) (2) unidad(es) de placa(s) idénticas a la que identifican mi vehículo
                  por deterioro __(x)__, pérdida __(x)__. Que me comprometo a realizar los trámites a lugar como consecuencia de este cambio en el organismo de 
                  Tránsito donde está matriculado mi vehículo, que entrego para su destrucción al fabricante la(s) placa deteriorada(s).
                </Text>
              </View>

              {/* tercer parrafo */}
              <View
                style={{
                  position: "relative",
                }}
              >
                <Text style={{padding: 7, lineHeight: 1.2}}>
                  Propietario - Celular ___{request?.celularPropietario}___, Email ___{request?.correoPropietario}___, AUTORIZO para que este trámite lo adelante en mi nombre
                  el señor(a) ___{request?.primerApellidoPersonAuth} {request?.segundoApellidoPersonAuth} {request?.primerNombrePersonAuth} {request?.segundoNombrePersonAuth}___, identificado con la (C.C) (C.E) No. ___{request?.cedulaPersonAuth}___ de ___{request?.cityAuto}___, con 
                  domicilio en la dirección ___{request?.direccionPersonAuth}___ del municipio de ___{request?.municipioPersonAuth}___.
                </Text>
              </View>

              {/* Cuanto parrafo */}
              <View
                style={{
                  position: "relative",
                }}
              >
                <Text style={{padding: 7, lineHeight: 1.2}}>
                Autorizado - Celular ___<Text style={styles.input}>{request?.celularPersonAuth}</Text>___, Correo electrónico ___<Text>{request?.correoPersonAuth}</Text>___ para lo cual estoy aportando copia de:
                Licencia de tránsito __(x)__ y cédula de ciudadanía __(x)__.
                </Text>
              </View>

              {/* Quinto parrafo */}
              <View
                style={{
                  position: "relative",
                }}
              >
                <Text style={{padding: 7, lineHeight: 1.2}}>
                Declaro que toda la información sumistrada es verídica, los documentos entregados son copia fiel del original y autorizo que 
                por cualquier medio se verifiquen los datos aquí contenidos y en caso de falsedad se aplique las sanciones contempladas en la ley.
                </Text>
              </View>
            </View>

            {/* <View
              style={{
                border: 1,
                borderColor: "#000",
                borderStyle: "solid",
                marginVertical: 5,
              }}
            ></View> */}

            {/* imagenes adjuntas */}
            <Text
              style={{
                fontFamily: "Helvetica-Bold",
                fontWeight: "extrabold",
                fontSize:11,
                justifyContent:"center",
                textAlign:"center",
                alignItems:"center",
                marginTop:5,
                marginBottom:5,
              }}
            >DOCUMENTACIÓN</Text>
            <View style={{...styles.table, gap:8}}>

              {/* imagen de cedula */}
              <Text
                style={{
                  fontFamily: "Helvetica-Bold",
                  fontWeight: "extrabold",
                  fontSize:9
                }}
              >CÉDULA DEL SOLICITANTE</Text>
              <View style={{ ...styles.tableRow, alignItems: "center" }}>
                <View
                  style={{
                    ...styles.columnWidth2,
                    gap: 3,
                    fontSize:8,
                    marginRighti:10,
                  }}
                >
                  {(
                    (request?.cedulaPersonAuthFrontal === null || 
                    request?.cedulaPersonAuthFrontal === '') && 
                    (request?.cedulaPropietarioFrontal === null || 
                    request?.cedulaPropietarioFrontal === '')
                  ) ?
                    <View style={styles.imgDocumentos}></View>
                    :
                      (
                        (request?.cedulaPersonAuthFrontal === null || 
                        request?.cedulaPersonAuthFrontal === '') &&
                        (request?.cedulaPropietarioFrontal !== null || 
                          request?.cedulaPropietarioFrontal !== '')
                      ) ?
                        <Image 
                          style={styles.imgDocumentos}
                          src={request?.cedulaPropietarioFrontal}
                        />
                        :
                          (
                            (request?.cedulaPersonAuthFrontal !== null || 
                            request?.cedulaPersonAuthFrontal !== '') &&
                            (request?.cedulaPropietarioFrontal === null || 
                              request?.cedulaPropietarioFrontal === '')
                          ) ?
                            <Image 
                              style={styles.imgDocumentos}
                              src={request?.cedulaPersonAuthFrontal}
                            />
                            :
                            <Image 
                              style={styles.imgDocumentos}
                              src={request?.cedulaPersonAuthFrontal}
                            />
                  }
                  {/* {(request?.cedulaPersonAuthFrontal !== null || request?.cedulaPersonAuthFrontal !== '' ) ?
                    <Image 
                      style={styles.imgDocumentos}
                      src={request?.cedulaPersonAuthFrontal}
                    /> 
                      : (request?.cedulaPropietarioFrontal !== null || request?.cedulaPropietarioFrontal !== '') ?
                        <Image 
                          style={styles.imgDocumentos}
                          src={request?.cedulaPropietarioFrontal}
                        />
                        : 
                          <View style={styles.imgDocumentos}></View>
                  } */}
                </View>
                <View
                  style={{
                    ...styles.columnWidth2,
                    gap: 3,
                    fontSize:8,
                    marginLeft:10,
                  }}
                >
                  {(
                    (request?.cedulaPropietarioTrasera === null || 
                    request?.cedulaPropietarioTrasera === '') && 
                    (request?.cedulaPersonAuthTrasera === null || 
                    request?.cedulaPersonAuthTrasera === '')
                  ) ?
                    <View style={styles.imgDocumentos}></View>
                    :
                      (
                        (request?.cedulaPersonAuthTrasera === null || 
                        request?.cedulaPersonAuthTrasera === '') &&
                        (request?.cedulaPropietarioTrasera !== null || 
                          request?.cedulaPropietarioTrasera !== '')
                      ) ?
                        <Image 
                          style={styles.imgDocumentos}
                          src={request?.cedulaPropietarioTrasera}
                        />
                        :
                          (
                            (request?.cedulaPersonAuthTrasera !== null || 
                            request?.cedulaPersonAuthTrasera !== '') &&
                            (request?.cedulaPropietarioTrasera === null || 
                              request?.cedulaPropietarioTrasera === '')
                          ) ?
                            <Image 
                              style={styles.imgDocumentos}
                              src={request?.cedulaPersonAuthTrasera}
                            />
                            :
                            <Image 
                              style={styles.imgDocumentos}
                              src={request?.cedulaPersonAuthTrasera}
                            />
                  }
                </View>
              </View>

              {/* imagen de tarjeta de propiedad */}
              <Text 
                style={{
                  fontFamily: "Helvetica-Bold",
                  fontWeight: "extrabold",
                  fontSize:9,
                  marginTop:10
                }}>TARJETA DE PROPIEDAD DEL VEHÍCULO</Text>
              <View style={{ ...styles.tableRow, alignItems: "center" }}>
                <View
                  style={{
                    ...styles.columnWidth2,
                    gap: 3,
                    fontSize:8,
                    marginRight:10,
                  }}
                >
                  {(request?.tarjetaPropiedadFrontal === null || request?.tarjetaPropiedadFrontal === '') ?
                    <View style={styles.imgDocumentos}></View>
                    : 
                    <Image 
                      style={styles.imgDocumentos}
                      src={request?.tarjetaPropiedadFrontal}
                    /> 
                  }
                </View>
                <View
                  style={{
                    ...styles.columnWidth2,
                    gap: 3,
                    fontSize:8,
                    marginLeft:10,
                  }}
                >
                  {(request?.tarjetaPropiedadTrasera === null || request?.tarjetaPropiedadTrasera === '') ?
                    <View style={styles.imgDocumentos}></View>
                    : 
                    <Image 
                      style={styles.imgDocumentos}
                      src={request?.tarjetaPropiedadTrasera}
                    /> 
                  }
                </View>
              </View>

              {/* imagen firma, y huellas */}
              <View style={{ ...styles.tableRow, alignItems: "center" , marginTop:10}}>
                {/* firma */}
                <View style={{...styles.columnWidth2,display:"flex", flexDirection:'column', gap:4 , marginRight:10}}>
                  <Text 
                    style={{
                    fontFamily: "Helvetica-Bold",
                    fontWeight: "extrabold",
                    fontSize:9
                  }}>
                    FIRMA SOLICITANTE
                  </Text>
                  <View
                    style={{
                      gap: 3,
                      fontSize:8,
                      marginRight:10,
                      width:'100%'
                    }}
                  >
                    {(request?.firma === null || request?.firma === '') ?
                      <View style={styles.imgDocumentos}></View>
                      : 
                      <Image 
                        style={styles.imgDocumentos}
                        src={`data:image/png;base64,${request?.firma}`}
                      /> 
                    }
                  </View>
                </View>

                {/* huella derecha */}
                <View style={{...styles.columnWidth2, display:"flex", flexDirection:'column', alignItems:"center", gap:4 , marginLeft:10}}>
                  <Text 
                    style={{
                    fontFamily: "Helvetica-Bold",
                    fontWeight: "extrabold",
                    fontSize:9
                  }}>
                    HUELA DIGITAL
                  </Text>
                  {/* <Text 
                    style={{
                    fontFamily: "Helvetica-Bold",
                    fontWeight: "extrabold",
                    fontSize:9
                  }}>
                    INDICE DERECHO
                  </Text> */}
                  
                  <View
                    style={{
                      gap: 3,
                      fontSize:8,
                      marginRight:10,
                      width:'45%',
                      display:'flex',
                      alignItems: 'center',
                      alignContent:'center'
                    }}
                  >
                    {(request?.huella === null || request?.huella === '') ?
                      <View style={styles.imgDocumentos}></View>
                      : 
                      <Image 
                        style={styles.imgDocumentos}
                        src={request?.huella}
                      />
                    }
                  </View>
                </View>

                {/* huella izquierda */}
                {/* <View style={{...styles.columnWidth1, display:"flex", flexDirection:'column', alignItems:"center", gap:4 , marginLeft:10 }}>
                  <Text 
                    style={{
                    fontFamily: "Helvetica-Bold",
                    fontWeight: "extrabold",
                    fontSize:9
                  }}>
                    HUELA DIGITAL
                  </Text>
                  <Text 
                    style={{
                    fontFamily: "Helvetica-Bold",
                    fontWeight: "extrabold",
                    fontSize:9
                  }}>
                    INDICE IUZQUIERDA
                  </Text>
                  
                  <View
                    style={{
                      gap: 3,
                      fontSize:8,
                      marginRight:10,
                      width:'75%'
                    }}
                  >
                    <Image 
                      style={styles.imgDocumentos}
                      src={huella}
                    />
                  </View>
                </View> */}
              </View>

            </View>
          </View>
        </Page>
      </Document>
    )
  );
}
