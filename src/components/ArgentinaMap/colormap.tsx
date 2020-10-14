import * as React from "react";

type ColormapProps = {
 values: any
}

function SvgColormap(props: ColormapProps) {
  return (
    <svg viewBox="45 8 346 29" width={346} height={29} {...props}>
<g id="figure_1">
  <g id="patch_1">
   <path d="M 0 72
L 432 72
L 432 0
L 0 0
z
" fill={"#ffffff"} />
  </g>
  <g id="axes_1">
   <g id="QuadMesh_1">
    <path clip-path="url(#p827964bed4)" d="M 91.2 26
L 128.4 26
L 128.4 8.64
L 91.2 8.64
L 91.2 26
"  fill={"#f3e08c"} />
    <path clip-path="url(#p827964bed4)" d="M 128.4 26
L 165.6 26
L 165.6 8.64
L 128.4 8.64
L 128.4 26
" fill={"#fac55f"} />
    <path clip-path="url(#p827964bed4)" d="M 165.6 26
L 202.8 26
L 202.8 8.64
L 165.6 8.64
L 165.6 26
" fill={"#faa930"} />
    <path clip-path="url(#p827964bed4)" d="M 202.8 26
L 240 26
L 240 8.64
L 202.8 8.64
L 202.8 26
" fill={"#fba953"} />
    <path clip-path="url(#p827964bed4)" d="M 240 26
L 277.2 26
L 277.2 8.64
L 240 8.64
L 240 26
" fill={"#f96a00"} />
    <path clip-path="url(#p827964bed4)" d="M 277.2 26
L 314.4 26
L 314.4 8.64
L 277.2 8.64
L 277.2 26
" fill={"#f34e00"} />
    <path clip-path="url(#p827964bed4)" d="M 314.4 26
L 351.6 26
L 351.6 8.64
L 314.4 8.64
L 314.4 26
" fill={"#e32f00"} />
    <path clip-path="url(#p827964bed4)" d="M 351.6 26
L 388.8 26
L 388.8 8.64
L 351.6 8.64
L 351.6 26
" fill={"#d00a00"} />
   </g>
   <g id="patch_3">
    <path d="M 54 26
L 91.2 26
L 351.6 26
L 388.8 26
L 388.8 8.64
L 351.6 8.64
L 91.2 8.64
L 54 8.64
z
" fill={"none"} stroke={"#000000"} />
     <text x="91.2" y="35" textAnchor="middle" fill="#000000" font-size="9">{props.values[0]}</text>
     <text x="128.4" y="35" textAnchor="middle" fill="#000000" font-size="9">{props.values[1]}</text>
     <text x="165.6" y="35" textAnchor="middle" fill="#000000" font-size="9">{props.values[2]}</text>
     <text x="202.8" y="35" textAnchor="middle" fill="#000000" font-size="9">{props.values[3]}</text>
     <text x="240" y="35" textAnchor="middle" fill="#000000" font-size="9">{props.values[4]}</text>
     <text x="277.2" y="35" textAnchor="middle" fill="#000000" font-size="9">{props.values[5]}</text>
     <text x="314.4" y="35" textAnchor="middle" fill="#000000" font-size="9">{props.values[6]}</text>
     <text x="351.6" y="35" textAnchor="middle" fill="#000000" font-size="9">{props.values[7]}</text>
   </g>
  </g>
 </g>
    </svg>
  );
}

export default SvgColormap;

