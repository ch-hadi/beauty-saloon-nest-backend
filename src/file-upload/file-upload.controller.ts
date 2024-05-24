import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('File Upload')
@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload files' })
  @ApiCreatedResponse({
    status: 201,
    description: 'file uploaded',
    schema: {
      type: 'object',
      example: {
        succeeded: true,
        statusCode: 201,
        message: 'Operation successful',
        data: {
          location: 'file cloud url',
          filePath: 'file path',
        },
        meta: null,
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileUploadService.upload(file);
  }

  @ApiOperation({
    summary: 'View file against file-path returned by upload api',
  })
  @Get('read/:filename')
  @ApiParam({
    name: 'filename',
    type: 'string',
    required: true,
    description: 'S3 object key/filename/filepath',
  })
  @ApiNotFoundResponse({ description: 'File Not Found' })
  @ApiResponse({ status: 200, description: 'File found and returned' })
  @ApiOperation({ summary: 'Download an uploaded file from S3' })
  getFile(@Param('filename') fileName: string, @Res() res: Response) {
    return this.fileUploadService.readFiles(fileName, res);
  }
}
