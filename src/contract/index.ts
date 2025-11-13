import { initContract } from "@ts-rest/core";

const c = initContract();

export default c.router(
    {
        //
    },
    {
        pathPrefix: "/api/v2",
    }
);
