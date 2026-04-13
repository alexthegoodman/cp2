import { nanoid } from "nanoid";
import ERROR_CODES from "./ERROR_CODES";
const { DateTime } = require("luxon");

import { put } from "@vercel/blob";

export default class VBlob {
  constructor() {}

  getUploadDirectory() {
    const year = DateTime.now().toFormat("yyyy");
    const month = DateTime.now().toFormat("MM");
    const folder = `${year}/${month}/`;
    return folder;
  }

  getSizeBase64(length) {
    const size = length * (3 / 4);
    return size;
  }

  async uploadAsset(contentType, filename, fileType, fileSize, base64) {
    const sizeLimit = 10000000; // 10MB
    const calculatedFileSize = this.getSizeBase64(base64.length);

    if (calculatedFileSize < sizeLimit && fileSize < sizeLimit) {
      const dotIndex = filename.lastIndexOf(".");
      const fileExtension = filename.substring(dotIndex);
      const fileTitle = filename.substring(0, dotIndex);
      const uniqueFileTitle = fileTitle + "-" + nanoid(10);
      const bucketUploadDirectory = this.getUploadDirectory();

      // TODO: eliminate transparency without file corruption
      const key = bucketUploadDirectory + uniqueFileTitle + fileExtension;

      console.info("uploadAsset to vercel blob ", key, fileType);

      let buffer;
      if (contentType === "image") {
        buffer = Buffer.from(
          base64.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );
      } else if (contentType === "video") {
        buffer = Buffer.from(
          base64.replace(/^data:video\/\w+;base64,/, ""),
          "base64"
        );
      } else if (contentType === "audio") {
        buffer = Buffer.from(
          base64.replace(/^data:audio\/\w+;base64,/, ""),
          "base64"
        );
      }

      try {
        const { url } = await put(key, buffer, { access: 'public' });

        return url;
      } catch (err) {
        console.error("Error", err);
      }
    } else {
      console.error(ERROR_CODES.B001);
    }
  }
}
