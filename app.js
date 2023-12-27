startServer();

async function startServer() {
  await require('./utils/env-loader')({
    configFilePath: './env.json'
  });

  try {
    const express = require('express');
    const cors = require('cors');

    const authMiddleware = require('./middleware/authentication');
    const cookieParser = require('cookie-parser');
    const bodyParser = require("body-parser")

    const usersRouter = require('./routes/users.routes');
    const moviesRouter = require('./routes/movies.routes');

    const swaggerJsdoc = require("swagger-jsdoc");
    const swaggerUi = require("swagger-ui-express");

    const app = express();

    app.use(cors());

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());

    app.use(authMiddleware);

    const options = {
      definition: {
        openapi: "3.1.0",
        info: {
          title: "LogRocket Express API with Swagger",
          version: "0.1.0",
          description:
            "This is a simple CRUD API application made with Express and documented with Swagger",
          license: {
            name: "MIT",
            url: "https://spdx.org/licenses/MIT.html",
          },
          contact: {
            name: "LogRocket",
            url: "https://logrocket.com",
            email: "info@email.com",
          },
        },
        servers: [
          {
            url: `http://localhost:${process.env.PORT}`,
          },
        ],
      },
      apis: ["./routes/*.js"],
    };
    
    const specs = swaggerJsdoc(options);
    app.use("/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(specs, { explorer: true })
    );

    app.get('/health_check', (req, res) => {
      res.send({
        success: true
      });
    });

    app.use('/users', usersRouter);
    app.use('/movies', moviesRouter);

    const PORT = parseInt(process.env.PORT) || 3000;

    const http = require('http');
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`Movie Muse APIs are running on port ${PORT}.`);
    });
  } catch (error) {
    console.error('Error initializing Movie Muse APIs.', error);
  }
}