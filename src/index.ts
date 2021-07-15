import fastify from "fastify";
import fastifyMultipart from "fastify-multipart";

import { scanVaccineQr, verifyCertificate } from "./verifyCertificate";
import { getImageDataFromMultipartFile, getInfoFromCertificateData } from "./utils";
import { logger } from "./utils/logger";
import { CertificateValidationError } from "./utils/error";

const server = fastify({logger:logger});
server.register(fastifyMultipart);

server.post("/verify-certificate", async (request, reply) => {
  try{
    const imageFile = await request.file();
    const imageData = await getImageDataFromMultipartFile(imageFile);

    const vaccineData = await scanVaccineQr(imageData);
    if (!vaccineData) throw new CertificateValidationError("Failed to scan certificate qr");

    const verified = await verifyCertificate(vaccineData);
    if (!verified) throw new CertificateValidationError("Failed to verify certificate");
    
    return {"shortInfo": getInfoFromCertificateData(vaccineData), "certificateData": vaccineData};

  } catch (err) {
    logger.error(err);
    if (err instanceof CertificateValidationError) return reply.code(400).send({"error": err.message});

    return reply.code(500).send({"error": "Something went wrong. Please try again later."});
  }
  
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function closeGracefully(signal: any) {
  logger.info("Closing server gracefully");
  await server.close();
  process.exit();
}
process.on("SIGINT", closeGracefully);


// TODO - move PORT to utils/constants
server.listen(process.env.PORT || 8080, process.env.HOST || "127.0.0.1" ,(err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.info(`Server listening at ${address}`);
});
