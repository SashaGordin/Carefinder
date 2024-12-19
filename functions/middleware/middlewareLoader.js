const bodyParser = require('body-parser');
const cors = require('cors');

const corsOptions = {
  origin: ['https://carefinder-4c036.web.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = (app) => {
  // General middleware
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors(corsOptions));
};
