// declare class HttpError extends Error {
//   private status;
//   private readonly internalPayload?;
//   private readonly originalError?;
//   constructor(status: number, message: string, internalPayload?: any, originalError?: Error);
//   getStatus(): number;
//   getInternalPayload(): any;
//   getOriginalError(): Error | undefined;
// }
export class HttpError extends Error {
  constructor(
    private status: number,
    message: string,
    private readonly internalPayload?: any,
    private readonly originalError?: Error
  ) {
    super(message)
  }

  getStatus(): number {
    return this.status
  }

  getInternalPayload(): any {
    return this.internalPayload
  }

  getOriginalError(): Error | undefined {
    return this.originalError
  }
}
