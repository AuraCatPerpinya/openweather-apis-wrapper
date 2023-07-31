import { z } from "../deps.ts";
import { APIS } from "./apis.ts";
import { ENDPOINTS } from "./endpoints.ts";
import {
  Coordinates,
  CoordinatesByLocationName,
  CoordinatesByZipOrPostCode,
  CurrentWeather,
  Forecast5days3hours,
  Lang,
  LocationNameByCoordinates,
  Units,
} from "./types.ts";

export const openWeatherClientOptionsSchema = z.object({
  apiKey: z.string(),
});
export type OpenWeatherClientOptions = z.infer<
  typeof openWeatherClientOptionsSchema
>;

/**
 * OpenWeather APIs wrapper client.
 */
export class OpenWeatherClient {
  baseAPIUrl = "https://api.openweathermap.org";
  /** Your OpenWeather API key. */
  apiKey: string;

  /**
   * OpenWeather APIs wrapper client.
   * @param {OpenWeatherClientOptions} options - Options used to instantiate the client.
   * @param {string} options.apiKey - Your OpenWeather API key.
   */
  constructor(options: OpenWeatherClientOptions) {
    const { apiKey } = openWeatherClientOptionsSchema.parse(options);
    this.apiKey = apiKey;
  }

  /**
   * Gives you the coordinates of a location by its name.
   *
   * @param {string} query - City name, state code (only for the US) and country code divided by comma.
   * Please use ISO 3166 country codes.
   * @param {number} [limit] - (optional) Number of the locations in the API response (up to 5 results can be returned in the API response)
   * @returns Promise<{@link CoordinatesByLocationName}[]>
   */
  async getCoordinatesByLocationName(
    query: string,
    limit?: number,
  ): Promise<CoordinatesByLocationName[]> {
    return await this.sendRequest(
      APIS.GEO,
      ENDPOINTS.DIRECT_GEOCODING.BY_LOCATION_NAME(query, limit),
    ) as CoordinatesByLocationName[];
  }

  /**
   * Gives you the coordinates of a place by its zip or post code.
   *
   * @param {string} zipCode - Zip/post code and country code divided by comma.
   * Please use ISO 3166 country codes.
   * @returns Promise<{@link CoordinatesByZipOrPostCode}>
   */
  async getCoordinatesByZipOrPostCode(
    zipCode: string,
  ): Promise<CoordinatesByZipOrPostCode> {
    return await this.sendRequest(
      APIS.GEO,
      ENDPOINTS.DIRECT_GEOCODING.BY_ZIP_OR_POST_CODE(zipCode),
    ) as CoordinatesByZipOrPostCode;
  }

  /**
   * @param {Coordinates} coordinates - Geographical coordinates (latitude, longitude).
   * Use {@link OpenWeatherClient#getCoordinatesByLocationName()} or {@link OpenWeatherClient#getCoordinatesByZipOrPostCode()} to get the coordinates of a place.
   * @param {number} [limit] - (optional) Number of the locations in the API response (up to 5 results can be returned in the API response)
   * @returns
   */
  async getLocationNameByCoordinates(
    coordinates: Coordinates,
    limit?: number,
  ): Promise<LocationNameByCoordinates[]> {
    return await this.sendRequest(
      APIS.GEO,
      ENDPOINTS.REVERSE_GEOCODING(coordinates, limit),
    ) as LocationNameByCoordinates[];
  }

  /**
   * Gives you the current weather data for the given coordinates.
   *
   * @param {Coordinates} coordinates - Geographical coordinates (latitude, longitude).
   * Use {@link OpenWeatherClient#getCoordinatesByLocationName()} or {@link OpenWeatherClient#getCoordinatesByZipOrPostCode()} to get the coordinates of a place.
   * @param {Units} [units] - (optional) Units of measurement. standard, metric and imperial units are available.
   * If you do not use the units parameter, standard units will be applied by default.
   * @param {Lang} [lang] - (optional) You can use this parameter to get the output in your language.
   * @returns Promise<{@link CurrentWeather}>
   */
  async getCurrentWeather(
    coordinates: Coordinates,
    units?: Units,
    lang?: Lang,
  ): Promise<CurrentWeather> {
    return await this.sendRequest(
      APIS.DATA,
      ENDPOINTS.CURRENT_WEATHER(coordinates, units, lang),
    ) as CurrentWeather;
  }

  /**
   * @param {Coordinates} coordinates - Geographical coordinates (latitude, longitude).
   * Use {@link OpenWeatherClient#getCoordinatesByLocationName()} or {@link OpenWeatherClient#getCoordinatesByZipOrPostCode()} to get the coordinates of a place.
   * @param {Units} [units] - (optional) Units of measurement. standard, metric and imperial units are available.
   * If you do not use the units parameter, standard units will be applied by default.
   * @param {number} [cnt] - (optional) A number of timestamps, which will be returned in the API response.
   * {@link https://openweathermap.org/forecast5#limit | Learn more}
   * @param {Lang} [lang] - You can use this parameter to get the output in your language.
   * @returns Promise<{@link Forecast5days3hours}>
   */
  async getForecast5days3hours(
    coordinates: Coordinates,
    cnt?: number,
    units?: Units,
    lang?: Lang,
  ): Promise<Forecast5days3hours> {
    return await this.sendRequest(
      APIS.DATA,
      ENDPOINTS.FORECAST["5DAY3HOUR"](coordinates, cnt, units, lang),
    ) as Forecast5days3hours;
  }

  /**
   * @private
   * @param {APIS} api
   * @param {string} endpoint
   * @returns Promise<unknown> - A promise that resolves with the API response.
   */
  async sendRequest(api: APIS, endpoint: string): Promise<unknown> {
    const data = await fetch(
      `${this.baseAPIUrl}/${api}/${endpoint}&appid=${this.apiKey}`,
    );
    if (data.ok) {
      return await data.json();
    } else {
      throw new Error(`${data.status} - ${data.statusText}`);
    }
  }
}
