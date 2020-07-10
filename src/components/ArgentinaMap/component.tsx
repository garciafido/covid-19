import React from 'react'
import Argentina from './argentina_politico';

const ArgentinaMap = (props: any) => (
    <div className="ArgentinaMap">
        <Argentina
            width={props.width}
            height={props.height}
            getColor={(provincia) => props.store.color[provincia]}
            clicked={(provincia) => alert(provincia)}
            out={"#C7BDC6"}
            sea={"#90d8ff"} />
    </div>
);

export { ArgentinaMap };
