import { Injectable } from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import { PrismaService } from 'prisma/prisma.service';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService, private configService: ConfigService) {}


    async saveImage(base64: string): Promise<string> {
        const fileName = `${Date.now()}.png`;
        const filePath = path.join('/usr/src/app/uploads', fileName);  

        await this.saveBase64AsFile(base64, filePath);

        const domain = this.configService.get<string>('DOMAIN');
        const accessibleUrl = `${domain}/uploads/${fileName}`;

        return accessibleUrl;
    }

    async ensureDirectoryExistence(filePath: string) {
        const dirname = path.dirname(filePath);
        try {
            await fsPromises.access(dirname);
        } catch (e) {
            await fsPromises.mkdir(dirname, { recursive: true });
        }
    }

    private async saveBase64AsFile(base64: string, filePath: string): Promise<void> {
        const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        await this.ensureDirectoryExistence(filePath);
        await fsPromises.writeFile(filePath, buffer);
    }

}
