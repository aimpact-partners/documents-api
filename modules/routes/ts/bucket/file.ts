import { Storage } from "@google-cloud/storage";
import * as os from "os";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./credentials";
import * as fs from "fs";
import * as path from "path";

export class FilestoreFile {
  private app;
  private storage;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.storage = new Storage();
  }

  async upload(path: string, destination: string): Promise<string> {
    const bucketName = firebaseConfig.storageBucket;
    await this.storage.bucket(bucketName).upload(path, { destination });

    console.log("bucket upload ", destination);

    return destination;
  }

  /**
   *
   * @deprecated
   */
  async write(fileUploaded, filename: string, name: string = ""): Promise<string> {
    const bucketName = firebaseConfig.storageBucket;
    const file = this.storage.bucket(bucketName).file(filename);
    const tempFilePath = path.join(os.tmpdir(), name);
    fs.promises.writeFile(tempFilePath, fileUploaded.buffer);

    return this.upload(tempFilePath, filename);
  }
}
