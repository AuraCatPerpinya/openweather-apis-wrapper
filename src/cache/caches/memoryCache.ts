import { Cache, CacheOptions } from "../cache.ts";

export class MemoryCache<TCached> implements Cache<TCached> {
  #cache = new Map<string, TCached>();
  #cachedWhen = new Map<string, number>();

  sweepDelay: number;

  constructor(options: CacheOptions) {
    const { sweepDelay } = options;
    this.sweepDelay = sweepDelay;

    setInterval(() => {
      for (const key of this.#cache.keys()) {
        if (
          this.#cachedWhen.has(key) &&
          ((Date.now() - this.#cachedWhen.get(key)!) > this.sweepDelay)
        ) {
          this.#cache.delete(key);
          this.#cachedWhen.delete(key);
        }
      }
    }, 5 * 1000 * 60);
  }

  has(key: string): boolean {
    return this.#cache.has(key);
  }

  get(key: string): TCached | undefined {
    return this.#cache.get(key);
  }

  set(key: string, value: TCached): void {
    this.#cachedWhen.set(key, Date.now());
    this.#cache.set(key, value);
  }
}
