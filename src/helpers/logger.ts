import * as moment from "moment-timezone";
import { createLogger, format, transports } from "winston";
import { Constants } from "../config/constants";

const {
  combine, timestamp, prettyPrint, colorize,
} = format;

export class Log {

  public static getLogger() {
    return createLogger({
      format: combine(
        timestamp({ format: this.timestampFormat }),
        prettyPrint(),
        colorize(),
      ),
      level: "debug",
      transports: [new transports.Console()],
    });
  }
  private static timestampFormat: any = moment(new Date()).tz(Constants.TIMEZONE).format("YYYY-MM-DD hh:mm:ss");
}
