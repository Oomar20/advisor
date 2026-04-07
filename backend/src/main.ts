import "reflect-metadata";

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import cors from "@fastify/cors";

import { AppModule } from "./app.module";
import { env } from "./config/env";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: ["error", "warn", "log"],
    },
  );

  await app.register(cors, {
    origin: true,
  });

  const port = env.PORT;
  const host = env.HOST;

  await app.listen(port, host);

  Logger.log(`Backend listening at http://${host}:${port}`, "Bootstrap");
}

void bootstrap();
