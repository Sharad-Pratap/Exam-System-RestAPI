import { NextFunction, Request, Response } from "express";
import User ,{IUser} from '../db/userModel'
import { jwtDecode } from "jwt-decode";

import { find } from "lodash";

interface Token{
    "userId": string;
    "iat": number;
    "exp": number;
    "token" : string;
}
const roles = "examiner";
const checkAuth =async (req:Request, res:Response, next : NextFunction) => {
    try {

        const token = req.cookies.accessToken;

        const decodedToken = jwtDecode<Token>(token);
        const _id = decodedToken.userId

        const userId = await User.findOne({_id})
        if(roles !== userId?.role){
            return res.status(400).json({message:"Unauthorised"})
        }
        next();
        
        
    } catch (error) {
        console.log(error);
        res.status(400).json({error:error});
    }
    
}

export default checkAuth;