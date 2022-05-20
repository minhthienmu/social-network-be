import { MONGODB_SERVER, MONGODB_USER, MONGODB_PASSWORD } from './src/constanst/constanst';
import http from "http";
import express, { Application, Request, Response } from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import cors from "cors";
import config from "./src/config/config";
import morgan from "morgan";
import mongoose from "mongoose";
import schema from "./src/graphql/schema";
import resolvers from "./src/graphql/resolver";

(async function startApolloServer() {
  const app: Application = express();

  //MORGAN
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms")
  );

  //DATABASE
  mongoose.connect(
    MONGODB_SERVER,
    {
      user: MONGODB_USER,
      pass: MONGODB_PASSWORD,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }
  );
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("Database Connected");
  });

  // Body parsing Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //CORS
  var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));

  app.get("/", async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({
      message: "Server OK!",
    });
  });

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start();

  server.applyMiddleware({ app });
  await new Promise<void>(resolve => httpServer.listen({ port: config.server.port }, resolve));
  console.log(`🚀 Server ready at ${config.server.hostname}:${config.server.port}${server.graphqlPath}`);
  
  return { server, app };
})();