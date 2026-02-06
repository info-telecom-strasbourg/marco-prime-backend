import { Scalar } from "@scalar/hono-api-reference";
import packageJSON from "../../../package.json" with { type: "json" };
import type { AppOpenAPI } from "./app.config.ts";

export function setupOpenAPI(app: AppOpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Marco Prime API",
    },
  });

  app.get(
    "/reference",
    Scalar({
      url: "/doc",
      theme: "purple",
      layout: "classic",
      showDeveloperTools: "localhost",
      defaultOpenAllTags: true,
      defaultHttpClient: {
        targetKey: "node",
        clientKey: "fetch",
      },
    }),
  );
}
