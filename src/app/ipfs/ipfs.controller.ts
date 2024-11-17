/* import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IpfsService } from './ipfs.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'; */
import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { IpfsService } from './ipfs.service';
import {
  ApiBody,
  ApiConsumes,
  ApiExcludeController,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
@ApiExcludeController()
@ApiTags('upload/download IPFS system file')
@Controller('ipfs')
export class IpfsController {
  constructor(private readonly ipfsService: IpfsService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to upload',
    type: 'multipart/form-data',
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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ hash: string }> {
    const fileBuffer = file.buffer;
    const hash = await this.ipfsService.uploadFile(fileBuffer);
    return { hash };
  }

  @Get('download/:cid')
  async downloadFile(
    @Param('cid') cid: string,
    //@Res() res: Response,
  ): Promise<any> {
    const fileBuffer = await this.ipfsService.downloadFile(cid);
    return fileBuffer;
    //res.setHeader('Content-Type', 'application/octet-stream');
    //res.send(fileBuffer);
  }

  /*   @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('mutipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'object',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileBuffer = file.buffer; // Assuming multer middleware is used to parse file uploads
    const ipfsHash = await this.ipfsService.uploadFile(fileBuffer);
    return { ipfsHash };
  } */
}
