import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import axios from "axios";
import fileDownload from "js-file-download";
import Button from "@material-ui/core/Button";

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const ProjectInfo = (props: any) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
    };

    function a11yProps(index: number) {
      return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
      };
    }

    const url1 = "https://onlinelibrary.wiley.com/doi/pdf/10.1002/wcc.535";
    const url2 = "https://doi.org/10.1101/2020.06.11.20128777";
    const url3 = "http://datos.salud.gob.ar/dataset/covid-19-casos-registrados-en-la-republica-argentina";

    const filesURL = "/data/";
    const handleDownload = (filenames: string[]) => {
      for (let filename of filenames) {
          axios.get(`${filesURL}${filename}`, {
                responseType: 'blob',
            }).then(res => {
                fileDownload(res.data, filename);
            }).catch(err => {
                console.log(err);
            });
      }
    };

    return (
        <Box p={2}>
          <Tabs value={value}
                onChange={handleChange}
                indicatorColor="primary"
                aria-label="Información">
            <Tab label="Metodología" {...a11yProps(0)} />
            <Tab label="Integrantes" {...a11yProps(1)} />
            <Tab label="Reconocimientos" {...a11yProps(2)} />
            <Tab label="Descarga de datos" {...a11yProps(3)} />
          </Tabs>
    <TabPanel value={value} index={0}>
        <Typography align="left" variant="body2" gutterBottom color="textSecondary">
            <Box p={2}>
            Este proyecto COVID-Federal realiza un monitoreo a tiempo real y predicción del avance de la pandemia COVID-19 en Argentina utilizando un <b> sistema de asimilación de datos </b>.
            </Box>
            <Box p={2}>
            <b>  Sistema de asimilación de datos. </b> El sistema está basado en una técnica físico-estadística que permite combinar información de datos existentes de distintas fuentes con información de un modelo epidemiológico. Esta metodología permite determinar de manera objetiva diferentes parámetros relacionados con la propagación de la enfermedad así como también determinar la precisión con la que los mismos pueden ser conocidos. De esta manera se puede obtener información acerca de cómo se comporta la enfermedad, y cómo impactan diferentes medidas de distanciamiento social sobre la propagación de la misma. Por otra parte la información obtenida permite realizar proyecciones de la evolución futura de la epidemia junto con una cuantificación del nivel de incertidumbre asociada a las mismas.  En el proceso de estimación se consideran las posibles fuentes de incertidumbre, tanto las asociadas a las fuentes de información como también aquellas provenientes de las predicciones del modelo epidemiológico. Para considerar las incertezas en la estimación se trabaja con una técnica de Monte Carlo que utiliza un conjunto numeroso de posibles escenarios de propagación de la enfermedad. Una descripción precisa de las técnicas de asimilación de datos puede ser encontrada en Carrassi et al. (2019).
            </Box>
            <Box p={2}>
            <b> Técnica de asimilación. </b> Más especificamente, el sistema está basado en un suavizador de Kalman por ensambles en el cual se utiliza un estado aumentado para estimar los parámetros en conjunción con el estado. Una aplicación de esta técnica de asimilación ha sido descripta detalladamente y evaluada para el COVID-19 en Evensen, et al (2020).
            </Box>
            <Box p={2}>
            <b> Modelo epidemiológico:. </b>  El modelo epidemiológico utilizado en el sistema de asimilación de datos es del tipo SEIRHD (suceptibles - expuestos - infectados - recuperados - hospitalizados y fallecidos por sus sigla en inglés). En donde la población se divide en fracciones o compartimentos. Dichas fracciones corresponden a los susceptibles (aquellos que no han estado en contacto con el virus), los expuestos (aquellos que han tenido contacto con una persona infectada pero aún no cursan la enfermedad), los infectados (aquellos que se encuentran cursando la enfermedad con diferentes sintomatologías), recuperados (aquellos que habiendo estado infectados ya se encuentran recuperados y por tanto se los supone inmunes a la enfermedad), hospitalizados (aquellos que por la severidad de sus síntomas requieren algún tipo de internación hospitalaria) y los fallecidos (aquellos que murieron como consecuencia directa de la enfermedad). La figura muestra los compartimentos del modelo. El modelo SEIRHD permite estimar la evolución en el tiempo de la cantidad de personas que se encuentra en cada categoría a través de un sistema de ecuaciones diferenciales acopladas. Este sistema de ecuaciones incluye parámetros que controlan aspectos tales como la tasa de contagios o la mortalidad del virus. Estos parámetros dependen de factores externos como el nivel de distanciamiento social o las propiedades del virus y su valor no es conocido con precisión y además puede variar de acuerdo a la localidad o a las medidas de distanciamiento social.
            </Box>
            <Box p={2}>
            <b> Datos. </b>  Las  fuentes de datos utilizados corresponden a la base de datos del &nbsp;
                <a href={url3} target="_blank" rel="noopener noreferrer">
                 SNVS (Sistema Nacional de Vigilancia de la Salud)
                </a>
                 &nbsp;
                del Ministerio de Salud de la Nación y los informes diarios a nivel nacional y provincial tomados en forma automática desde la red.
            </Box>
            <Box p={2}>
            Carrassi, A., Bocquet, M., Bertino, L. and Evensen, G., 2018. Data assimilation in the geosciences: An overview of methods, issues, and perspectives. Wiley Interdisciplinary Reviews: Climate Change, 9(5), p.e535
                &nbsp;
                <a href={url1} target="_blank" rel="noopener noreferrer">
                https://onlinelibrary.wiley.com/doi/pdf/10.1002/wcc.535
                </a>
            </Box>
            <Box p={2}>
            Evensen G, J Amezcua , M Bocquet , A Carrassi, A Farchi , A Fowler , PL Houtekamer, CK Jones , RJ de Moraes, M Pulido , C Sampson, and FC Vossepoel, 2020: An international assessment of the COVID-19 pandemic using ensemble data assimilation. Submitted to Foundations of Data Science.
                &nbsp;
                <a href={url2} target="_blank" rel="noopener noreferrer">
                https://doi.org/10.1101/2020.06.11.20128777
                </a>
            </Box>
        </Typography>
    </TabPanel>

    <TabPanel value={value} index={1}>
        <Typography align="left" variant="body2" gutterBottom color="textSecondary">
            <Box p={2} paddingBottom={0} >
            Manuel Pulido (Investigador Responsable, UNNE-CONICET)
            </Box>
            <Box p={2} paddingBottom={0} paddingTop={0}>
            Juan Ruiz (CIMA CONICET-UBA, UMI-IFAECI CNRS-UBA-CONICET)
            </Box>
            <Box p={2} paddingBottom={0} paddingTop={0}>
            Santiago Rosa (Pasante graduado. Lic FaMAF, UNCordoba)
            </Box>
            <Box p={2} paddingBottom={0} paddingTop={0}>
            Fido García (CIMA CONICET-UBA, UMI-IFAECI CNRS-UBA-CONICET)
            </Box>
            <Box p={2} paddingBottom={0} paddingTop={0}>
            Agustina Quiros (Pasante. Est. Lic. en Sistemas, FaCENA, UNNE)
            </Box>
            <Box p={2} paddingBottom={0} paddingTop={0}>
            Tadeo Cocucci (Becario CONICET. FaMAF UNCordoba, FaCENA UNNE)
            </Box>
            <Box p={2} paddingBottom={0} paddingTop={0}>
            Santiago Wiedman (Est. Lic. en Fisica, FaCENA, UNNE)
            </Box>
            <Box p={2} paddingBottom={0} paddingTop={0}>
            Gerardo Andino (Laboratorio Central Prov. Corrientes)
            </Box>
            <Box p={2} paddingBottom={0} paddingTop={0}>
            Viviana Gutnisky (Laboratorio Central Prov. Corrientes)
            </Box>
            <Box p={2} paddingBottom={0} paddingTop={0}>
            Natalia Ruiz Días (Laboratorio Central Prov. Corrientes)
            </Box>
            <Box p={2} paddingBottom={0} paddingTop={2}>
            <Typography align="left" variant="subtitle2" component="h2">
                Colaboradores:
            </Typography>
            </Box>
            <Box p={2} paddingBottom={0} >
            Juan Aparicio (UNSa, CONICET)
            </Box>
            <Box p={2} paddingBottom={0} paddingTop={0}>
            Geir Evensen (NORCE, Noruega)
            </Box>
            <Box p={2} paddingBottom={2} paddingTop={0}>
            Pierre Tandeo (IMT Atlantique. CNRS. France)
            </Box>
        </Typography>
    </TabPanel>

      <TabPanel value={value} index={2}>
        <Typography align="left" variant="body2" gutterBottom color="textSecondary" style={{whiteSpace: 'pre-line'}}>
            <Box display="flex"  p={2} paddingBottom={0}>
                Este proyecto es posible debido al financiamiento otorgado por la Agencia Nacional de Promocion Cientifica Tecnologica (ANPCyT) a traves del proyecto ORR 01 COVID FEDERAL EX-2020-38902538  ANPCyT. titulado " Sistema de monitoreo y predicción del COVID-19 en la provincia de Corrientes usando asimilación de datos"
            </Box>
            <Box display="flex"  p={2} paddingBottom={0} paddingTop={2}>
                <b>Unidad Administradora: </b> SGCyT Universidad Nacional del Nordeste
            </Box>
            <Box display="flex" p={2} paddingBottom={0}>
                <Typography align="left" variant="subtitle2" component="h2">
                    Instituciones participantes:
                </Typography>
            </Box>
            <Box display="flex" p={2} paddingBottom={0} paddingTop={0}>
                Facultad de Ciencias Exactas y Naturales y Agrimensura (FaCENA, UNNE)
            </Box>
            <Box display="flex" p={2} paddingBottom={0} paddingTop={0}>
                Centro de Investigacion en el Mar y la Atmosfera CIMA, FCEyN
            </Box>
            <Box display="flex" p={2} paddingTop={0}>
                A todos estas instituciones agradecemos el apoyo recibido.
            </Box>
        </Typography>
    </TabPanel>

    <TabPanel value={value} index={3}>
        <Box display="flex" p={2} paddingTop={0}>
          <Button onClick={() => handleDownload(["casos-acumulados.csv"])} color="primary">
            Casos acumulados
          </Button>
        </Box>
        <Box display="flex" p={2} paddingTop={0}>
          <Button onClick={() => handleDownload(["casos-diarias.csv"])} color="primary">
            Casos diarios
          </Button>
        </Box>
        <Box display="flex" p={2} paddingTop={0}>
          <Button onClick={() => handleDownload(["muertes-acumulados.csv"])} color="primary">
            Muertes acumulados
          </Button>
        </Box>
        <Box display="flex" p={2} paddingTop={0}>
          <Button onClick={() => handleDownload(["muertes-diarias.csv"])} color="primary">
            Muertes diarias
          </Button>
        </Box>
    </TabPanel>


    </Box>
  );
}

export { ProjectInfo }

