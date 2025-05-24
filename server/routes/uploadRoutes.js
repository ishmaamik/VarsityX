import express from 'express';
import { uploadFile, getFile } from "../controllers/file-controller.js";
import upload from "../utils/upload.js";
const route= express.Router()

route.post('/file/upload', upload.single('file'), uploadFile);
route.get('/file/:filename', getFile);

export default route;
