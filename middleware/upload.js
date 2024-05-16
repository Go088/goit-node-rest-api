import multer from "multer";
import path from "node:path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    console.log(path.resolve("tmp"));
    cb(null, path.resolve("tpm"));
  },
});

export default multer({ storage });
