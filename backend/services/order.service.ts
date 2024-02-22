import { Order } from "@prisma/client";
import prisma from "../lib/prisma";
const getOrdersService = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<Order[]> => {
  try {
    const orders = await prisma.order.findMany({
      skip: page,
      take: limit,
    });
    return orders;
  } catch (error) {
    throw error;
  }
};

export { getOrdersService };
