import { Router, type IRouter } from "express";
import { eq, desc, inArray, sql } from "drizzle-orm";
import { db, ordersTable, usersTable, productsTable } from "@workspace/db";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

interface OrderItemInput {
  productId: number;
  quantity: number;
}

interface StoredOrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const router: IRouter = Router();

router.get("/orders", requireAuth, async (req, res): Promise<void> => {
  const orders = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.userId, req.user!.userId))
    .orderBy(desc(ordersTable.createdAt));

  res.json(orders.map(o => ({
    ...o,
    totalPrice: parseFloat(o.totalPrice),
    userName: null,
  })));
});

router.get("/orders/admin", requireAdmin, async (req, res): Promise<void> => {
  const orders = await db
    .select({
      id: ordersTable.id,
      userId: ordersTable.userId,
      items: ordersTable.items,
      totalPrice: ordersTable.totalPrice,
      status: ordersTable.status,
      shippingAddress: ordersTable.shippingAddress,
      createdAt: ordersTable.createdAt,
      userName: usersTable.name,
    })
    .from(ordersTable)
    .leftJoin(usersTable, eq(ordersTable.userId, usersTable.id))
    .orderBy(desc(ordersTable.createdAt));

  res.json(orders.map(o => ({
    ...o,
    totalPrice: parseFloat(o.totalPrice),
  })));
});

router.get("/orders/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }

  const [order] = await db
    .select({
      id: ordersTable.id,
      userId: ordersTable.userId,
      items: ordersTable.items,
      totalPrice: ordersTable.totalPrice,
      status: ordersTable.status,
      shippingAddress: ordersTable.shippingAddress,
      createdAt: ordersTable.createdAt,
      userName: usersTable.name,
    })
    .from(ordersTable)
    .leftJoin(usersTable, eq(ordersTable.userId, usersTable.id))
    .where(eq(ordersTable.id, id));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  if (req.user!.role !== "admin" && order.userId !== req.user!.userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  res.json({ ...order, totalPrice: parseFloat(order.totalPrice) });
});

router.post("/orders", requireAuth, async (req, res): Promise<void> => {
  const { items, shippingAddress } = req.body as {
    items?: OrderItemInput[];
    shippingAddress?: string;
  };

  if (!items || !Array.isArray(items) || items.length === 0 || !shippingAddress) {
    res.status(400).json({ error: "Items and shipping address are required" });
    return;
  }

  const productIds = items.map(i => i.productId);
  const products = await db
    .select()
    .from(productsTable)
    .where(inArray(productsTable.id, productIds));

  const productMap = new Map(products.map(p => [p.id, p]));
  const orderItems: StoredOrderItem[] = [];
  let total = 0;

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      res.status(400).json({ error: `Product ${item.productId} not found` });
      return;
    }
    if (product.countInStock < item.quantity) {
      res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      return;
    }
    const price = parseFloat(product.price);
    orderItems.push({
      productId: product.id,
      name: product.name,
      price,
      quantity: item.quantity,
      image: product.image,
    });
    total += price * item.quantity;
  }

  const [order] = await db.insert(ordersTable).values({
    userId: req.user!.userId,
    items: orderItems,
    totalPrice: String(total.toFixed(2)),
    status: "pending",
    shippingAddress,
  }).returning();

  res.status(201).json({ ...order, totalPrice: parseFloat(order.totalPrice), userName: null });
});

router.patch("/orders/:id/status", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }

  const { status } = req.body as { status?: string };
  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  const [order] = await db
    .update(ordersTable)
    .set({ status: status as "pending" | "processing" | "shipped" | "delivered" | "cancelled" })
    .where(eq(ordersTable.id, id))
    .returning();

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json({ ...order, totalPrice: parseFloat(order.totalPrice), userName: null });
});

export default router;
