import type { MultipartFile } from "fastify-multipart";
import { Canvas, loadImage } from "canvas";
import { fromBuffer } from "pdf2pic";


async function getImageDataFromBuffer(buffer: Buffer) {
  const image = await loadImage(buffer);
  const canvas = new Canvas(image.width, image.height, "image");
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return imageData;
}

export async function getMultipartFileData(file: MultipartFile) {
  const type = file.mimetype.split("/");
  if (type[0] === "image") return await getImageDataFromImageFile(file);
  else return await getImageDataFromPDFFile(file);
}

export async function getImageDataFromImageFile(imageFile: MultipartFile) {
  const imageData = await getImageDataFromBuffer(await imageFile.toBuffer());
  return imageData;
}

async function getImageDataFromPDFFile(pdfFile: MultipartFile) {
  const ImageBuffer = await convertPDFtoImage(pdfFile);
  const imageData = await getImageDataFromBuffer(ImageBuffer);
  return imageData;
}


async function convertPDFtoImage(pdfFile: MultipartFile) {
  const baseOptions = {
    width: 1024,
    height: 1024,
    density: 300
  };

  const convert = fromBuffer(await pdfFile.toBuffer(), baseOptions);
  const pageOutput = await convert(1, true);
  const pngBuffer = Buffer.from(Object(pageOutput).base64, "base64");
  return pngBuffer;
}

export async function getDataFromBase64(base64: string) {
  return Buffer.from(base64, "base64").toString("binary");
}
