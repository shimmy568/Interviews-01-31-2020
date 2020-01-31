import express from 'express';
import moment from 'moment';
import { DailyImage } from './nasa/daily-image';
import * as bodyParser from 'body-parser';
import { getTimeline } from './nasa/timeline';

const app = express();

// Use body parser middleware to parse input from user for the dates field
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
const port = 8002; // default port to listen

// define a route handler for the default home page
app.get('/', async (request: any, response: any) => {
  response.send({});
});

// Handle get requests to /nasa
app.get('/daily', async (request: any, response: any) => {
  const daily = new DailyImage();
  // Sends in today's date as a formatted string
  const result = await daily.getImageForDate(moment().format('YYYY-MM-DD'));
  // Sends back the result of the image getter
  response.send(result);
});

// Handle timeline request
app.get('/timeline', async (req: express.Request, res: express.Response) => {
  const rawDates = req.body.dates as any;

  // Check that the dates object is set and the right type
  if (
    rawDates == null || // Check that dates is set
    typeof rawDates !== 'string'
  ) {
    res.status(422);
    res.send('"dates" felid must be sent in request');
    return;
  }

  const timeline = await getTimeline(rawDates.split(','));
  res.send({
    timeline
  });
});

// start the Express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
