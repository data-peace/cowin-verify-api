import JSZip from "jszip";
import { scanImageData } from "zbar.wasm";
import { logger } from "../utils/logger";

import type { CertificateData } from "./CertificateData";

const CERTIFICATE_FILENAME = "certificate.json";

async function getVaccineCertificateContent(data: string) {
  if (!data) return "";

  try {
    const zip = new JSZip();
    const contents = await zip.loadAsync(data);
    const certificateContent = await contents.files[CERTIFICATE_FILENAME].async(
      "text"
    );
    return JSON.parse(certificateContent) as CertificateData;
  } catch (err) {
    logger.error(err);
    return null;
  }
}

export async function getEncryptedCertificateData(data: string){
  const certificateData = await getVaccineCertificateContent(data);
  if (certificateData) return certificateData;
  return null;
}

export async function scanVaccineQr(qrImage: ImageData) {
  const symbols = await scanImageData(qrImage);
  for (let i = 0; i < symbols.length; ++i) {
    const sym = symbols[i];
    const certificateResult = await getVaccineCertificateContent(sym.decode());
    if (certificateResult) {
      return certificateResult;
    }
  }

  return null;
}
