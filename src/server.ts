export * from "./common.js";
// import type { JwtPayload } from "jsonwebtoken";

// export async function JWTVerify(
//     token: string,
//     pubKey: string
// ): Promise<JwtPayload | string | undefined> {
//     if (typeof window !== "undefined") {
//         throw new Error(
//             "JWTverify should not be called in the browser context"
//         );
//     }

//     return new Promise(async (resolve) => {
//         const jwt = (await import("jsonwebtoken")).default;
//         jwt.verify(token, pubKey, (err, decoded) => {
//             resolve(err ? undefined : decoded);
//         });
//     });
// }
