import { APIS } from "./apis.ts";
import { ENDPOINTS } from "./endpoints.ts";
import { parameterValidation } from "./paramValidation.ts";
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

export interface OpenWeatherClientOptions {
  /** Your OpenWeather API key. */
  apiKey: string;
  /** (optional) Custom url to use for sending requests to the API. */
  apiUrl?: string;
  defaults?: {
    /** (optional) "standard", "metric" or "imperial". The default units to use in certain methods. */
    units?: Units;
    /** (optional) The default language to use in certain methods. */
    lang?: Lang;
    /** (optional) The default coordinates to use in certain methods */
    coordinates?: Coordinates;
  };
}

/**
 * OpenWeather APIs wrapper client.
 * @see {@link https://api.openweathermap.org}
 */
export class OpenWeatherClient {
  /** The default url for the OpenWeather API. */
  static baseAPIUrl = "https://api.openweathermap.org";
  /**
   * The url to use for the OpenWeather API.
   *
   * By default it uses {@link OpenWeatherClient.baseAPIUrl} (https://api.openweathermap.org),
   * but you can customize it using {@link OpenWeatherClientOptions.apiUrl}
   */
  apiUrl = OpenWeatherClient.baseAPIUrl;
  /** Your OpenWeather API key. */
  apiKey: string;

  defaults: {
    /** (optional) "standard", "metric" or "imperial". The default units to use in certain methods. */
    units?: Units;
    /** (optional) The default language to use in certain methods. */
    lang?: Lang;
    /** (optional) The default coordinates to use in certain methods */
    coordinates?: Coordinates;
  } = {};

  /**
   * OpenWeather APIs wrapper client.
   * @see {@link https://api.openweathermap.org}
   * @param {OpenWeatherClientOptions} options - Options used to instantiate the client.
   * @param {string} options.apiKey - Your OpenWeather API key.
   * @param {string} [options.apiUrl] - (optional) Custom url to use for sending requests to the API.
   */
  constructor(options: OpenWeatherClientOptions) {
    parameterValidation.validateClientOptions(options);

    const { apiKey, apiUrl, defaults } = options;

    this.apiKey = apiKey;
    if (apiUrl) this.apiUrl = apiUrl;
    if (defaults) {
      if (defaults.units) this.defaults.units = defaults.units;
      if (defaults.lang) this.defaults.lang = defaults.lang;
      if (defaults.coordinates) {
        this.defaults.coordinates = defaults.coordinates;
      }
    }
  }

  /**
   * Gives you the coordinates of a location by its name.
   * @see {@link https://openweathermap.org/api/geocoding-api#direct_name}
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
    parameterValidation.validateQuery(query);
    parameterValidation.validateLimit(limit);

    return await this.sendRequest(
      APIS.GEO,
      ENDPOINTS.DIRECT_GEOCODING.BY_LOCATION_NAME(query, limit),
    ) as CoordinatesByLocationName[];
  }

  /**
   * Gives you the coordinates of a place by its zip or post code.
   * @see {@link https://openweathermap.org/api/geocoding-api#direct_zip}
   *
   * @param {string} zipCode - Zip/post code and country code divided by comma.
   * Please use ISO 3166 country codes.
   * @returns Promise<{@link CoordinatesByZipOrPostCode}>
   */
  async getCoordinatesByZipOrPostCode(
    zipCode: string,
  ): Promise<CoordinatesByZipOrPostCode> {
    parameterValidation.validateZipCode(zipCode);

    return await this.sendRequest(
      APIS.GEO,
      ENDPOINTS.DIRECT_GEOCODING.BY_ZIP_OR_POST_CODE(zipCode),
    ) as CoordinatesByZipOrPostCode;
  }

