import { Request, Response } from "express";
import { getOrdersService } from "../services/order.service";

export const ordersController = {
  getOrders: async (request: Request, response: Response) => {
    try {
      const { start, end, staffId } = request.body;
      const orders = await getOrdersService({ start, end, staffId });
      response.status(200).json({
        status: 200,
        success: true,
        orders,
      });
    } catch (error: any) {
      response.status(500).json({
        status: 500,
        success: false,
        message: error.message,
      });
    }
  },
};
