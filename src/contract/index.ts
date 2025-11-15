import { initContract } from "@ts-rest/core";
import { API_PATH_PREFIX } from "../consts.js";

import systemInfo from "./systemInfo.js";

const c = initContract();

export default c.router(
    {
        ...systemInfo,
    },
    {
        pathPrefix: API_PATH_PREFIX,
    }
);
