# Manager API

## Description

This API is a TypeScript client for the Darco2903 server manager.

## Installation

```bash
npm install manager-api-<version>.tgz
npm install @ts-rest/core zod@3.22.3
```

## Usage

Create an instance of the API

```ts
import { initClient } from "@ts-rest/core";
import { contract } from "manager-api";

const api = initClient(contract, {
    baseUrl: "https://api.example.com",
});
```
