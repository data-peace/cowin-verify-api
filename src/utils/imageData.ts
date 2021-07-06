import type { MultipartFile } from "fastify-multipart";
import { Canvas, loadImage } from "canvas";

export async function getImageDataFromMultipartFile(imageFile: MultipartFile) {
  const image = await loadImage(await imageFile.toBuffer());
  const canvas = new Canvas(image.width, image.height, "image");
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return imageData;
}
