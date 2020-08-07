import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {Accordion} from "@material-ui/core";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionDetails from "@material-ui/core/AccordionDetails";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const ProjectInfo = (props: any) => {
    const classes = useStyles();
    return (
        <Box p={2}>
         <Accordion expanded={true}>
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
          <Typography className={classes.heading}>Reconocimientos</Typography>
        </AccordionSummary>
        <AccordionDetails>
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
        </AccordionDetails>
      </Accordion>

         <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
          <Typography className={classes.heading}>Integrantes</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Typography align="left" variant="body2" gutterBottom color="textSecondary">
            <Box p={2} paddingBottom={0} >
            Manuel Pulido (Investigador Responsable, UNNE-CONICET)
            </Box>
            <Box p={2} paddingBottom={0} paddingTop={0}>
            Juan Ruiz (Investigador, UBA-CONICET)
            </Box>
            <Box p={2} paddingBottom={0} paddingTop={0}>
            Santiago Rosa (Pasante graduado. Lic FaMAF, UNCordoba)
            </Box>
            <Box p={2} paddingBottom={0} paddingTop={0}>
            Fido Garcia (CPA, CIMA-CONICET)
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
            Natalia Ruiz Dias (Laboratorio Central Prov. Corrientes)
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
        </AccordionDetails>
      </Accordion>





         <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
          <Typography className={classes.heading}>Metodología</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Typography align="left" variant="body2" gutterBottom color="textSecondary">
            <Box p={2}>
            Se realiza un monitoreo a tiempo real del avance del COVID-19 basado en técnicas de Monte Carlo que representan un ensamble de estados posibles.
            </Box>
            <Box p={2}>
            La técnica asimilación de datos permite combinar el ensamble de predicción resultante de modelos epidemiológicos con distintas fuentes de observaciones cuantificando la incertezas en las predicciones del modelo y en la estimación del estado oculto.
            </Box>
            <Box p={2}>
            La técnica asimilación utilizada es <b>ESMDA</b> (Emerick and Reynolds 2008). Esta técnica es descripta y evaluada para el COVID-19 en el trabajo (Evensen, et al 2020).
            </Box>
            <Box p={2}>
            El <b> modelo epidemiológico  </b> utilizado en la asimilación de datos corresponde a un SEIRHD con compartimento por edades. Figure X muestra los compartimentos del modelo para un grupo etario (Evensen, et al 2020).
            </Box>
            <Box p={2}>
            Las <b> fuentes de datos  </b> utilizados corresponden a la base de datos del SNVS (Sistema Nacional de Vigilancia de la Salud) del Ministerio de Salud de la Nacion y los informes diarios a nivel nacional y provincial tomados en forma automatica desde la red.
            </Box>
            <Box p={2}>
            Evensen G, J Amezcua , M Bocquet , A Carrassi, A Farchi , A Fowler , PL Houtekamer, CK Jones , RJ de Moraes, M Pulido , C Sampson, and FC Vossepoel, 2020: An international assessment of the COVID-19 pandemic using ensemble data assimilation. Submitted to Foundations of Data Science . https://doi.org/10.1101/2020.06.11.20128777
            </Box>
        </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export { ProjectInfo }

