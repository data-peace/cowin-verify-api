export class CertificateValidationError extends Error {
    constructor(message?: string) {
      super(message);
      this.name = "CertificateValidationError"; 
      Object.setPrototypeOf(this, CertificateValidationError.prototype);
    }
  }
