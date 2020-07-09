import React from 'react'
import Argentina from './argentina_politico';

function ArgentinaMap() {
  return (
    <div className="ArgentinaMap">
        <Argentina width={"700"} height={"700"}
                   mendoza={"#FFF690"}
                   malvinas={"#FFF690"}
                   antartida={"#FFF690"}
                   antartida_out={"#C7BDC6"}
                   sea={"#90d8ff"} />
    </div>
  );
}

export { ArgentinaMap };
