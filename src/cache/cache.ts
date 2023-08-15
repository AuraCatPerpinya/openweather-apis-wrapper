import {
  CoordinatesByLocationName,
  CoordinatesByZipOrPostCode,
  CurrentWeather,
  Forecast5days3hours,
  LocationNameByCoordinates,
} from "../types.ts";
import { MemoryCache } from "./caches/mod.ts";

export interface CacheOptions {
  /** Timeout delay */
  sweepDelay: number;
}

export interface Cache<TCached> {
  has(key: string): boolean | Promise<boolean>;
  get(
    key: string,
  ): (TCached | undefined) | (Promise<TCached> | Promise<undefined>);
  set(key: string, value: TCached): void | Promise<void>;
}

export interface Caches {
  coordinatesByLocationName: Cache<CoordinatesByLocationName[]>;
  coordinatesByZipOrPostCode: Cache<CoordinatesByZipOrPostCode>;
  locationNameByCoordinates: Cache<LocationNameByCoordinates[]>;
  currentWeather: Cache<CurrentWeather>;
  forecast5days3hours: Cache<Forecast5days3hours>;
}

export type OptionalizedCaches = { [key in keyof Caches]?: Caches[key] };
export type CacheHandlerOptions = {
  /** (optional) - You can instantiate custom caches here */
  caches?: OptionalizedCaches;
};

export class CacheHandler implements Caches {
  coordinatesByLocationName: Cache<CoordinatesByLocationName[]>;
  coordinatesByZipOrPostCode: Cache<CoordinatesByZipOrPostCode>;
  locationNameByCoordinates: Cache<LocationNameByCoordinates[]>;
  currentWeather: Cache<CurrentWeather>;
  forecast5days3hours: Cache<Forecast5days3hours>;

  constructor(options?: CacheHandlerOptions) {
    const caches = options?.caches;

    this.coordinatesByLocationName = caches?.coordinatesByLocationName ||
      new MemoryCache(
        { sweepDelay: 30 * 1000 * 60 },
      );
    this.coordinatesByZipOrPostCode = caches?.coordinatesByZipOrPostCode ||
      new MemoryCache(
        { sweepDelay: 30 * 1000 * 60 },
      );
    this.locationNameByCoordinates = caches?.locationNameByCoordinates ||
      new MemoryCache(
        { sweepDelay: 30 * 1000 * 60 },
      );
    this.currentWeather = caches?.currentWeather || new MemoryCache(
      { sweepDelay: 10 * 1000 * 60 },
    );
    this.forecast5days3hours = caches?.forecast5days3hours || new MemoryCache(
      { sweepDelay: 10 * 1000 * 60 },
    );
  }
}
