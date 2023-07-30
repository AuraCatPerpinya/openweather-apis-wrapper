import { z } from "../deps.ts";
import { APIS } from "./apis.ts";
import { ENDPOINTS } from "./endpoints.ts";
import {
  Coordinates,
  CoordinatesByLocationName,
  CoordinatesByZipOrPostCode,
  CurrentWeather,
  Lang,
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
  apiKey: string;

  /**
   * @param {OpenWeatherClientOptions} options - Options used to instantiate the client.
   * @param {string} options.apiKey - Your OpenWeatherMap API key.
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
   * Gives you the current weather data for the given coordinates.
   *
   * @param {Coordinates} coordinates - Geographical coordinates (latitude, longitude).
   * If you need the geocoder to automatic convert city names and zip-codes to geo coordinates and the other way around,
   * please use our Geocoding API.
   * @param {Units} units - Units of measurement. standard, metric and imperial units are available.
   * If you do not use the units parameter, standard units will be applied by default.
   * @param {Lang} lang - You can use this parameter to get the output in your language.
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
   * @private
   * @param {APIS} api
   * @param endpoint
   * @returns Promise<unknown> - A promise that resolves with the API response.
   */
  async sendRequest(api: APIS, endpoint: string): Promise<unknown> {
    console.log(`${this.baseAPIUrl}/${api}/${endpoint}&appid=${this.apiKey}`);
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
