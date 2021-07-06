export interface CertificateData {
  "@context": string[];
  type: string[];
  credentialSubject: {
    type: string;
    /** did:Aadhaar Card:********1018 */
    id: string;
    /** 80142731910030 */
    refId: string;
    name: string;
    uhid: string;
    gender: string;
    age: string;
    nationality: string;
    address: {
      addressCountry: string;
      postalCode: number;
    };
  };
  issuer: string;
  /** 2021-05-19T08:17:26.399Z */
  issuanceDate: string;
  evidence: [
    {
      id: string;
      feedbackUrl: string;
      infoUrl: string;
      /** 61950213102 */
      certificateId: string;
      /** [ Vaccination ] */
      type: string[];
      /** 3910Z062 */
      batch: string;
      /** COVISHIELD */
      vaccine: string;
      /** Serum Institute of India */
      manufacturer: string;
      /** 2021-05-19T08:17:24.453Z */
      date: string;
      /** 2021-05-19 */
      effectiveStart: string;
      /** 2021-05-19 */
      effectiveUntil: string;
      /** 1 */
      dose: number;
      /** 2 */
      totalDoses: number;
      verifier: {
        /** LINI */
        name: string;
      };
      facility: {
        /** Indraprastha Apollo Site 3 */
        name: string;
        address: {
          /** Indraprastha Apollo Hospital, Mathura Rd, New Delhi, Delhi */
          streetAddress: string;
          streetAddress2: string;
          /** South East Delhi */
          district: string;
          city: string;
          /** DELHI */
          addressRegion: string;
          /** IN */
          addressCountry: string;
          postalCode: string;
        };
      };
    }
  ];
  /** true */
  nonTransferable: string;
  proof: {
    /** RsaSignature2018 */
    type: string;
    /** 2021-05-19T08:17:26Z */
    created: string;
    /** did:india */
    verificationMethod: string;
    /** assertionMethod */
    proofPurpose: string;
    jws: string;
  };
}
