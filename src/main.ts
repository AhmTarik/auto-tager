import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { AppModule } from "./app.module";
import * as swaggerUi from "swagger-ui-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle("HackerNews Insights API: Unveiling Trends in Story Titles")
    .setDescription(
      "Discover meaningful trends and insights within HackerNews story titles with our HackerNews Insights API"
    )
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(document));

  // enable shutdown hooks explicitly.
  app.enableShutdownHooks();
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  //app.useLogger();
  await app.listen(3000);
}
bootstrap();
