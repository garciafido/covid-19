import React from 'react';
import Argentina from './argentina_politico';

const ArgentinaMap = (props: any) => (
    <div className="ArgentinaMap" style={{cursor: 'pointer'}}>
        <Argentina
            width={props.width}
            height={props.height}
            getColor={(provincia) => props.store.getColor(provincia)}
            clicked={(provincia) => props.store.setCurrentLocation(provincia)}
            out={"#C7BDC6"}
            sea={"#4791db"}/>
    </div>
);

export { ArgentinaMap };
