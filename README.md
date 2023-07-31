# openweather-apis-wrapper

<div align="left">
  <a href="https://deno.land/x/openweather_apis_wrapper/mod.ts">Documentation</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://deno.land/x/openweather_apis_wrapper">Deno</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/AuraCatPerpinya/openweather-apis-wrapper/issues/new">Issues (GitHub)</a>
  <!-- <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span> -->
</div>
<br/>

A simple, TypeScript-first wrapper for the APIs provided by
[OpenWeather](https://openweathermap.org/)

(Not yet stable or production ready)

## How to use

For now it has only been tested on Deno.

For the browser and Node.JS, it might work, but you will have to compile it
yourself. (and probably change a few things)

I might find a way to publish it as an NPM module (for Node.JS and perhaps the
browser), later.

To use it on Deno, you can import it from
[Deno.land](https://deno.land/x/openweather_apis_wrapper)

For example:

```ts
import { OpenWeatherClient } from "https://deno.land/x/openweather_apis_wrapper@v0.2/mod.ts";

// ...your code
```

You can also import it directly from the GitHub repo, either a branch, or one of
the tags/releases

### Example

```ts
import { OpenWeatherClient } from "https://deno.land/x/openweather_apis_wrapper@v0.2/mod.ts";

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
