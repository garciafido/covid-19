import React from "react";
import Typography from "@material-ui/core/Typography";

const ChartMapExplanation = (props: any) => {
         return <>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
            El mapa permite visualizar la distribución por provincias de las diferentes variables estimadas o pronosticadas.
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
            Para visualizar los datos de una provincia en particular, hacer click sobre la provincia seleccionada. Esta acción desplegará los datos correspondientes en la figura de la derecha. Para visualizar nuevamente los datos totales para Argentina, hacer click en alguna región del mapa fuera de Argentina.
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
            Al inicio, el mapa muestra los datos correspondientes a la última fecha de monitoreo. Para cambiar la fecha, ir al gráfico de líneas de la derecha, posicionarse sobre el área del gráfico en la fecha deseada y hacer click. El mapa mostrará automáticamente los valores correspondientes a la fecha seleccionada.
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
            La escala de colores del mapa se ajusta por defecto al máximo valor alcanzado durante el período de monitoréo. En caso de querer ajustar la escala al máximo de la fecha elegida hacer click en “Ajustar paleta al …” en la parte inferior del mapa y la paleta se adecuará automáticamente. La paleta por defecto se puede recuperar haciendo click en “Paleta por defecto”.
            </Typography>
            <Typography align="left" variant="body2" gutterBottom color="textSecondary">
            La escala correspondiente de colores de la figura puede ser logarítmica (en caso que el valor máximo de la serie supere 5000 unidades) o lineal.
            </Typography>
         </>;
};

export { ChartMapExplanation };
