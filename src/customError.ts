export class OpenWeatherError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    Error.captureStackTrace(this, OpenWeatherError);
  }
}
