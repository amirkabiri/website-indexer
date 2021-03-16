import express from 'express'
import { createServer } from 'http'
import path from "path";

export default function (PORT){
  const app = express();
  const http = createServer(app);

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));

  app.get('/index', (req, res) => {
    res.render('index');
  });
  app.get('/search', (req, res) => {
    res.render('search');
  });

  http.listen(PORT, () => console.log('server is running on port ' + PORT))

  return http;
}