import { Router } from "express";
import inventoryController from "../../Controllers/inventory/inventory";
import { AccessTokenService } from "../../../../core/helper/validationMiddleware";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";

const router = Router();

router.use(AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN));

router.post("/create", (req, res) => inventoryController.create(req, res));
router.get("/getAll", (req, res) => inventoryController.getAll(req, res));
router.get("/getSummary", (req, res) => inventoryController.getSummary(req, res));
router.get("/getLowStock", (req, res) => inventoryController.getLowStock(req, res));
router.get("/:id", (req, res) => inventoryController.getById(req, res));
router.put("/:id", (req, res) => inventoryController.update(req, res));
router.delete("/:id", (req, res) => inventoryController.delete(req, res));



export default router;