  /**
   * @see {@link https://openweathermap.org/api/geocoding-api#reverse}
   * @param {Coordinates} coordinates - Geographical coordinates (latitude, longitude).
   * (optional if {@link OpenWeatherClient.defaults.coordinates} is set)

   * Use {@link OpenWeatherClient.getCoordinatesByLocationName()} or {@link OpenWeatherClient.getCoordinatesByZipOrPostCode()} to get the coordinates of a place.
   * @param {number} [limit] - (optional) Number of the locations in the API response (up to 5 results can be returned in the API response)
   * @returns Promise<{@link LocationNameByCoordinates}[]>
   */
  async getLocationNameByCoordinates(
    coordinates?: Coordinates,
    limit?: number,
  ): Promise<LocationNameByCoordinates[]> {
    parameterValidation.validateCoordinates(
      coordinates,
      this.defaults.coordinates,
    );
    parameterValidation.validateLimit(limit);

    return await this.sendRequest(
      APIS.GEO,
      ENDPOINTS.REVERSE_GEOCODING(
        coordinates ?? this.defaults.coordinates!,
        limit,
      ),
    ) as LocationNameByCoordinates[];
  }

  /**
   * Gives you the current weather data for the given coordinates.
   *
   * @param {Coordinates} coordinates - Geographical coordinates (latitude, longitude).
   * (optional if {@link OpenWeatherClient.defaults.coordinates} is set)

   * Use {@link OpenWeatherClient.getCoordinatesByLocationName()} or {@link OpenWeatherClient.getCoordinatesByZipOrPostCode()} to get the coordinates of a place.
   * @param {Units} [units] - (optional) Units of measurement. standard, metric and imperial units are available.
   * If you do not use the units parameter, standard units will be applied by default.
   * @param {Lang} [lang] - (optional) You can use this parameter to get the output in your language.
   * @returns Promise<{@link CurrentWeather}>
   */
  async getCurrentWeather(
    coordinates?: Coordinates,
    units?: Units,
    lang?: Lang,
  ): Promise<CurrentWeather> {
    parameterValidation.validateCoordinates(
      coordinates,
      this.defaults.coordinates,
    );
    parameterValidation.validateUnits(units);
    parameterValidation.validateLang(lang);

    return await this.sendRequest(
      APIS.DATA,
      ENDPOINTS.CURRENT_WEATHER(
        coordinates ?? this.defaults.coordinates!,
        units ?? this.defaults.units,
        lang ?? this.defaults.lang,
      ),
    ) as CurrentWeather;
  }

  /**
   * @see {@link https://openweathermap.org/forecast5}
   * @param {Coordinates} coordinates - Geographical coordinates (latitude, longitude).
   * (optional if {@link OpenWeatherClient.defaults.coordinates} is set)

   * Use {@link OpenWeatherClient.getCoordinatesByLocationName()} or {@link OpenWeatherClient.getCoordinatesByZipOrPostCode()} to get the coordinates of a place.
   * @param {Units} [units] - (optional) Units of measurement. standard, metric and imperial units are available.
   * If you do not use the units parameter, standard units will be applied by default.
   * @param {number} [cnt] - (optional) A number of timestamps, which will be returned in the API response.
   * {@link https://openweathermap.org/forecast5#limit | Learn more}
   * @param {Lang} [lang] - You can use this parameter to get the output in your language.
   * @returns Promise<{@link Forecast5days3hours}>
   */
  async getForecast5days3hours(
    coordinates?: Coordinates,
    cnt?: number,
    units?: Units,
    lang?: Lang,
  ): Promise<Forecast5days3hours> {
    parameterValidation.validateCoordinates(
      coordinates,
      this.defaults.coordinates,
    );
    parameterValidation.validateCnt(cnt);
    parameterValidation.validateUnits(units);
    parameterValidation.validateLang(lang);

    return await this.sendRequest(
      APIS.DATA,
      ENDPOINTS.FORECAST["5DAY3HOUR"](
        coordinates ?? this.defaults.coordinates!,
        cnt,
        units ?? this.defaults.units,
        lang ?? this.defaults.lang,
      ),
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
      `${this.apiUrl}/${api}/${endpoint}&appid=${this.apiKey}`,
    );
    if (data.ok) {
      return await data.json();
    } else {
      throw new Error(`${data.status} - ${data.statusText}`);
    }
  }
}
