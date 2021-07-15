import type { CertificateData } from "../verifyCertificate/CertificateData";

export function getInfoFromCertificateData(certificateData: CertificateData){
    return {
        "userRefId": certificateData.credentialSubject.refId,
        "name": certificateData.credentialSubject.name,
        "gender": certificateData.credentialSubject.gender,
        "age": certificateData.credentialSubject.age,
        "nationality": certificateData.credentialSubject.nationality,
        "vaccineDosesGiven": certificateData.evidence.length,
        "vaccineTotalDosesNeeded": certificateData.evidence[0].totalDoses,
    };
}
