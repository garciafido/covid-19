import React from 'react'
import Argentina from './argentina_politico';

function ArgentinaMap() {
  return (
    <div className="ArgentinaMap">
        <Argentina width={"700"} height={"700"}
                   getColor={(provincia) => "#fff"}
                   clicked={(provincia) => alert(provincia)}
                   out={"#C7BDC6"}
                   sea={"#90d8ff"} />
    </div>
  );
}

export { ArgentinaMap };
