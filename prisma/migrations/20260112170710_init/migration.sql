-- CreateTable
CREATE TABLE "members" (
    "id" BIGSERIAL NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "card_number" BIGINT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "contributor" BOOLEAN NOT NULL DEFAULT false,
    "birth_date" DATE,
    "sector" VARCHAR(100),
    "class" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_types" (
    "id" BIGSERIAL NOT NULL,
    "type" VARCHAR(50) NOT NULL,

    CONSTRAINT "product_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "product_type" BIGINT NOT NULL,
    "color" VARCHAR(50),
    "available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT,
    "member_id" BIGINT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 1,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_card_number_key" ON "members"("card_number");

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- CreateIndex
CREATE INDEX "members_card_number_idx" ON "members"("card_number");

-- CreateIndex
CREATE INDEX "members_email_idx" ON "members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "product_types_type_key" ON "product_types"("type");

-- CreateIndex
CREATE INDEX "products_product_type_idx" ON "products"("product_type");

-- CreateIndex
CREATE INDEX "products_available_idx" ON "products"("available");

-- CreateIndex
CREATE INDEX "orders_member_id_idx" ON "orders"("member_id");

-- CreateIndex
CREATE INDEX "orders_product_id_idx" ON "orders"("product_id");

-- CreateIndex
CREATE INDEX "orders_date_idx" ON "orders"("date");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_product_type_fkey" FOREIGN KEY ("product_type") REFERENCES "product_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
