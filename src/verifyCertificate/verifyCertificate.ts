import jsigs from "jsonld-signatures";
import { RSAKeyPair } from "crypto-ld";
import { documentLoaders } from "jsonld";
import { contexts } from "security-context";
import { vaccinationContext } from "vaccination-context";

import config from "./config.json";
import credentialsv1 from "./credentials.json";

import type { CertificateData } from "./CertificateData";

const { node: documentLoader } = documentLoaders;

const customLoader = (url: string) => {
  const c: Record<string, any> = {
    "did:india": config.certificatePublicKey,
    "https://example.com/i/india": config.certificatePublicKey,
    "https://w3id.org/security/v1": contexts.get(
      "https://w3id.org/security/v1"
    ),
    "https://www.w3.org/2018/credentials#": credentialsv1,
    "https://www.w3.org/2018/credentials/v1": credentialsv1,
    "https://cowin.gov.in/credentials/vaccination/v1": vaccinationContext,
  };

  let context = c[url];
  if (context === undefined) {
    context = contexts[url];
  }

  if (context !== undefined) {
    return {
      contextUrl: null,
      documentUrl: url,
      document: context,
    };
  }

  if (url.startsWith("{")) {
    return JSON.parse(url);
  }

  console.error("Fallback url lookup for document :" + url);
  return documentLoader()(url);
};

async function checkIfCertificateValid(certificateData: CertificateData) {
  try {
    const publicKey = {
      "@context": jsigs.SECURITY_CONTEXT_URL,
      id: "did:india",
      type: "RsaVerificationKey2018",
      controller: "https://cowin.gov.in/",
      publicKeyPem: config.certificatePublicKey,
    };

    const controller = {
      "@context": jsigs.SECURITY_CONTEXT_URL,
      id: "https://cowin.gov.in/",
      publicKey: [publicKey],
      // this authorizes this key to be used for making assertions
      assertionMethod: [publicKey.id],
    };

    const key = new RSAKeyPair({ ...publicKey });
    const { AssertionProofPurpose } = jsigs.purposes;
    const { RsaSignature2018 } = jsigs.suites;
    const result = await jsigs.verify(certificateData, {
      suite: new RsaSignature2018({ key }),
      purpose: new AssertionProofPurpose({ controller }),
      documentLoader: customLoader,
      compactProof: false,
    });

    if (!result.verified) return false;

    return true;
  } catch (e) {
    console.error("Invalid data", e);
    return false;
  }
}

async function checkIfCertificateRevoked(certificateData: CertificateData) {
  try {
    const res = await fetch("/divoc/api/v1/certificate/revoked", {
      method: "POST",
      body: JSON.stringify(certificateData),
    });

    if (res.status === 200) return true;

    return false;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to validate certificate!");
  }
}

export async function verifyCertificate(certificateData: CertificateData) {
  const isValid = await checkIfCertificateValid(certificateData);
  if (!isValid) return false;

  const isRevoked = await checkIfCertificateRevoked(certificateData);
  if (isRevoked) return false;

  return true;
}
