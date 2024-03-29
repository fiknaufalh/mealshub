// router/OrderProductRouter.ts
import BaseRoutes from "./base/BaseRouter";
import OrderProductController from "../controller/OrderProductController";
import validate from "../helper/validate";
import {
    createOrderProductSchema,
    updateOrderProductSchema,
} from "../schema/OrderProductSchema";

class OrderProductRoutes extends BaseRoutes {
    public routes(): void {
        this.router.post(
            "",
            validate(createOrderProductSchema),
            OrderProductController.createOrderProduct,
        );
        this.router.post(
            "/bulk",
            OrderProductController.createOrderProductBulk,
        );
        this.router.patch(
            "/:orderId/:productId",
            validate(updateOrderProductSchema),
            OrderProductController.updateOrderProduct,
        );
        this.router.delete(
            "/:orderId/:productId",
            OrderProductController.deleteOrderProduct,
        );
        this.router.get("", OrderProductController.getAllOrderProduct);
        this.router.get(
            "/:orderId/:productId",
            OrderProductController.getOrderProductById,
        );
        this.router.get(
            "/:orderId",
            OrderProductController.getOrderProductByOrderId,
        );
    }
}

export default new OrderProductRoutes().router;
