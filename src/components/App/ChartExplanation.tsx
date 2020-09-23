import React from "react";
import Typography from "@material-ui/core/Typography";
import {Box} from "@material-ui/core";

const box = (color: string) => {return <Box width={65} height={5} bgcolor={color} />};

const red = "#b71c1c";
const green = "#1abaa8";
const blue = "#01579b";

const ChartExplanation = (props: any) => {
    if (props.mode === "monitoreo") {
        if (props.explanation === "r") {
         return <>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>{box(blue)} Línea azul:</h3>
                Número de reproducción efectivo R(t) estimado por el sistema de asimilación
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>Sombreado azul:</h3>
                Desviación estándar de la estimación de R(t)
            </Typography>
         </>;
        }

        if (props.explanation === "cases") {
         return <>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>{box(red)} Línea roja:</h3>
                Casos acumulados detectados con la informacón provista por el Ministerio de Salud
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>{box(blue)} Línea azul:</h3>
                Estimación de la media de casos acumulados obtenida por el sistema de asimilación
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>Sobreado azul:</h3>
                Desviación estándar de la estimación de casos
            </Typography>
         </>;
        }

        if (props.explanation === "deads") {
         return <>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>{box(red)} Línea roja:</h3>
                Número de fallecimientos acumulados informados por el Ministerio de Salud
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>{box(blue)} Línea azul:</h3>
                Estimación de la media del número de fallecimientos acumulados obtenida por el sistema de asimilación
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>Sobreado azul:</h3>
                Desviación estándar de la estimación de fallecimientos
            </Typography>
         </>;
        }

        if (props.explanation === "actives") {
         return <>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>{box(blue)} Línea azul:</h3>
                Número de infectados por COVID-19 activos al día de la fecha estimados por el sistema de asimilación
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>Sobreado azul:</h3>
                Desviación estándar de la estimación de infectados por COVID-19
            </Typography>
         </>;
        }
    } else {
        if (props.explanation === "r") {
         return <>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>Número de reproducción efectivo R(t) asumidos a escenarios futuros</h3>
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>{box(green)} Línea verde:</h3>
                Escenario optimista donde el R(t) disminuye en 15 días por 0.4 y luego permanece en el nuevo valor durante los próximos 15 días
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>{box(blue)} Línea azul:</h3>
                Escenario que conserva el R(t) obtenido en la ultima observación
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>{box(red)} Línea roja:</h3>
                Escenario pesimista donde el R(t) se incrementa linealmente en 15 dias por 0.4 y luego permanece en el nuevo valor durante los próximos 15 días
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>Sobreados:</h3>
                Desviación estándar de la predicción de casos
            </Typography>
         </>;
        }

        if (props.explanation === "cases") {
         return <>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>Predicción a 30 días del número de casos de infectados acumulados</h3>
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>{box(green)} Línea verde:</h3>
                Predicción en un escenario optimista con mayor distanciamiento social
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>{box(blue)} Línea azul:</h3>
                Predicción en un escenario conservando las medidas de distanciamiento social actuales
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>{box(red)} Línea roja:</h3>
                Predicción en un escenario pesimista con menor distanciamiento social
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>Sobreados:</h3>
                Desviación estándar de la predicción de casos
            </Typography>
         </>;
        }

        if (props.explanation === "deads") {
         return <>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>Predicción a 30 días del número de fallecimientos acumulados por COVID-19</h3>
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>{box(green)} Línea verde:</h3>
                Predicción en un escenario optimista con mayor distanciamiento social
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>{box(blue)} Línea azul:</h3>
                Predicción en un escenario conservando las medidas de distanciamiento social actuales
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>{box(red)} Línea roja:</h3>
                Predicción en un escenario pesimista con menor distanciamiento social
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>Sobreados:</h3>
                Desviación estándar de la predicción de fallecimientos
            </Typography>
         </>;
        }

        if (props.explanation === "actives") {
         return <>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>Predicción del número de casos activos para los próximos 30 días</h3>
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>{box(red)} Línea roja:</h3>
                Predicción en un escenario pesimista con menor distanciamiento social
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>{box(blue)} Línea azul:</h3>
                Predicción en un escenario conservando las medidas de distanciamiento social actuales
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>{box(green)} Línea verde:</h3>
                Predicción en un escenario optimista con mayor distanciamiento social
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
                <h3>Sobreados:</h3>
                Desviación estándar de la predicción de casos activos
            </Typography>
         </>;
        }
    }

    return <>
         </>;
};

export { ChartExplanation };
