import chalk from "chalk";
import moment from "moment";

// Middleware to log requests for debugging purposes
const requestLogger = (req, res, next) => {
  const currentDate = moment(moment.now()).format("YYYY-MM-DD hh:mm:ss");
  const requestDate = chalk.blue(currentDate);
  const requestUrl = chalk.cyanBright(req.url);
  const requestMethod = chalk.magenta(req.method);
  console.log(`[${requestDate}] ${requestMethod}:${requestUrl}`);
  if (Object.keys(req.body).length) {
    console.log(req.body);
  }

  next();
};

export default requestLogger;
