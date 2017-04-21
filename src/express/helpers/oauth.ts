import { NextFunction, Request, Response } from 'express';

/**
 * Helper function for oauth2
 *
 * @param req express request object
 * @param res express response object
 * @param next express next function
 */
export async function oauth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return false;
}
