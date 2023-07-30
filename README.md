# openweather-api-wrapper

A simple, TypeScript-first wrapper for the APIs provided by OpenWeather

(Not yet stable or production ready)

## How to use

For now it has only been tested on Deno.

For the browser and Node.JS, it might work, but you will have to compile it
yourself. (and probably change a few things)

I might find a way to publish it as an NPM module (for Node.JS and perhaps the
browser), later.

To use it on Deno, just import either from the mod.ts file present in the main
branch (not recommended), or import from one of the releases or tags.

I might publish it on [deno.land](deno.land) and maybe some other platforms like
[nest.land](nest.land)

### Example

```ts
// Here we instantiate the client :)
// Make sure your API key is kept very secret!!
const client = new OpenWeatherClient({ apiKey: "Your very secret API key" });

// Here we get the coordinates (latitude, longitude) for a specific place
const coordinates = await client.getCoordinatesByLocationName("Chicago", 1);
// Another example:
const coordinates = await client.getCoordinatesByLocationName(
  "Paris, France",
  1,
);
// See this link for the return value in the OpenWeather docs:
// https://openweathermap.org/api/geocoding-api#direct_name_fields

const currentWeather = await client.getCurrentWeather(
  { lat: coordinates[0].lat, lon: coordinates[0].lon },
);
// Or alternatively you can specify the unit system ("standard", "metric", "imperial"), and the language using the Lang enum
// See the following link for all the available languages (or see all the availables values in the Lang enum):
// https://openweathermap.org/current#multi
const currentWeather = await client.getCurrentWeather(
  { lat: coordinates[0].lat, lon: coordinates[0].lon },
  "metric",
  Lang.CATALAN,
);
// See this link for the return value in the OpenWeather docs:
// https://openweathermap.org/current#current_JSON
```
