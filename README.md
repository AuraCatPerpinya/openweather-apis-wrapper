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

A simple, TypeScript-first wrapper for
[OpenWeather APIs](https://openweathermap.org/), with (partially) customizable
caching

Unstable, and maybe not production ready, but it should mostly work.

## How to use

For now it has only been tested on Deno.

For the browser and Node.JS, it might work, but you will have to compile the
source code yourself. (and probably change a few things)

I might find a way to publish it as an NPM module (for Node.JS and perhaps the
browser), later.

To use it on Deno, you can import it from
[Deno.land](https://deno.land/x/openweather_apis_wrapper)

You can also import it directly from the GitHub repo, either a branch, or one of
the tags/releases

### Examples

**(The examples below are not exhaustive. They might not show all the
possibilities nor all the available methods)**

**(Please refer to the
[documentation](https://deno.land/x/openweather_apis_wrapper/mod.ts) for more
info)**

#### Import

```ts
import { OpenWeatherClient } from "https://deno.land/x/openweather_apis_wrapper@v0.4/mod.ts";
```

#### Instantiate client

```ts
// Make sure your API key is kept very secret!!
const client = new OpenWeatherClient({ apiKey: "Your very secret API key" });

// You can also initialize default values for certain parameters
const client = new OpenWeatherClient({
  apiKey: "Your very secret API key",
  defaults: {
    units: "metric",
    lang: Lang.CATALAN,
    coordinates: {
      // I just put random numbers lol
      lat: 10,
      lon: 10,
    },
  },
});
// By default there is a cache in ram
// You can customize it (and even disable it) with the cacheHandlerOptions parameter

// Check the docs for more info
```

#### Get the coordinates of a place

Useful for methods that require coordinates as a parameter

```ts
// Here we get the coordinates (latitude, longitude) for a specific place
const coordinates = await client.getCoordinatesByLocationName("Chicago", 1);
// Another example:
const coordinates = await client.getCoordinatesByLocationName(
  "Paris, France",
  1,
);
```

#### Get current weather

```ts
// The coordinates variable here corresponds to the coordinates variable of the previous example

// You don't need to specify the coordinates if you've already set default coordinates on the client
const currentWeather = await client.getCurrentWeather(
  { lat: coordinates[0].lat, lon: coordinates[0].lon },
);
// Or alternatively you can specify the unit system ("standard", "metric", "imperial")
// and the language using the Lang enum
const currentWeather = await client.getCurrentWeather(
  { lat: coordinates[0].lat, lon: coordinates[0].lon },
  "metric",
  Lang.CATALAN,
);
```
