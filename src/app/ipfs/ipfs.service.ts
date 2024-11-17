import { Injectable } from '@nestjs/common';
import axios from 'axios';
//import IPFS from 'ipfs-http-client';
//import { create } from 'ipfs-http-client';
//import * as IPFS from 'ipfs-api';

@Injectable()
export class IpfsService {
  async uploadFile(file): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      `${process.env.IPFS_POST_URL}/add`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data.Hash;
  }

  async downloadFile(cid: string): Promise<Buffer> {
    const response = await axios.get(`${process.env.IPFS_PASSRELLE}/${cid}`, {
      responseType: 'arraybuffer',
    });

    return Buffer.from(response.data);
  }
}
