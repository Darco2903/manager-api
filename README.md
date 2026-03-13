# Manager API

## Description

This package provides an API for interacting with Darco2903's game server manager, including features such as server status, console access, and more. It include only client utilities to facilitate the integration of the API across multiple applications.

## Installation

```bash
npm install @darco2903/manager-api
```

## Usage

### Creating a client

```ts
import { createClient } from "@darco2903/manager-api/client";

const SERVER_ORIGIN = "https://manager.example.com";
const managerApi = createClient(SERVER_ORIGIN);
```
