import { UploadDAO } from "./upload.dao.js";
export class UploadRepository { constructor(private readonly dao: UploadDAO = new UploadDAO()) {} configuration() { return this.dao.configuration(); } }
