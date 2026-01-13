import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { seed } from "drizzle-seed";
import mysql from "mysql2/promise";
import * as schema from "./schema.js";

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
const db = drizzle(connection);

async function main() {
  console.log("Starting database seed...");

  await seed(db, schema).refine((f) => ({
    productTypes: {
      count: 4,
      columns: {
        type: f.valuesFromArray({
          values: ["Boisson", "Snack", "Repas", "Dessert"],
        }),
      },
    },
    members: {
      count: 3,
      columns: {
        lastName: f.valuesFromArray({
          values: ["Dupont", "Martin", "Bernard"],
        }),
        firstName: f.valuesFromArray({
          values: ["Jean", "Sophie", "Lucas"],
        }),
        cardNumber: f.valuesFromArray({
          values: [1001, 1002, 1003],
        }),
        email: f.valuesFromArray({
          values: [
            "jean.dupont@example.com",
            "sophie.martin@example.com",
            "lucas.bernard@example.com",
          ],
        }),
        phone: f.valuesFromArray({
          values: ["0601020304", "0602030405", undefined],
        }),
        balance: f.valuesFromArray({
          values: ["50.00", "30.50", "15.75"],
        }),
        admin: f.valuesFromArray({
          values: [true, false, false],
        }),
        contributor: f.valuesFromArray({
          values: [false, true, false],
        }),
        birthDate: f.valuesFromArray({
          values: ["1990-05-15", "1995-08-20", "2000-03-10"],
        }),
        sector: f.valuesFromArray({
          values: ["Informatique", "Marketing", "Design"],
        }),
        class: f.valuesFromArray({
          values: [2024, 2023, 2025],
        }),
      },
    },
    products: {
      count: 5,
      columns: {
        name: f.valuesFromArray({
          values: ["Coca-Cola", "Eau", "Chips", "Sandwich", "Brownie"],
        }),
        title: f.valuesFromArray({
          values: [
            "Coca-Cola 33cl",
            "Eau minérale 50cl",
            "Chips salées",
            "Sandwich jambon-beurre",
            "Brownie au chocolat",
          ],
        }),
        price: f.valuesFromArray({
          values: ["2.50", "1.00", "1.50", "4.50", "2.00"],
        }),
        productTypeId: f.valuesFromArray({
          values: [1, 1, 2, 3, 4],
        }),
        color: f.valuesFromArray({
          values: ["red", undefined, undefined, undefined, "brown"],
        }),
        available: f.valuesFromArray({
          values: [true, true, true, true, true],
        }),
      },
    },
    orders: {
      count: 3,
      columns: {
        productId: f.valuesFromArray({
          values: [1, 4, 3],
        }),
        memberId: f.valuesFromArray({
          values: [1, 2, 3],
        }),
        price: f.valuesFromArray({
          values: ["2.50", "4.50", "1.50"],
        }),
        amount: f.valuesFromArray({
          values: [2, 1, 3],
        }),
      },
    },
  }));

  console.log("Database seed completed successfully!");

  await connection.end();
}

main().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
