import { load } from "https://deno.land/std@0.196.0/dotenv/mod.ts";
import {} from "https://deno.land/std@0.196.0/assert/mod.ts";
import {} from "https://deno.land/std@0.196.0/testing/bdd.ts";
import {
  arrayCoordinatesByLocationNameSchema,
  coordinatesByLocationNameSchema,
  Lang,
  OpenWeatherClient,
} from "./src/mod.ts";
import { currentWeatherSchema } from "./src/types.ts";

// todo: redo the entire test thing to use the proper testing tools

await load({ examplePath: null, export: true });
const apiKey = Deno.env.get("OPENWEATHER_API_KEY");

if (!apiKey) throw new Error("'OPENWEATHER_API_KEY' env var is not defined");

const client = new OpenWeatherClient({
  apiKey,
});

const geocoding = await client.getCoordinatesByLocationName("chicago", 1);
console.log(geocoding);
arrayCoordinatesByLocationNameSchema.parse(geocoding);
coordinatesByLocationNameSchema.parse(geocoding[0]);
const currentWeather = await client.getCurrentWeather(
  geocoding[0],
  undefined,
  Lang.CATALAN,
);
console.log(currentWeather);
currentWeatherSchema.parse(currentWeather);
