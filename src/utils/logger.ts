import pino from "pino";

export const logger = pino({
  name: "cowin-verify",
  level: "debug"
});
