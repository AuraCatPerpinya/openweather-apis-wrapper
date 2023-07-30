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

export class OpenWeatherClient {
  baseAPIUrl = "https://api.openweathermap.org";
  apiKey: string;

  constructor(options: OpenWeatherClientOptions) {
    const { apiKey } = openWeatherClientOptionsSchema.parse(options);
    this.apiKey = apiKey;
  }

  async getCoordinatesByLocationName(
    query: string,
    limit?: number,
  ): Promise<CoordinatesByLocationName[]> {
    return await this.sendRequest(
      APIS.GEO,
      ENDPOINTS.DIRECT_GEOCODING.BY_LOCATION_NAME(query, limit),
    ) as CoordinatesByLocationName[];
  }

  async getCoordinatesByZipOrPostCode(
    zipCode: string,
  ): Promise<CoordinatesByZipOrPostCode> {
    return await this.sendRequest(
      APIS.GEO,
      ENDPOINTS.DIRECT_GEOCODING.BY_ZIP_OR_POST_CODE(zipCode),
    ) as CoordinatesByZipOrPostCode;
  }

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
