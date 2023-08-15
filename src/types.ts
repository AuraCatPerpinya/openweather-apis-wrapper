/**
 * Units of measurement. standard, metric and imperial units are available.

 * If you do not use the units parameter, standard units will be applied by default.
 */
export type Units = "standard" | "metric" | "imperial";
/**
 * Geographical coordinates (latitude, longitude).

 * Use {@link OpenWeatherClient#getCoordinatesByLocationName()} or {@link OpenWeatherClient#getCoordinatesByZipOrPostCode()} to get the coordinates of a place.
 */

export interface Coordinates {
  lat: number;
  lon: number;
}

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

export interface CurrentWeather {
  coord: Coordinates;
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  /** Internal parameter */
  base: string;
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  rain?: {
    "1h"?: number;
    "3h"?: number;
  };
  snow?: {
    "1h"?: number;
    "3h"?: number;
  };
  dt: number;
  sys: {
    /** Internal parameter */
    type?: number;
    /** Internal parameter */
    id?: number;
    /** Internal parameter */
    message?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  /**
   * City ID.
   *
   * Please note that built-in geocoder functionality has been deprecated.
   * Learn more {@link https://openweathermap.org/current#builtin | here}.
   */
  id: number;
  /**
   * City name.
   *
   * Please note that built-in geocoder functionality has been deprecated.
   * Learn more {@link https://openweathermap.org/current#builtin | here}.
   */
  name: string;
  /** Internal parameter */
  cod?: number;
}

export type LocalNames = Record<string, string> & {
  ascii?: string;
  feature_name?: string;
};

export interface CoordinatesByLocationName {
  name: string;
  local_names?: LocalNames;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface CoordinatesByZipOrPostCode {
  zip: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
}

export interface LocationNameByCoordinates {
  name: string;
  local_names: LocalNames;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface Forecast5days3hours {
  /** Internal parameter */
  cod?: string;
  /** Internal parameter */
  message?: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level?: number;
      grnd_level?: number;
      humidity: number;
      temp_kf?: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    visibility: number;
    /**
     * Probability of precipitation.
     *
     * The values of the parameter vary between 0 and 1, where 0 is equal to 0%, 1 is equal to 100%
     */
    pop: number;
    rain?: {
      "3h": number;
    };
    snow?: {
      "3h": number;
    };
    sys?: {
      /**
       * Part of the day (n - night, d - day)
       */
      pop?: string;
    };
    dt_txt: string;
  }>;
  city: {
    /**
     * City ID.
     *
     * Please note that built-in geocoder functionality has been deprecated.
     * Learn more {@link https://openweathermap.org/forecast5#builtin | here}.
     */
    id: number;
    /**
     * City name.
     *
     * Please note that built-in geocoder functionality has been deprecated.
     * Learn more {@link https://openweathermap.org/forecast5#builtin | here}.
     */
    name: string;
    coord: Coordinates;
    /**
     * Country code (GB, JP etc.).
     *
     * Please note that built-in geocoder functionality has been deprecated.
     * Learn more {@link https://openweathermap.org/forecast5#builtin | here}.
     */
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}
