import { Response } from 'express';
import { json } from 'body-parser';
import RequestWithRawBody from '../interfaces/requestWithRawBody.interface';

function RawBodyMiddleware() {
  return json({
    verify: (
      request: RequestWithRawBody,
      _response: Response,
      buffer: Buffer,
    ) => {
      console.log(request.url);
      if (request.url === '/api/webhook' && Buffer.isBuffer(buffer)) {
        request.rawBody = Buffer.from(buffer);
      }
      return true;
    },
  });
}

export default RawBodyMiddleware;
