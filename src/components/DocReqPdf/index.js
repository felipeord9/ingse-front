import { Document, Page, View, Text, StyleSheet, Font , Image } from "@react-pdf/renderer";
import Foto from '../../assest/sticker.png'
import cedFron from '../../assest/cedulaFrontal.png'
import cedBack from '../../assest/cedulaTrasera.png'
import tpFront from '../../assest/tpFrntal.png'
import tpBack from '../../assest/tpTrasera.png'
import huella from '../../assest/huella.png'
import Firma from '../../assest/firma.jpg'
import Head from '../../assest/headPdf.png'
import Pie from '../../assest/piePdf2.png'
import { format } from "date-fns";
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
    width: "75%",
    height: 70,
    border:'1px solid black'
  },
  imgDocumentos: {
    width: '100%',
    height: 95,
    border:'1px solid black',
    borderRadius:5,
  },
  input: {
    borderBottom: "1 solid black",
    minWidth: 30,
    display: 'inline-block',
  },

  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 9 ,
    padding: 4, 
  },
  textContainer2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 8 ,
    padding: 4, 
  },
  normalText: {
    marginRight: 2,
  },
  underlinedTextContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: 4,
  },
  underline: {
    height: 1,
    backgroundColor: 'black',
    minWidth:30,
    marginTop: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 5, // distancia desde el borde inferior
    left: 40,
    right: 40,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerImage: {
    width: '85%',
    height: 20,
  },
  paragraph: {
    textAlign: 'justify',
    fontSize: 9,
  },
});

// Componente que recibe el texto y dibuja una línea debajo
const UnderlinedText = ({ text }) => {
  const safeText = text || ''; // Si es undefined, se usa string vacío
  const estimatedWidth = safeText.length > 0 ? safeText.length * 6.2 : 60; // Ancho mínimo para campos vacíos
  const showPlaceholder = safeText.length === 0;

  return (
    <View style={styles.underlinedTextContainer}>
      {showPlaceholder ? (
        // Si está vacío, ocupa el espacio sin mostrar texto
        <View style={{ height: 12 }} /> // ajusta según fontSize
      ) : (
        <Text>{safeText}</Text>
      )}
      <View
        style={[
          styles.underline,
          {
            width: estimatedWidth,
            marginTop: showPlaceholder ? 0 : 1, // ajusta espacio entre texto y línea
          },
        ]}
      />
    </View>
  );
};

const UnderlinedBoldText = ({ text }) => {
  const safeText = text || '';
  const characterWidth = 6.2; // ajusta según tu fuente y tamaño
  const lineWidth = safeText.length > 0 ? safeText.length * characterWidth : 80; // ancho mínimo
  const showPlaceholder = safeText.length === 0;

  return (
    <Text
      style={styles.underlinedTextContainer}
      /* style={{
        display: 'inline-block',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginRight: 4,
      }} */
    >
      {safeText ? (
        <Text style={{ fontWeight: 'bold', fontSize: 10 , textDecoration: 'underline' }}>  {safeText}  </Text>
      ) : (
        <Text style={{ height: 12, width: 60, textDecoration: 'underline' }}>                 </Text> // simula altura del texto
      )}
      <View
        style={[
          styles.underline,
          {
            width: lineWidth,
            marginTop: showPlaceholder ? 0 : 1, // ajusta espacio entre texto y línea
          },
        ]}
      />
    </Text>
  );
};


