export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Marco Prime API",
    version: "1.0.0",
    description: "API for managing orders, products, members, and recharges",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
      Member: {
        type: "object",
        properties: {
          id: { type: "number" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          cardNumber: { type: "number" },
          balance: { type: "string" },
          admin: { type: "boolean" },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "number" },
          title: { type: "string" },
          name: { type: "string" },
          color: { type: "string", nullable: true },
          price: { type: "string" },
          productTypeId: { type: "number" },
          available: { type: "boolean" },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        description: "Check if the API is running",
        tags: ["Health"],
        responses: {
          "200": {
            description: "API is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/member/{card_number}": {
      get: {
        summary: "Get member by card number",
        description: "Retrieve member information by card number",
        tags: ["Members"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "card_number",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Member found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Member" },
              },
            },
          },
          "404": {
            description: "Member not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/v1/products": {
      get: {
        summary: "Get all products",
        description: "Retrieve list of all products",
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "List of products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/history": {
      get: {
        summary: "Get order history",
        description: "Retrieve paginated order history",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
          },
        ],
        responses: {
          "200": {
            description: "Paginated order history",
          },
        },
      },
    },
    "/api/v1/purchase": {
      post: {
        summary: "Create a purchase",
        description: "Create a new purchase order",
        tags: ["Purchases"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId", "cardNumber", "amount"],
                properties: {
                  productId: { type: "integer" },
                  cardNumber: { type: "integer" },
                  amount: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Purchase created successfully",
          },
          "400": {
            description: "Bad request",
          },
          "404": {
            description: "Product or member not found",
          },
        },
      },
    },
    "/api/v1/recharge": {
      post: {
        summary: "Create a recharge",
        description: "Recharge a member's balance",
        tags: ["Recharges"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["cardNumber", "amount"],
                properties: {
                  cardNumber: { type: "integer" },
                  adminCardNumber: { type: "integer" },
                  amount: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Recharge created successfully",
          },
          "403": {
            description: "Forbidden",
          },
          "404": {
            description: "Member not found",
          },
        },
      },
    },
  },
};
