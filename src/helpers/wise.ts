import * as dotenv from "dotenv";
import * as fs from "fs";

export class Wise {
    public async uploadImage(file) {
        const putObject: any = await this.s3PutObject(file);
        if (!putObject) {
            return {};
        } else {
            return false;
        }
    }

    public async s3PutObject(file) {
        fs.readFile(file.path, (error, fileContent) => {
            if (error) {
                return false;
            }
            const params = {
                // ACL: 'public-read',
                Body: fileContent,
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                ContentDisposition: "inline",
                ContentType: file.type || file.mime
            };
            
        });
    }
}
