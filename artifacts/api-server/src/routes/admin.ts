import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, ordersTable, productsTable, usersTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth.js";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/admin/stats", requireAdmin, async (req, res): Promise<void> => {
  const [totalRevenueRow] = await db
    .select({ total: sql<string>`SUM(CAST(total_price AS NUMERIC))` })
    .from(ordersTable);

  const [totalOrdersRow] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(ordersTable);

  const [totalProductsRow] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(productsTable);

  const [totalUsersRow] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(usersTable);

  const recentOrders = await db
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
    .leftJoin(usersTable, sql`${ordersTable.userId} = ${usersTable.id}`)
    .orderBy(desc(ordersTable.createdAt))
    .limit(5);

  const ordersByStatus = await db
    .select({
      status: ordersTable.status,
      count: sql<number>`COUNT(*)::int`,
    })
    .from(ordersTable)
    .groupBy(ordersTable.status);

  res.json({
    totalRevenue: parseFloat(totalRevenueRow?.total ?? "0"),
    totalOrders: totalOrdersRow?.count ?? 0,
    totalProducts: totalProductsRow?.count ?? 0,
    totalUsers: totalUsersRow?.count ?? 0,
    recentOrders: recentOrders.map(o => ({ ...o, totalPrice: parseFloat(o.totalPrice) })),
    ordersByStatus,
  });
});

export default router;
