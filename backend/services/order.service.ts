import { Commission, Order } from "@prisma/client";
import prisma from "../lib/prisma";
import { GetBatchResult } from "@prisma/client/runtime/library";
const getOrdersService = async ({
  start,
  end,
}: {
  start: string;
  end: string;
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
        products: {
          select: {
            product: true,
          },
        },
      },
    });
    return orders;
  } catch (error) {
    throw error;
  }
};

const saveCommissionPlanService = async ({
  commissions,
  staffMemberId,
  orders,
}: {
  commissions: {
    percentage: number;
    productId: string;
  }[];
  orders: {
    orderId: string;
  }[];
  staffMemberId: string;
}): Promise<any> => {
  try {
    commissions.forEach(async (commission) => {
      await prisma.commission.create({
        data: {
          percentage: commission.percentage,
          productId: commission.productId,
        },
      });
    });
    orders.forEach(async (order) => {
      await prisma.order.update({
        where: { id: order.orderId },
        data: {
          staffMemberId,
        },
      });
    });
    return true;
  } catch (error) {
    throw error;
  }
};

export { getOrdersService, saveCommissionPlanService };