export default function DocReqPdf({ request }) {
  /* const idParser = (id) => {
    let numeroComoTexto = id?.toString();
    while (numeroComoTexto?.length < 8) {
      numeroComoTexto = "0" + numeroComoTexto;
    }
    return numeroComoTexto;
  }; */

  const namePerson = `${request?.primerApellidoPropietario} ${request?.segundoApellidoPropietario} ${request?.primerNombrePropietario} ${request?.segundoNombrePropietario}`

  return (
    request && (
      <Document
        title={`${format(new Date(request?.createdAt), 'yyyy/MM/dd')}-${request.nombrePropietario}-${(request?.placaDesde)}`}
        /* title={`request`} */
        author="Ingse S.A.S"
        subject="Documento Solicitud Copia Placa(s) Vehiculares"
        keywords="Documento Solicitud Copia Placa(s) Vehiculares - Ingse"
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

            {/* Head */}
            <View style={styles.table}>
              <View style={{ ...styles.tableRow, alignItems: "center" , justifyContent: 'center' }}>
                <Image 
                  style={styles.image}
                  src={Head}
                /> 
              </View>
            </View>

            {/* Asunto */}
            <View style={styles.table}>
              <View style={{ ...styles.tableRow, alignItems: "center" }}>
              {/* Visto fecha */}
                <View style={styles.columnWidth1}>
                  <View
                    style={{
                      display: "table",
                      border: "1 solid #000",
                    }}
                  >
                    <Text style={{ ...styles.tableRow, padding: 3 }}>
                      <Text style={{ fontFamily: "Helvetica-Bold" }}>
                        Fecha:{" "}
                      </Text>
                      {new Date(request?.createdAt).toLocaleString("es-CO")}
                    </Text>
                  </View>
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
                      fontSize:15
                    }}
                  >
                    ASUNTO: AUTORIZACIÓN
                  </Text>
                </View>
            
                {/* Vista de numero de factura */}
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
                      Factura - Recibo No.{request?.id}
                    </Text>
                  </View>
                </View>
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
            
            {/* Texto del formato */}
            <View style={{ fontSize: 8 }}>
              {/* primer parrafo */}
              <View
                style={{
                  position: "relative",
                }}
              >
                <View style={styles.textContainer}>
                  <Text style={styles.paragraph}>
                    Yo <UnderlinedBoldText text={request?.nombrePropietario} />
                      , identificado(a) con tipo de documento de identidad Cedula de Ciudadanía o Nit No. 
                      <UnderlinedBoldText text={request?.cedulaPropietario} />
                      , domiciliado (a) en la dirección:
                      <UnderlinedBoldText text={request?.direccionPropietario} /> del municipio de: 
                      <UnderlinedBoldText text={request?.municipioPropietario} />
                      , con número de celular:
                      <UnderlinedBoldText text={request?.celularPropietario} />
                      , y correo electrónico:
                      <UnderlinedBoldText text={request?.correoPropietario} />
                      , manifiesto de manera libre y voluntaria, bajo la gravedad del juramento que:
                  </Text>
                </View>
              </View>

              {/* segundo parrafo */}
              <View
                style={{
                  position: "relative",
                  display:'flex',
                  flexDirection:'row'
                }}
              >
                <View style={styles.textContainer}>
                  <Text style={styles.paragraph}>
                    En Calidad de propietario(a) o representante legal de la empresa,
                    <UnderlinedBoldText text={request?.empresa} />
                    , con NIT o CC:
                    <UnderlinedBoldText text={request?.nitEmpresa} />
                    , según consta en la Cámara de Comercio(si fuere el caso) (Persona Jurídica) adjunta, propietario del vehículo tipo:
                    <UnderlinedBoldText text={request?.tipo} />
                    , con placas:
                    <UnderlinedBoldText text={request?.placaDesde} />
                    , de marca:
                    <UnderlinedBoldText text={request?.marca} />
                    , tipo de servicio:
                    <UnderlinedBoldText text={request?.servicio} />
                    Matriculado en:
                    <UnderlinedBoldText text={request?.ciudadPlaca !== null ? request?.ciudadPlaca.toUpperCase() : request?.ciudadPlaca} />
                    , licencia de tránsito No.:
                    <UnderlinedBoldText text={request?.licenciaTransito} />
                    , No. Vin:
                    <UnderlinedBoldText text={request?.vin} />
                    , No.Chasis:
                    <UnderlinedBoldText text={request?.chasis} />
                    ; autorizo a la empresa INGSE SAS con NIT 900773756, domiciliada en la Ciudad de Palmira, Valle del Cauca, en su condición de fabricante de la Placa Única Nacional para Vehículos, fabrique y entregue bajo mi responsabilidad:
                    <UnderlinedBoldText text={request?.numPlacas} />
                    unidad(es) de placa(s) idéntica(s) a la que identifican mi vehículo, solicitada por concepto de:
                    <UnderlinedBoldText text={request?.concepto} />
                    , y comprometiéndome(nos)  a realizar el(los) trámite(s) a lugar como consecuencia de este cambio en el organismo de Tránsito donde está matriculado el vehículo.(eje subir al Runt). También que se entrega para su destrucción a la empresa INGSE SAS, la placa(s) actual(es)por DETERIORO para su destrucción. (Según el caso).
                  </Text>
                </View>
              </View>

              {/* tercer parrafo */}
              <View
                style={{
                  position: "relative",
                }}
              >
                <View style={styles.textContainer}>
                  <Text style={styles.paragraph}>
                    Autorizo para que este	trámite	lo adelante en nombre de:
                    <UnderlinedBoldText text={request?.nombrePropietario} />
                    , el Sr (a)
                    <UnderlinedBoldText text={request?.nombrePersonAuth} />
                    , Identificado con la C.C No.:
                    <UnderlinedBoldText text={request?.cedulaPersonAuth} />
                    , con domicilio en la dirección:
                    <UnderlinedBoldText text={request?.direccionPersonAuth} />
                    , del municipio de:
                    <UnderlinedBoldText text={request?.municipioPersonAuth} />
                    , con No. Celular:
                    <UnderlinedBoldText text={request?.celularPersonAuth} />
                    , y corre electrónico:
                    <UnderlinedBoldText text={request?.correoPersonAuth} />
                    , para lo cual el autorizado aporta copia de Cedula de Ciudadanía.
                  </Text>
                </View>
              </View>

              {/* Cuanto parrafo */}
              <View
                style={{
                  position: "relative",
                }}
              >
                <View style={styles.textContainer2}>
                <Text style={styles.normalText}>Declaro que toda la información suministrada es verídica, los documentos entregados son copia fiel del original y autorizó que por cualquier medio se verifiqué los datos aquí contenidos y en caso de falsedad se aplique las sanciones contempladas en la ley.</Text>
                </View>
              </View>

              {/* Quinto parrafo */}
              <View
                style={{
                  position: "relative",
                }}
              >
                <View style={styles.textContainer2}>
                <Text style={styles.normalText}>También autorizo con este documento el cual firmo digitalmente y coloco mi huella de forma digital, utilizar mi información aquí consignada como nombre y apellido, numero celular, dirección de correo electrónico para envió de publicidad por SMS Mensaje de texto, Whatsapp, Telegram, correo electrónico, Twitter, Instagram y otras app, redes sociales o medios escritos, hablados, digitales, conocidos actualmente y por conocer a futuro. Si quisiera revocar el consentimiento en fecha futura, este será solicitado por un documento escrito al mail de la empresa, o entregado personalmente en las Instalaciones de Ingse SAS, con constancia de recibo.</Text>
                </View>
              </View>

            </View>
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
            >ARCHIVOS ADJUNTOS</Text>
            <View style={{...styles.table, gap: 4}}>

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
                    gap: 2,
                    fontSize:8,
                    marginRight:10,
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
                </View>
                <View
                  style={{
                    ...styles.columnWidth2,
                    gap: 2,
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
                    gap: 2,
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
                    gap: 2,
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
                      gap: 2,
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

                

                <View style={{...styles.columnWidth2, display:"flex", flexDirection:'row', alignItems:"center", gap:20 , marginLeft:12}}>
                  {/* Foto usuario */}
                  <View style={{width:'75%', display:"flex", flexDirection:'column', alignItems:"center", gap:4}}>
                    <Text 
                      style={{
                      fontFamily: "Helvetica-Bold",
                      fontWeight: "extrabold",
                      fontSize:9
                    }}>
                      USUARIO
                    </Text>
                    
                    <View
                      style={{
                        gap: 2,
                        fontSize:8,
                        width:'90%',
                        display:'flex',
                        alignItems: 'center',
                        alignContent:'center'
                      }}
                    >
                      {(request?.fotoUsuario === null || request?.fotoUsuario === '') ?
                        <View style={styles.imgDocumentos}></View>
                        : 
                        <Image 
                          style={styles.imgDocumentos}
                          src={request?.fotoUsuario}
                        /> 
                      }
                    </View>
                  </View>
                  {/* huella derecha */}
                  <View style={{width:'75%', display:"flex", flexDirection:'column', alignItems:"center", gap:4}}>
                    <Text 
                      style={{
                      fontFamily: "Helvetica-Bold",
                      fontWeight: "extrabold",
                      fontSize:9
                    }}>
                      HUELA DIGITAL
                    </Text>
                    
                    <View
                      style={{
                        gap: 2,
                        fontSize:8,
                        width:'90%',
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
                </View>

              </View>

            </View>
          </View>
          <View style={styles.footer}>
            <Image
              style={styles.footerImage}
              src={Pie}
            />
          </View>
        </Page>
      </Document>
    )
  );
}

