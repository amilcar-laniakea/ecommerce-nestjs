export class ApiResponse {
  static success({
    data,
    message = 'Operation successful',
    customCode = 'SUCCESS_OPERATION',
    originUrl,
  }: {
    data: any;
    message?: string;
    customCode?: string;
    originUrl: string;
  }) {
    return {
      status: 'success',
      statusCode: 200,
      code: customCode,
      message,
      data,
      eventTime: new Date().toISOString(),
      path: originUrl,
    };
  }
}
