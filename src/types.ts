import { z } from "../deps.ts";

export const unitsSchema = z.enum(["standard", "metric", "imperial"]);
/**
 * Units of measurement. standard, metric and imperial units are available.
 * If you do not use the units parameter, standard units will be applied by default.
 */
export type Units = z.infer<typeof unitsSchema>;

export const coordinatesSchema = z.object({
  lon: z.number(),
  lat: z.number(),
});
/**
 * Geographical coordinates (latitude, longitude).
 * If you need the geocoder to automatic convert city names and zip-codes to geo coordinates and the other way around,
 * please use our Geocoding API.
 */
export type Coordinates = z.infer<typeof coordinatesSchema>;

/**
 * You can use this parameter to get the output in your language.
 */
export enum Lang {
  AFRIKAANS = "af",
  ALBANIAN = "al",
  ARABIC = "ar",
  AZERBAIJANI = "az",
  BULGARIAN = "bg",
  CATALAN = "ca",
  CZECH = "cz",
  DANISH = "da",
  GERMAN = "de",
  GREEK = "el",
  ENGLISH = "en",
  BASQUE = "eu",
  PERSIAN_FARSI = "fa",
  FINNISH = "fi",
  FRENCH = "fr",
  GALICIAN = "gl",
  HEBREW = "he",
  HINDI = "hi",
  CROATIAN = "hr",
  HUNGARIAN = "hu",
  INDONESIAN = "id",
  ITALIAN = "it",
  JAPANESE = "ja",
  KOREAN = "kr",
  LATVIAN = "la",
  LITHUANIAN = "lt",
  MACEDONIAN = "mk",
  NORWEGIAN = "no",
  DUTCH = "nl",
  PORTUGUESE = "pt",
  PORTUGUESE_BRASIL = "pt_br",
  ROMANIAN = "ro",
  RUSSIAN = "ru",
  SWEDISH_1 = "sv",
  SWEDISH_2 = "se",
  SLOVAK = "sk",
  SLOVENIAN = "sl",
  SPANISH_1 = "sp",
  SPANISH_2 = "es",
  SERBIAN = "sr",
  THAI = "th",
  TURKISH = "tr",
  UKRANIAN_1 = "ua",
  UKRANIAN_2 = "uk",
  VIETNAMESE = "vi",
  CHINESE_SIMPLIFIED = "zh_cn",
  CHINESE_TRADITIONAL = "zh_tw",
  ZULU = "zu",
}
export const langSchema = z.nativeEnum(Lang);

export const currentWeatherSchema = z.object({
  coord: coordinatesSchema,
  weather: z.array(z.object({
    id: z.number(),
    main: z.string(),
    description: z.string(),
    icon: z.string(),
  })),
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
    type: z.number().optional(),
    id: z.number().optional(),
    message: z.string().optional(),
    country: z.string(),
    sunrise: z.number(),
    sunset: z.number(),
  }),
  timezone: z.number(),
  id: z.number(),
  name: z.string(),
  cod: z.number().optional(),
});
export type CurrentWeather = z.infer<typeof currentWeatherSchema>;

export const localNamesSchema = z
  .record(z.string())
  .and(z.object({
    ascii: z.string().optional(),
    feature_name: z.string().optional(),
  }));
export type LocalNames = z.infer<typeof localNamesSchema>;

export const coordinatesByLocationNameSchema = z.object({
  name: z.string(),
  local_names: localNamesSchema.optional(),
  lat: z.number(),
  lon: z.number(),
  country: z.string(),
  state: z.string().optional(),
});
export type CoordinatesByLocationName = z.infer<
  typeof coordinatesByLocationNameSchema
>;
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
export type CoordinatesByZipOrPostCode = z.infer<
  typeof coordinatesByZipOrPostCodeSchema
>;

export const locationNameByCoordinatesSchema = z.object({
  name: z.string(),
  local_names: localNamesSchema,
  lat: z.number(),
  lon: z.number(),
  country: z.string(),
  state: z.string().optional(),
});
export type LocationNameByCoordinates = z.infer<
  typeof locationNameByCoordinatesSchema
>;
export const arrayLocationNameByCoordinates = z.array(
  locationNameByCoordinatesSchema,
);
