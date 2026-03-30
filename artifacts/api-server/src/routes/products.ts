import { Router, type IRouter } from "express";
import { eq, ilike, gte, lte, and, desc } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth.js";

const router: IRouter = Router();

router.get("/products", async (req, res): Promise<void> => {
  const { search, category, minPrice, maxPrice } = req.query as {
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  };

  const conditions = [];
  if (search) conditions.push(ilike(productsTable.name, `%${search}%`));
  if (category) conditions.push(eq(productsTable.category, category));
  if (minPrice) conditions.push(gte(productsTable.price, minPrice));
  if (maxPrice) conditions.push(lte(productsTable.price, maxPrice));

  const products = await db
    .select()
    .from(productsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(productsTable.createdAt));

  res.json(products.map(p => ({
    ...p,
    price: parseFloat(p.price),
  })));
});

router.get("/products/featured", async (_req, res): Promise<void> => {
  const products = await db
    .select()
    .from(productsTable)
    .orderBy(desc(productsTable.createdAt))
    .limit(6);

  res.json(products.map(p => ({
    ...p,
    price: parseFloat(p.price),
  })));
});

router.get("/products/categories", async (_req, res): Promise<void> => {
  const rows = await db.selectDistinct({ category: productsTable.category }).from(productsTable);
  res.json(rows.map(r => r.category));
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }

  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json({ ...product, price: parseFloat(product.price) });
});

router.post("/products", requireAdmin, async (req, res): Promise<void> => {
  const { name, description, price, image, category, countInStock } = req.body as {
    name?: string;
    description?: string;
    price?: number;
    image?: string;
    category?: string;
    countInStock?: number;
  };
  if (!name || !description || price == null || !image || !category || countInStock == null) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  const [product] = await db.insert(productsTable).values({
    name,
    description,
    price: String(price),
    image,
    category,
    countInStock,
  }).returning();
  res.status(201).json({ ...product, price: parseFloat(product.price) });
});

router.put("/products/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }

  const { name, description, price, image, category, countInStock } = req.body as {
    name?: string;
    description?: string;
    price?: number;
    image?: string;
    category?: string;
    countInStock?: number;
  };

  const [product] = await db
    .update(productsTable)
    .set({
      ...(name && { name }),
      ...(description && { description }),
      ...(price != null && { price: String(price) }),
      ...(image && { image }),
      ...(category && { category }),
      ...(countInStock != null && { countInStock }),
    })
    .where(eq(productsTable.id, id))
    .returning();

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json({ ...product, price: parseFloat(product.price) });
});

router.delete("/products/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }

  await db.delete(productsTable).where(eq(productsTable.id, id));
  res.sendStatus(204);
});

export default router;
