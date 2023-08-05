import { OpenWeatherError } from "./customError.ts";
import { Lang } from "./types.ts";
import { isNullOrUndefined } from "./utils.ts";

/** @private */
const langValues = Object.values(Lang);

/** @private */
export const parameterValidation = {
  /** Validate client options */
  validateClientOptions(options: unknown): void | never {
    if (typeof options !== "object" || Array.isArray(options)) {
      throw new OpenWeatherError(
        "Invalid 'options' parameter. Is required and must be an object",
      );
    }

    if (
      !("apiKey" in options!) ||
      typeof options.apiKey !== "string"
    ) {
      throw new OpenWeatherError(
        "Invalid 'options.apiKey' parameter. Is required and must be a string",
      );
    }
  },
  /** Validate query parameter */
  validateQuery(query: unknown): void | never {
    if (typeof query !== "string") {
      throw new OpenWeatherError(
        "Invalid 'query' parameter. Must be a string",
      );
    }
  },
  /** Validate zip code parameter */
  validateZipCode(zipCode: unknown): void | never {
    if (typeof zipCode !== "string") {
      throw new OpenWeatherError(
        "Invalid 'zipCode' parameter. Must be a string",
      );
    }
  },
  /** Validate cooordinates parameter */
  validateCoordinates(coordinates: unknown): void | never {
    if (
      typeof coordinates !== "object" || isNullOrUndefined(coordinates) ||
      (
        (!("lat" in coordinates!) || typeof coordinates.lat !== "number") ||
        (!("lon" in coordinates!) || typeof coordinates.lon !== "number")
      )
    ) {
      throw new OpenWeatherError(
        "Invalid 'coordinates' parameter. Must be an object with 'lat' and 'lon' properties as numbers",
      );
    }
  },
  /** Validate limit parameter */
  validateLimit(limit: unknown): void | never {
    if (
      !isNullOrUndefined(limit) && (typeof limit !== "number" ||
        (!Number.isInteger(limit) || limit < 0 ||
          limit > 5))
    ) {
      throw new OpenWeatherError(
        "Invalid optional 'limit' parameter. Must be an integer between 0 and 5",
      );
    }
  },
  /** Validate cnt parameter */
  validateCnt(cnt: unknown): void | never {
    if (!isNullOrUndefined(cnt) && typeof cnt !== "number") {
      throw new OpenWeatherError(
        "Invalid optional 'cnt' parameter. Must be a number",
      );
    }
  },
  /** Validate lang parameter */
  validateLang(lang: unknown): void | never {
    if (
      (!isNullOrUndefined(lang) && typeof lang !== "string") ||
      !langValues.includes(lang as Lang)
    ) {
      throw new OpenWeatherError(
        "Invalid optional 'lang' parameter. Must be a valid member of the Lang enum",
      );
    }
  },
  /** Validate units parameter */
  validateUnits(units: unknown): void | never {
    if (
      !isNullOrUndefined(units) && typeof units === "string" &&
      !(["standard", "metric", "imperial"].includes(units))
    ) {
      throw new OpenWeatherError(
        "Invalid optional 'units' parameter. Must be 'standard', 'metric' or 'imperial'",
      );
    }
  },
};
