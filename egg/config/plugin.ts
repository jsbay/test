import { EggPlugin } from "egg";

const plugin: EggPlugin = {
  // static: true,
  redis: {
    enable: true,
    package: "egg-redis",
  },
  sessionRedis: {
    enable: true,
    package: "egg-session-redis",
  },
  passport: {
    enable: true,
    package: "egg-passport",
  },
  passportLocal: {
    enable: true,
    package: "egg-passport-local",
  },
};

export default plugin;
