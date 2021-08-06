import fastify from "fastify";
import fastifyMultipart from "fastify-multipart";
import fastifyCors from "fastify-cors";
import { scanVaccineQr, verifyCertificate, getEncryptedCertificateData} from "./verifyCertificate";
import { getInfoFromCertificateData, getImageData, convertFromBase64 } from "./utils";
import { logger } from "./utils/logger";
import { CertificateValidationError } from "./utils/error";


const server = fastify({logger:logger});

server.register(fastifyCors, {
  origin: "*",
  maxAge: 60*60*1, // 1 hour
});

server.register(fastifyMultipart,  {
    limits: {
      fileSize: parseInt(process.env.MAX_UPLOAD_FILE_SIZE || "") || 1024*1024, // 1024KB or 1MB
    }, attachFieldsToBody: true, // append form data to request body
  });

server.post("/verify-certificate", async (request, reply) => {
  try{
    const data = Object(Object.values(Object(request.body))[0])
    let vaccineData = null;

    if (data.fieldname === 'qr_data'){
      vaccineData = await getEncryptedCertificateData(await convertFromBase64(data['value']))
    } else {
      const imageFile = data;
      const imageData = await getImageData(imageFile);
      vaccineData = await scanVaccineQr(imageData);
    }
    
    if (!vaccineData) throw new CertificateValidationError("Failed to scan certificate qr");

    const verified = await verifyCertificate(vaccineData);
    if (!verified) throw new CertificateValidationError("Failed to verify certificate");
    
    return {"shortInfo": getInfoFromCertificateData(vaccineData), "certificateData": vaccineData};

  } catch (err) {
    logger.error(err);
    if (err instanceof CertificateValidationError) return reply.code(400).send({"error": err.message});

    return err;
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
