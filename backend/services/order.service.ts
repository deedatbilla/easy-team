import { Order } from "@prisma/client";
import prisma from "../lib/prisma";
const getOrdersService = async ({
  start,
  end,
  staffId,
}: {
  start: string;
  end: string;
  staffId: string;
}): Promise<Order[]> => {
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        products: true,
      },
    });
    return orders;
  } catch (error) {
    throw error;
  }
};

export { getOrdersService };
