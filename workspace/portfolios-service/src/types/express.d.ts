import "express-serve-static-core";


/* 

    Every time you use an Express router or middleware anywhere 
    in your project, req.id will now be recognized globally as a valid 
    string by your IDE and compiler, preventing the infamous 
    error: “Property 'id' does not exist on type 'Request'”.
    This allows you to seamlessly integrate request IDs into your
    Express application without any type errors, enhancing both the 
    developer experience and the maintainability of your codebase. 
*/
declare module "express-serve-static-core" {
  interface Request {
    id: string;
  }
}


declare global {
  namespace Express {
    interface Request {
      user?: { publicId: string; role: string };
    }
  }
}