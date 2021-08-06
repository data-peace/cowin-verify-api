import fastify from "fastify";
import fastifyMultipart from "fastify-multipart";
import type { MultipartFile, MultipartValue } from "fastify-multipart";
import fastifyCors from "fastify-cors";
import { scanVaccineQr, verifyCertificate, getEncryptedCertificateData } from "./verifyCertificate";
import { getInfoFromCertificateData, getMultipartFileData, getDataFromBase64 } from "./utils";
import { logger } from "./utils/logger";
import { CertificateValidationError } from "./utils/error";

const server = fastify({ logger: logger });

server.register(fastifyCors, {
  origin: "*",
  maxAge: 60 * 60 * 1, // 1 hour
});

server.register(fastifyMultipart, {
  limits: {
    fileSize: parseInt(process.env.MAX_FORM_FILE_SIZE || "") || 1024 * 1024, // 1024KB or 1MB,
    fieldSize: parseInt(process.env.MAX_FORM_FIELD_SIZE || "") || 100 * 1024, // 100 KB,
    files: 1, // Maximum one file field allowed
    fields: 1, // Maximum one non-file field allowed
  }
  , attachFieldsToBody: true, // append form data to request body
});

server.post("/verify-certificate", async (request, reply) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = request.body;
    if (!data) {
      return reply.code(400).send({ "error": "No form data found, either set 'file' or 'qr_data' form field." });
    }

    let vaccineData = null;
    if ("qr_data" in data && data.qr_data.value !== undefined) {
      data.qr_data as MultipartValue<string>;
      vaccineData = await getEncryptedCertificateData(await getDataFromBase64(data.qr_data.value));
    }
    else if ("file" in data && data.file.file !== undefined) {
      data.file as MultipartFile;
      const imageData = await getMultipartFileData(data.file);
      vaccineData = await scanVaccineQr(imageData);
    }

    if (!vaccineData) {
      return reply.code(400).send({ "error": "Form data is invalid, not found expected form fields." });
    }

    const verified = await verifyCertificate(vaccineData);
    if (!verified) throw new CertificateValidationError("Failed to verify certificate");

    return { "shortInfo": getInfoFromCertificateData(vaccineData), "certificateData": vaccineData };

  } catch (err) {
    logger.error(err);
    if (err instanceof CertificateValidationError) return reply.code(400).send({ "error": err.message });

    return err;
  }

});

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
async function closeGracefully(signal: any) {
  logger.info("Closing server gracefully");
  await server.close();
  process.exit();
}
process.on("SIGINT", closeGracefully);


// TODO - move PORT to utils/constants
server.listen(process.env.PORT || 8080, process.env.HOST || "127.0.0.1", (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.info(`Server listening at ${address}`);
});
