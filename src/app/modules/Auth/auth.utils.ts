import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: {
    userId: string;
    roles: string[];
    email: string;
    status: string;
    isDeleted: boolean;
    _id:string
  },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
