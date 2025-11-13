import { initContract } from "@ts-rest/core";
import { API_PATH_PREFIX } from "../consts.js";

const c = initContract();

export default c.router(
    {
        //
    },
    {
        pathPrefix: API_PATH_PREFIX,
    }
);
