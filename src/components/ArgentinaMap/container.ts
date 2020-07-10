import { ArgentinaMap } from "./component";
import {observer} from "mobx-react";

export const ArgentinaMapMenu = observer((store: any) => {
    return ArgentinaMap(store);
});