import { CONFIG } from "../config";
import { Request, Response, NextFunction } from "express";

export class Authorizer {

  static SimpleLogin(req: Request, res: Response){

    const userPass = req.body.pass;

    if(userPass === CONFIG.PASS){

      res.status(200).send({"key":CONFIG.AUTH});

    } else {
      
      res.status(401).send({"message":"Wrong Password!"});

    }

  }

  static IsSimpleAuthorized(req : Request, res: Response, next: NextFunction){

    const authHeader = req.headers.authorization;

    if(!authHeader){
      console.log("Authorization failed - No Auth Provided!");
      return res.status(403).send({
        "message" : "You must be logged in to request this endpoint"
      });
    }

    if(authHeader === CONFIG.AUTH){

      next();

    } else {
      console.log("Authorization failed - Wrong Auth! Provided: ", authHeader);
      return res.status(403).send({
        "message" : "You must be logged in to request this endpoint"
      });
    }

  }

}