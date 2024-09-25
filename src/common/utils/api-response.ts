export class ApiResponse {
  static success<T>({
    data,
    message = 'Operation successful',
    customCode = 'SUCCESS_OPERATION',
    originUrl,
  }: {
    data: T;
    message?: string;
    customCode?: string;
    originUrl: string;
  }) {
    return this.Response({
      data,
      message,
      customCode,
      statusCode: 200,
      originUrl,
    });
  }

  static create<T>({
    data,
    message = 'Resource Created',
    customCode = 'SUCCESS_RESOURCE_CREATED',
    originUrl,
  }: {
    data: T;
    message?: string;
    customCode?: string;
    originUrl: string;
  }) {
    return this.Response({
      data,
      message,
      customCode,
      statusCode: 201,
      originUrl,
    });
  }

  private static Response<T>({
    data,
    message,
    customCode,
    statusCode,
    originUrl,
  }: {
    data: T;
    message: string;
    customCode: string;
    statusCode: number;
    originUrl: string;
  }) {
    return {
      status: 'success',
      statusCode,
      code: customCode,
      message,
      data,
      eventTime: new Date().toISOString(),
      path: originUrl,
    };
  }
}
