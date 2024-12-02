import { NextFunction, Request, Response } from "express";

const parseRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log("data", req.body.data);
  req.body = JSON.parse(req.body.data);
  next();
};

export default parseRequest;
