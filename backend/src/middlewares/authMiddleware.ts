// import {Request, Response, NextFunction} from "express"
// import jwt from "jsonwebtoken"

// export const authenticateJWT = (req:Request, res:Response, next:NextFunction) => {
//   const token = req.header("Authorization")?.split(" ")[1];
//   if (!token) return res.sendStatus(401);
//   jwt.verify(token, "secret_key", (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };
