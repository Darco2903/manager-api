import { initContract } from "@ts-rest/core";
import { API_PATH_PREFIX } from "../consts.js";

import app from "./app.js";
import console from "./console.js";
import servers from "./servers.js";
import permissions from "./permissions.js";
import system from "./system.js";
import files from "./files.js";
import users from "./users.js";
import backups from "./backups.js";

const c = initContract();

export default c.router(
    {
        app,
        console,
        servers,
        permissions,
        system,
        files,
        users,
        backups,
    },
    {
        pathPrefix: API_PATH_PREFIX,
    }
);
