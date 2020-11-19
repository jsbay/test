import "egg";
import { inflate } from "zlib";

declare module "egg" {
  interface db {
    config: mssqlConfig;
  }
}

interface mssqlConfig {
  server: string;
  port: number;
  user: string;
  password: string;
  database: string;
}
