export class AppError extends Error {
  code: number
  constructor(message: string, code?: number) {
    super(message)
    this.name = AppError.STATUS_CODES[code || 400]
    this.code = code || 400
  }

  private static readonly STATUS_CODES: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    408: 'Request Timeout',
    409: 'Conflict',
  }
}
