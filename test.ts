import {
  assert,
  assertExists,
  assertInstanceOf,
  assertThrows,
  describe,
  it,
  load,
} from "./deps_test.ts";
import { OpenWeatherClient } from "./src/Client.ts";
import { Coordinates, Lang } from "./src/types.ts";
import {
  arrayCoordinatesByLocationNameSchema,
  arrayLocationNameByCoordinatesSchema,
  coordinatesByLocationNameSchema,
  coordinatesByZipOrPostCodeSchema,
  currentWeatherSchema,
  forecast5days3hoursSchema,
  locationNameByCoordinatesSchema,
} from "./test_schemas.ts";
import { parameterValidation } from "./src/paramValidation.ts";
import { OpenWeatherError } from "./src/customError.ts";

await load({ examplePath: null, export: true });
const apiKey = Deno.env.get("OPENWEATHER_API_KEY");
assertExists(apiKey, "'OPENWEATHER_API_KEY' env var is not defined");

const client = new OpenWeatherClient({ apiKey });
assertInstanceOf(client, OpenWeatherClient);

describe("parameter validation", () => {
  it("client options", () => {
    assertThrows(() => parameterValidation.validateClientOptions(undefined)),
      OpenWeatherError,
      "options";
    assertThrows(
      () => parameterValidation.validateClientOptions({}),
      OpenWeatherError,
      "options.apiKey",
    );
    assertThrows(
      () => parameterValidation.validateClientOptions({ apiKey: 123 }),
      OpenWeatherError,
      "options.apiKey",
    );
  });
  it("query", () => {
    assertThrows(
      () => parameterValidation.validateQuery(123),
      OpenWeatherError,
      "query",
    );
  });
  it("zipCode", () => {
    assertThrows(
      () => parameterValidation.validateZipCode(123),
      OpenWeatherError,
      "zipCode",
    );
  });
  it("coordinates", () => {
    assertThrows(
      () => parameterValidation.validateCoordinates(123),
      OpenWeatherError,
      "coordinates",
    );
    assertThrows(
      () =>
        parameterValidation.validateCoordinates({
          lat: "string",
          lon: 123,
        }),
      OpenWeatherError,
      "coordinates",
    );
    assertThrows(
      () =>
        parameterValidation.validateCoordinates({
          lat: 123,
          lon: "string",
        }),
      OpenWeatherError,
      "coordinates",
    );
  });
  it("limit", () => {
    assertThrows(
      () => parameterValidation.validateLimit("string"),
      "limit",
    );
    assertThrows(
      () => parameterValidation.validateLimit(1.5),
      OpenWeatherError,
      "limit",
    );
  });
  it("cnt", () => {
    assertThrows(
      () => parameterValidation.validateCnt("hi"),
      OpenWeatherError,
      "cnt",
    );
  });
  it("lang", () => {
    assertThrows(
      () => parameterValidation.validateLang({}),
      OpenWeatherError,
      "lang",
    );
  });
  it("units", () => {
    assertThrows(
      () => parameterValidation.validateUnits("imperialllll"),
      OpenWeatherError,
      "units",
    );
  });
});

describe("client", () => {
  let coordinates: Coordinates;

  describe("get coordinates", () => {
    assertExists(client);
    it("by location name", async () => {
      const coordinatesByLocationName = await client
        .getCoordinatesByLocationName("Paris,France", 3);

      assert(
        coordinatesByLocationName.length <= 3 &&
          coordinatesByLocationName.length >= 1,
      );
      arrayCoordinatesByLocationNameSchema.parse(coordinatesByLocationName);

      assertExists(coordinatesByLocationName[0]);
      coordinatesByLocationNameSchema.parse(coordinatesByLocationName[0]);

      coordinates = {
        lat: coordinatesByLocationName[0].lat,
        lon: coordinatesByLocationName[0].lon,
      };
    });

    it("by zip/post code", async () => {
      // Some random zip code from New York City
      const byZipCode = await client.getCoordinatesByZipOrPostCode("10279");

      // The post code from Perpignan (Perpinyà in Catalan), North Catalonia, France
      const byPostCode = await client.getCoordinatesByZipOrPostCode("66000,FR");

      coordinatesByZipOrPostCodeSchema.parse(byZipCode);
      coordinatesByZipOrPostCodeSchema.parse(byPostCode);
    });
  });

  it("get location name by coordinates", async () => {
    assertExists(client);
    assertExists(coordinates);

    const locationNameByCoordinates = await client.getLocationNameByCoordinates(
      coordinates,
    );

    assert(
      locationNameByCoordinates.length <= 3 &&
        locationNameByCoordinates.length >= 1,
    );
    arrayLocationNameByCoordinatesSchema.parse(locationNameByCoordinates);

    assertExists(locationNameByCoordinates[0]);
    locationNameByCoordinatesSchema.parse(locationNameByCoordinates[0]);
  });

  it("current weather", async () => {
    assertExists(client);
    assertExists(coordinates);
    const currentWeather = await client.getCurrentWeather(
      coordinates,
      "metric",
      Lang.CATALAN,
    );
    currentWeatherSchema.parse(currentWeather);
  });

  describe("forecast", () => {
    assertExists(client);

    it("5 days 3 hours", async () => {
      assertExists(coordinates);
      const forecast = await client.getForecast5days3hours(
        coordinates,
        5,
        "metric",
        Lang.GALICIAN,
      );
      forecast5days3hoursSchema.parse(forecast);
    });
  });
});
