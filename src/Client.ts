import { APIS } from "./apis.ts";
import { CacheHandler, CacheHandlerOptions } from "./cache/cache.ts";
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
import { isNullOrUndefined } from "./utils.ts";

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
  /** The options that will be passed to the cache handler */
  cacheHandlerOptions?: CacheHandlerOptions;
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

  cacheHandler: CacheHandler;

  /**
   * OpenWeather APIs wrapper client.
   * @see {@link https://api.openweathermap.org}
   * @param {OpenWeatherClientOptions} options - Options used to instantiate the client.
   * @param {string} options.apiKey - Your OpenWeather API key.
   * @param {string} [options.apiUrl] - (optional) Custom url to use for sending requests to the API.
   */
  constructor(options: OpenWeatherClientOptions) {
    parameterValidation.validateClientOptions(options);

    const { apiKey, apiUrl, defaults, cacheHandlerOptions } = options;

    this.apiKey = apiKey;
    if (apiUrl) this.apiUrl = apiUrl;
    if (defaults) {
      if (defaults.units) this.defaults.units = defaults.units;
      if (defaults.lang) this.defaults.lang = defaults.lang;
      if (defaults.coordinates) {
        this.defaults.coordinates = defaults.coordinates;
      }
    }

    this.cacheHandler = new CacheHandler(cacheHandlerOptions);
  }

  /**
   * Set the default units to use in certain methods.
   *
   * Set to undefined or null if you want to remove the default units.
   *
   * @param {Units} [units] - (optional) "standard", "metric" or "imperial". The default units to use in certain methods.
   * @returns this
   */
  setDefaultUnits(units?: Units): this {
    parameterValidation.validateUnits(units);
    this.defaults.units = units;
    return this;
  }

  /**
   * Set the default language to use in certain methods.
   *
   * Set to undefined or null if you want to remove the default language.
   *
   * @param  {Lang} [lang] - (optional)
   * @returns this
   */
  setDefaultLang(lang?: Lang): this {
    parameterValidation.validateLang(lang);
    this.defaults.lang = lang;
    return this;
  }

  /**
   * Set the default coordinates to use in certain methods.
   *
   * Set to undefined or null if you want to remove the default coordinates.
   *
   * @param {Coordinates} [coordinates] - (optional)
   * @returns this
   */
  setDefaultCoordinates(coordinates?: Coordinates): this {
    if (!isNullOrUndefined(coordinates)) {
      parameterValidation.validateCoordinates(coordinates);
    }
    this.defaults.coordinates = coordinates;
    return this;
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

    let data = await this.cacheHandler.coordinatesByLocationName?.get(query);
    if (!data) {
      data = await this.sendRequest(
        APIS.GEO,
        ENDPOINTS.DIRECT_GEOCODING.BY_LOCATION_NAME(query, limit),
      ) as CoordinatesByLocationName[];
      await this.cacheHandler.coordinatesByLocationName?.set(query, data);
    }

    return data;
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

    let data = await this.cacheHandler.coordinatesByZipOrPostCode?.get(zipCode);
    if (!data) {
      data = await this.sendRequest(
        APIS.GEO,
        ENDPOINTS.DIRECT_GEOCODING.BY_ZIP_OR_POST_CODE(zipCode),
      ) as CoordinatesByZipOrPostCode;
      await this.cacheHandler.coordinatesByZipOrPostCode?.set(zipCode, data);
    }

    return data;
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
    if (!coordinates) coordinates = this.defaults.coordinates!;

    const key = `${coordinates.lat}.${coordinates.lon}`;
    let data = await this.cacheHandler.locationNameByCoordinates?.get(
      key,
    );
    if (!data) {
      data = await this.sendRequest(
        APIS.GEO,
        ENDPOINTS.REVERSE_GEOCODING(
          coordinates,
          limit,
        ),
      ) as LocationNameByCoordinates[];
      await this.cacheHandler.locationNameByCoordinates?.set(key, data);
    }
    return data;
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
    if (!coordinates) coordinates = this.defaults.coordinates!;

    const key = `${coordinates.lat}.${coordinates.lon}`;
    let data = await this.cacheHandler.currentWeather?.get(key);
    if (!data) {
      data = await this.sendRequest(
        APIS.DATA,
        ENDPOINTS.CURRENT_WEATHER(
          coordinates ?? this.defaults.coordinates!,
          units ?? this.defaults.units,
          lang ?? this.defaults.lang,
        ),
      ) as CurrentWeather;
      await this.cacheHandler.currentWeather?.set(key, data);
    }
    return data;
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
   * @param {Lang} [lang] - (optional) You can use this parameter to get the output in your language.
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
    if (!coordinates) coordinates = this.defaults.coordinates!;

    const key = `${coordinates.lat}.${coordinates.lon}`;
    let data = await this.cacheHandler.forecast5days3hours?.get(key);
    if (!data) {
      data = await this.sendRequest(
        APIS.DATA,
        ENDPOINTS.FORECAST["5DAY3HOUR"](
          coordinates ?? this.defaults.coordinates!,
          cnt,
          units ?? this.defaults.units,
          lang ?? this.defaults.lang,
        ),
      ) as Forecast5days3hours;
      await this.cacheHandler.forecast5days3hours?.set(key, data);
    }

    return data;
  }

  /**
   * Use it only if really needed.
   *
   * Check first if there is not already a method that suits your needs.
   *
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
