import { Request, Response, NextFunction } from 'express';
import fetch, { Response as FetchResponse } from 'node-fetch';
import * as jwt from 'jsonwebtoken';
import config from '../../../config';
import HTTPError from '../../../error/http';

interface Header {
  alg: string;
  kid: string;
}

interface Payload {
  exp: number;
  iat: number;
  aud: string;
  iss: string;
  sub: string;
  auth_time: number;
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

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return next(new HTTPError.Unauthorized());
  }

  const authParams = authHeader.split(' ');
  if (authParams.length !== 2 || authParams[0] !== 'Bearer' || authParams[1].length === 0) {
    return next(new HTTPError.Unauthorized());
  }

  const jwtToken = authParams[1];
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
    const curTime = Date.now();
    if (
      header.alg !== 'RS256' ||
      !(header.kid in Object.keys(response)) ||
      payload.exp - curTime < 0 ||
      payload.iat - curTime > 0 ||
      payload.aud !== config.firebase.projectId ||
      payload.iss !== `https://securetoken.google.com/${config.firebase.projectId}` ||
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
    return next();
  } catch (err) {
    return next(new HTTPError.Unauthorized());
  }
};

export default authenticate;