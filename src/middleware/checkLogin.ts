import { NextFunction, Request, Response } from "express";

const checkLogin =async (req:Request, res: Response, next:NextFunction) => {
    const token = req.cookies.accessToken;

    if(!token){
        return res.status(200).json({message:"Login Again token missing"})
    }
    next();
}


export default checkLogin;