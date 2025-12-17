import { initContract } from "@ts-rest/core";
import { API_PATH_PREFIX } from "../consts.js";

import console from "./console.js";
import servers from "./servers.js";
import permissions from "./permissions.js";
import systemInfo from "./systemInfo.js";

const c = initContract();

export default c.router(
    {
        console,
        servers,
        permissions,
        ...systemInfo,
    },
    {
        pathPrefix: API_PATH_PREFIX,
    }
);
