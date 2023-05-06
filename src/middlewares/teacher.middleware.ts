import { NextFunction, Request, Response } from "express";

class TeacherMiddleware {
    register(req: Request, res: Response, next: NextFunction) {
        try {
            if(req.body.firstName && req.body.lastName && req.body.email && req.body.password) {
                next();
            } else {
                throw new Error("Invalid Credentials");
            }
        } catch(error) {
            console.error(error);
            res.status(400).json({message: error});
        }
    }
}

export default new TeacherMiddleware();