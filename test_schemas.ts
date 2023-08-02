import { z } from "./deps.ts";
import { Lang } from "./src/types.ts";

// These schemas MUST match the types in ./src/types.ts, or vice-versa

export const unitsSchema = z.enum(["standard", "metric", "imperial"]);

export const coordinatesSchema = z.object({
  lon: z.number(),
  lat: z.number(),
});

export const langSchema = z.nativeEnum(Lang);

export const currentWeatherSchema = z.object({
  coord: coordinatesSchema,
  weather: z.array(z.object({
    id: z.number(),
    main: z.string(),
    description: z.string(),
    icon: z.string(),
  })),
  /** Internal parameter */
  base: z.string(),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    pressure: z.number(),
    humidity: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    sea_level: z.number().optional(),
    grnd_level: z.number().optional(),
  }),
  visibility: z.number(),
  wind: z.object({
    speed: z.number(),
    deg: z.number(),
    gust: z.number().optional(),
  }),
  clouds: z.object({
    all: z.number(),
  }),
  rain: z.object({
    "1h": z.number().optional(),
    "3h": z.number().optional(),
  }).optional(),
  snow: z.object({
    "1h": z.number().optional(),
    "3h": z.number().optional(),
  }).optional(),
  dt: z.number(),
  sys: z.object({
    /** Internal parameter */
    type: z.number().optional(),
    /** Internal parameter */
    id: z.number().optional(),
    /** Internal parameter */
    message: z.number().optional(),
    country: z.string(),
    sunrise: z.number(),
    sunset: z.number(),
  }),
  timezone: z.number(),
  /**
   * City ID.
   *
   * Please note that built-in geocoder functionality has been deprecated.
   * Learn more {@link https://openweathermap.org/current#builtin | here}.
   */
  id: z.number(),
  /**
   * City name.
   *
   * Please note that built-in geocoder functionality has been deprecated.
   * Learn more {@link https://openweathermap.org/current#builtin | here}.
   */
  name: z.string(),
  /**
   * Internal parameter
   */
  cod: z.number().optional(),
});

export const localNamesSchema = z
  .record(z.string())
  .and(z.object({
    ascii: z.string().optional(),
    feature_name: z.string().optional(),
  }));

export const coordinatesByLocationNameSchema = z.object({
  name: z.string(),
  local_names: localNamesSchema.optional(),
  lat: z.number(),
  lon: z.number(),
  country: z.string(),
  state: z.string().optional(),
});
export const arrayCoordinatesByLocationNameSchema = z.array(
  coordinatesByLocationNameSchema,
);

export const coordinatesByZipOrPostCodeSchema = z.object({
  zip: z.string(),
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
  country: z.string(),
});

export const locationNameByCoordinatesSchema = z.object({
  name: z.string(),
  local_names: localNamesSchema,
  lat: z.number(),
  lon: z.number(),
  country: z.string(),
  state: z.string().optional(),
});
export const arrayLocationNameByCoordinatesSchema = z.array(
  locationNameByCoordinatesSchema,
);

export const forecast5days3hoursSchema = z.object({
  cod: z.string().optional(),
  message: z.any().optional(),
  cnt: z.number(),
  list: z.array(z.object({
    dt: z.number(),
    main: z.object({
      temp: z.number(),
      feels_like: z.number(),
      temp_min: z.number(),
      temp_max: z.number(),
      pressure: z.number(),
      sea_level: z.number().optional(),
      grnd_level: z.number().optional(),
      humidity: z.number(),
      temp_kf: z.number().optional(),
    }),
    weather: z.array(z.object({
      id: z.number(),
      main: z.string(),
      description: z.string(),
      icon: z.string(),
    })),
    clouds: z.object({
      all: z.number(),
    }),
    wind: z.object({
      speed: z.number(),
      deg: z.number(),
      gust: z.number().optional(),
    }),
    visibility: z.number(),
    /**
     * Probability of precipitation.
     *
     * The values of the parameter vary between 0 and 1, where 0 is equal to 0%, 1 is equal to 100%
     */
    pop: z.number(),
    rain: z.object({
      "3h": z.number(),
    }).optional(),
    snow: z.object({
      "3h": z.number(),
    }).optional(),
    sys: z.object({
      /**
       * Part of the day (n - night, d - day)
       */
      pop: z.string().optional(),
    }).optional(),
    dt_txt: z.string(),
  })),
  city: z.object({
    /**
     * City ID.
     *
     * Please note that built-in geocoder functionality has been deprecated.
     * Learn more {@link https://openweathermap.org/forecast5#builtin | here}.
     */
    id: z.number(),
    /**
     * City name.
     *
     * Please note that built-in geocoder functionality has been deprecated.
     * Learn more {@link https://openweathermap.org/forecast5#builtin | here}.
     */
    name: z.string(),
    coord: coordinatesSchema,
    /**
     * Country code (GB, JP etc.).
     *
     * Please note that built-in geocoder functionality has been deprecated.
     * Learn more {@link https://openweathermap.org/forecast5#builtin | here}.
     */
    country: z.string(),
    population: z.number(),
    timezone: z.number(),
    sunrise: z.number(),
    sunset: z.number(),
  }),
});
