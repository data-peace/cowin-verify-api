import fastify from "fastify";
import fastifyMultipart from "fastify-multipart";

import { scanVaccineQr, verifyCertificate } from "./verifyCertificate";
import { getImageDataFromMultipartFile } from "./utils";

const server = fastify();
server.register(fastifyMultipart);

server.post("/verify-certificate", async (request, reply) => {
  const imageFile = await request.file();
  const imageData = await getImageDataFromMultipartFile(imageFile);
  const vaccineData = await scanVaccineQr(imageData);

  let verified = false;
  if (vaccineData)  verified = await verifyCertificate(vaccineData);
  if (!verified) return reply.code(400).send({"error": "Invalid certificate"})
  return {'data': vaccineData}
  
});

// TODO - move PORT to utils/constants
server.listen(process.env.PORT || 8080, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.info(`Server listening at ${address}`);
});
