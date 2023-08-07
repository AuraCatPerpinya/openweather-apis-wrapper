import { OpenWeatherError } from "./customError.ts";
import { Coordinates, Lang } from "./types.ts";
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

    if ("apiUrl" in options! && typeof options.apiUrl !== "string") {
      throw new OpenWeatherError(
        "Invalid optional 'options.apiUrl' parameter. Must be a string",
      );
    }

    if ("defaults" in options!) {
      if (
        typeof options.defaults !== "object" || Array.isArray(options.defaults)
      ) {
        throw new OpenWeatherError(
          "Invalid optional 'options.defaults' parameter. Must be an object",
        );
      }
      this.validateUnits(
        // deno-lint-ignore no-explicit-any
        (options.defaults as any).units,
        "Invalid optional 'options.defaults.units' parameter. Must be 'standard', 'metric' or 'imperial'",
      );
      this.validateLang(
        // deno-lint-ignore no-explicit-any
        (options.defaults as any).lang,
        "Invalid optional 'options.defaults.lang' parameter. Must be a valid member of the Lang enum",
      );

      // deno-lint-ignore no-explicit-any
      if (!isNullOrUndefined((options.defaults as any).coordinates)) {
        this.validateCoordinates(
          // deno-lint-ignore no-explicit-any
          (options.defaults as any).coordinates,
          undefined,
          "Invalid optional 'options.defaults.coordinates' parameter. Must be an object with 'lat' and 'lon' properties as numbers",
        );
      }
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
  validateCoordinates(
    coordinates: unknown,
    default_?: Coordinates,
    message?: string,
  ): void | never {
    if (isNullOrUndefined(coordinates) && !default_) {
      throw new OpenWeatherError(
        "'coordinates' parameter wasn't provided and no default has been set",
      );
    } else if (
      !isNullOrUndefined(coordinates) && (typeof coordinates !== "object" ||
        (
          (!("lat" in coordinates!) || typeof coordinates.lat !== "number") ||
          (!("lon" in coordinates!) || typeof coordinates.lon !== "number")
        ))
    ) {
      throw new OpenWeatherError(
        message ??
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
  validateLang(lang: unknown, message?: string): void | never {
    if (
      (!isNullOrUndefined(lang) && (typeof lang !== "string" ||
        !langValues.includes(lang as Lang)))
    ) {
      throw new OpenWeatherError(
        message ??
          "Invalid optional 'lang' parameter. Must be a valid member of the Lang enum",
      );
    }
  },
  /** Validate units parameter */
  validateUnits(units: unknown, message?: string): void | never {
    if (
      !isNullOrUndefined(units) && typeof units === "string" &&
      !(["standard", "metric", "imperial"].includes(units))
    ) {
      throw new OpenWeatherError(
        message ??
          "Invalid optional 'units' parameter. Must be 'standard', 'metric' or 'imperial'",
      );
    }
  },
};
