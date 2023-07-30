import { z } from "../deps.ts";

export enum APIS {
  GEO = "geo/1.0",
  DATA = "data/2.5",
}
export const APISSchema = z.nativeEnum(APIS);
