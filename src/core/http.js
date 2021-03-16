import express from 'express'
import { createServer } from 'http'
import path from "path";
import Page from "../models/page";
import Host from "../models/host";

export default function (PORT){
  const app = express();
  const http = createServer(app);

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));
  console.log(path.join(__dirname, '../views'))

  app.get('/index', (req, res) => {
    res.render('index');
  });

  app.get('/search', async (req, res) => {
    const pagesCount = await Page.countDocuments();
    const hostsCount = await Host.countDocuments();
    res.render('search', { pagesCount, hostsCount });
  });

  http.listen(PORT, () => console.log('server is running on port ' + PORT))

  return http;
}