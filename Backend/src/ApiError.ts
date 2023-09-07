class ApiError extends Error {
  private readonly errorCode: number;

  constructor(message: string, httpErrorCode: number) {
    super(message);
    this.errorCode = httpErrorCode;
  }

  getErrorCode() {
    return this.errorCode;
  }
}

export default ApiError;
