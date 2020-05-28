import { Request, Response, NextFunction } from 'express';
import fetch, { Response as FetchResponse } from 'node-fetch';
import * as jwt from 'jsonwebtoken';
import config from '../config';
import HTTPError from '../error/http';

interface Header {
  alg: string;
  kid: string;
  [key: string]: any;
}

interface Payload {
  exp: number;
  iat: number;
  aud: string;
  iss: string;
  sub: string;
  auth_time: number;
  [key: string]: any;
}

interface PublicKeysResponse {
  [key: string]: string;
}

const handleFetchNotOk = <T>(response: FetchResponse): Promise<T> => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response.json() as Promise<T>;
};

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const jwtToken = req.query.idToken as string;
  const decodedToken = jwt.decode(jwtToken, { complete: true });
  if (!decodedToken) {
    return next(new HTTPError.Unauthorized());
  }

  if (typeof decodedToken === 'string') {
    return next(new HTTPError.Unauthorized());
  }

  const { header, payload } = decodedToken as {
    header: Header;
    payload: Payload;
  } & typeof decodedToken;

  try {
    const apiResponse = await fetch(config.firebase.publicKeyUrl);
    const response = await handleFetchNotOk<PublicKeysResponse>(apiResponse);
    const curTime = Math.ceil(Date.now() / 1000);
    if (
      header.alg !== config.firebase.alg ||
      !(header.kid in response) ||
      payload.exp - curTime < 0 ||
      payload.iat - curTime > 0 ||
      payload.aud !== config.firebase.projectId ||
      payload.iss !== config.firebase.issUrl ||
      typeof payload.sub !== 'string' ||
      payload.sub === '' ||
      payload.sub.length > 128 ||
      payload.auth_time - curTime > 0
    ) {
      return next(new HTTPError.Unauthorized());
    }
    jwt.verify(jwtToken, response[header.kid], {
      algorithms: [config.firebase.alg as jwt.Algorithm],
    });
    res.locals.name = payload.name;
    res.locals.picture = payload.picture;
    res.locals.userId = payload.user_id;
    res.locals.email = payload.email;
    return next();
  } catch (err) {
    return next(new HTTPError.Unauthorized());
  }
};

export const testAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
  res.locals.name = 'abcd';
  res.locals.picture = 'abcd';
  res.locals.userId = 'abcd';
  res.locals.email = 'abcd';
  return next();
};

export default authenticate;
