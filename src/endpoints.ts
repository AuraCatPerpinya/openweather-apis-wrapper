import { Coordinates, Lang, Units } from "./types.ts";
import { isNullOrUndefined } from "./utils.ts";

export const ENDPOINTS = {
  DIRECT_GEOCODING: {
    /**
     * @param {string} q - City name, state code (only for the US) and country code divided by comma.
     * Please use ISO 3166 country codes.
     * @param {number} [limit] - (optional) Number of the locations in the API response (up to 5 results can be returned in the API response)
     * @returns string
     */
    BY_LOCATION_NAME: (q: string, limit?: number) =>
      `direct?q=${q}${!(isNullOrUndefined(limit)) ? `&limit=${limit}` : ""}`,
    /**
     * @param {string} zip_code - Zip/post code and country code divided by comma.
     * Please use ISO 3166 country codes.
     * @returns string
     */
    BY_ZIP_OR_POST_CODE: (zip_code: string) => `zip?zip=${zip_code}`,
  },

  /**
   * @param {Coordinates} coordinates - Geographical coordinates (latitude, longitude).
   * If you need the geocoder to automatic convert city names and zip-codes to geo coordinates and the other way around,
   * please use our Geocoding API.
   * @param {number} [limit] - (optional) Number of the locations in the API response (up to 5 results can be returned in the API response)
   * @returns
   */
  REVERSE_GEOCODING: (coordinates: Coordinates, limit?: number) =>
    `reverse?lat=${coordinates.lat}&lon=${coordinates.lon}${
      !(isNullOrUndefined(limit)) ? `&limit=${limit}` : ""
    }`,

  /**
   * @param {Coordinates} coordinates - Geographical coordinates (latitude, longitude).
   * Use {@link OpenWeatherClient#getCoordinatesByLocationName()} or {@link OpenWeatherClient#getCoordinatesByZipOrPostCode()} to get the coordinates of a place.
   * @param {Units} units - Units of measurement. standard, metric and imperial units are available.
   * If you do not use the units parameter, standard units will be applied by default.
   * @param {Lang} lang - You can use this parameter to get the output in your language.
   * @returns string
   */
  CURRENT_WEATHER: (
    coordinates: Coordinates,
    units?: Units,
    lang?: Lang,
  ) =>
    `weather?lat=${coordinates.lat}&lon=${coordinates.lon}${
      units ? `&units=${units}` : ""
    }${lang ? `&lang=${lang}` : ""}`,

  FORECAST: {
    /**
     * @param {Coordinates} coordinates - Geographical coordinates (latitude, longitude).
     * Use {@link OpenWeatherClient#getCoordinatesByLocationName()} or {@link OpenWeatherClient#getCoordinatesByZipOrPostCode()} to get the coordinates of a place.
     * @param {Units} [units] - (optional) Units of measurement. standard, metric and imperial units are available.
     * If you do not use the units parameter, standard units will be applied by default.
     * @param {number} [cnt] - (optional) A number of timestamps, which will be returned in the API response.
     * {@link https://openweathermap.org/forecast5#limit | Learn more}
     * @param {Lang} [lang] - (optional) You can use this parameter to get the output in your language.
     * @returns string
     */
    "5DAY3HOUR": (
      coordinates: Coordinates,
      cnt?: number,
      units?: Units,
      lang?: Lang,
    ) =>
      `forecast?lat=${coordinates.lat}&lon=${coordinates.lon}${
        units ? `&units=${units}` : ""
      }${!(isNullOrUndefined(cnt)) ? `&cnt=${cnt}` : ""}${
        lang ? `&lang=${lang}` : ""
      }`,
  },
};
