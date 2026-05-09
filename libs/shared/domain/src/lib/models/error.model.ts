export interface ApplicationError {
  message: string;
  statusCode?: number;
  validationErrors?: Record<string, string[]>;
}
