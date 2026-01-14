import { testClient } from "hono/testing";
import { describe, expect, it } from "vitest";
import { app } from "../src/index.js";
import { authenticatedOptions } from "./utils/helpers.js";

describe("Products Endpoint", () => {
  const client = testClient(app);

  it("should return list of products", async () => {
    const res = await client.api.v1.products.$get({}, authenticatedOptions);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);

    if (data.length > 0) {
      expect(data[0]).toHaveProperty("id");
      expect(data[0]).toHaveProperty("title");
      expect(data[0]).toHaveProperty("name");
      expect(data[0]).toHaveProperty("color");
      expect(data[0]).toHaveProperty("price");
      expect(data[0]).toHaveProperty("productTypeId");
      expect(data[0]).toHaveProperty("available");
    }
  });

  it("should return 401 without authentication", async () => {
    const res = await client.api.v1.products.$get();
    expect(res.status).toBe(401);
  });
});
