import { INTERNAL_SERVER_ERROR_RESPONSE } from '@/common/constants/http-responses.types';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { Response } from 'express';

@Injectable()
export class FileUploadService {
  private readonly s3: AWS.S3;
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async upload(file: Express.Multer.File) {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${process.env.AWS_BUCKET_FOLDER_NAME}/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const res = await this.s3.upload(params).promise();
      return {
        location: res.Location,
        filePath: res.Key,
      };
    } catch (err: any) {
      console.error('❌Error uploading file', err);
      throw new HttpException(
        err.message || INTERNAL_SERVER_ERROR_RESPONSE.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async readFiles(filename: string, res: Response) {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
      };

      this.s3.headObject(params, async (err, data) => {
        if (err) {
          console.error('Error while fetching file from S3:', err);
          if (err.statusCode === 404) {
            return res.status(404).send({
              statusCode: 404,
              message: 'File not found',
            });
          } else {
            return res.status(500).send({
              statusCode: 500,
              message: err.message || 'Internal Server Error',
            });
          }
        }

        // checking the filetype here that is basically the mimetype ,
        // to make sure the file is readable in exact formate.
        // otherwise it will not read file properly except the images.
        const contentType = data?.ContentType || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);

        // creating the file stream
        const fileStream = this.s3.getObject(params).createReadStream();

        fileStream.on('error', (err: Error) => {
          console.error('Error fetching file from S3:', err);
          res.status(500).send({
            statusCode: 500,
            message: err.message,
          });
        });

        //steam pipeline is attached to the express response this if you dont know
        //about stream and pipes visit official nodejs docs
        return fileStream.pipe(res);
      });
    } catch (error: any) {
      throw new HttpException(
        error?.response?.body?.errors[0]?.message || error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
