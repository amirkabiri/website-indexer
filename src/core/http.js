import express from 'express'
import { createServer } from 'http'
import path from "path";
import Page from "../models/page";
import Host from "../models/host";
import Queue from "../models/queue";

export default function (PORT){
  const app = express();
  const http = createServer(app);

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));

  app.get('/', async (req, res) => {
    const pagesCount = await Page.countDocuments();
    const hostsCount = await Host.countDocuments();
    res.render('search', { pagesCount, hostsCount });
  });

  app.get('/index', (req, res) => {
    res.render('index');
  });

  app.get('/api/queue', async (req, res) => {
    const options = {};

    if(req.query.limit){
      options.limit = +req.query.limit;
    }
    if(req.query.sort){
      options.sort = { createdAt: +req.query.sort };
    }

    const items = await Queue.find({}, null, options);
    res.json(items.map(item => item.url));
  });

  app.get('/api/pages', async (req, res) => {
    const options = {};

    if(req.query.limit){
      options.limit = +req.query.limit;
    }
    if(req.query.sort){
      options.sort = { createdAt: +req.query.sort };
    }

    const items = await Page.find({}, null, options);
    res.json(items.map(item => item.url));
  });

  http.listen(PORT, () => console.log('server is running on port ' + PORT))

  return http;
}