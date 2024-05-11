import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileTypeFromBuffer } from 'file-type';

@Injectable()
export class FileService {
  private readonly uploadFolder = path.join(__dirname, '../../uploads');

  async saveImage(base64: string): Promise<string> {
    const buffer = Buffer.from(base64, 'base64');
    const type = await fileTypeFromBuffer(buffer);
    if (!type || !type.mime.startsWith('image/')) {
      throw new Error('Unsupported file type');
    }

    const filename = `${Date.now()}.${type.ext}`;
    const filepath = path.join(this.uploadFolder, filename);
    await fs.writeFile(filepath, buffer);
    return `http://localhost:3000/uploads/${filename}`;
  }
}
