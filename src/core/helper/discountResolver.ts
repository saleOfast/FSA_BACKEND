import { DiscountRepository } from "../DB/Entities/discount.entity";
import { Discount } from "../DB/Entities/discount.entity";
import {
  DiscountStatus,
  ApprovalStatus,
} from "../DB/Entities/discount.entity";

export class DiscountResolver {
  private discountRepository = DiscountRepository();

  async getApplicableDiscounts(input: {
    skuId?: number;
    customerId?: number;
    customerTypeId?: number;
    orderValue?: number;
    qty?: number;
    countryId?: number;
    stateId?: number;
    districtId?: number;
    beatId?: number;
  }): Promise<Discount[]> {
    const qb = this.discountRepository
      .createQueryBuilder("d")
      .where("d.isDeleted = false");

    // ✅ Date filter
    qb.andWhere(`
      (d.validFrom IS NULL OR d.validFrom <= CURRENT_DATE)
      AND (d.validTill IS NULL OR d.validTill >= CURRENT_DATE)
    `);

    // ✅ Status
    qb.andWhere("d.status = :status", {
      status: DiscountStatus.ACTIVE,
    });

    qb.andWhere("d.approvalStatus = :approvalStatus", {
      approvalStatus: ApprovalStatus.APPROVED,
    });

    // ✅ SKU
    if (input.skuId) {
      qb.andWhere("(d.skuId IS NULL OR d.skuId = :skuId)", {
        skuId: input.skuId,
      });
    }

    // ✅ Customer
    if (input.customerId) {
      qb.andWhere("(d.customerId IS NULL OR d.customerId = :customerId)", {
        customerId: input.customerId,
      });
    }

    // ✅ Customer Type
    if (input.customerTypeId) {
      qb.andWhere(
        "(d.customerTypeId IS NULL OR d.customerTypeId = :customerTypeId)",
        { customerTypeId: input.customerTypeId }
      );
    }

    // ✅ Qty
    if (input.qty) {
      qb.andWhere("(d.minQty IS NULL OR d.minQty <= :qty)", {
        qty: input.qty,
      });
      qb.andWhere("(d.maxQty IS NULL OR d.maxQty >= :qty)", {
        qty: input.qty,
      });
    }

    // ✅ Order value
    if (input.orderValue) {
      qb.andWhere(
        "(d.minimumOrderValue IS NULL OR d.minimumOrderValue <= :orderValue)",
        { orderValue: input.orderValue }
      );
    }

    // ✅ Geography
    if (input.countryId) {
      qb.andWhere("(d.countryId IS NULL OR d.countryId = :countryId)", {
        countryId: input.countryId,
      });
    }

    if (input.stateId) {
      qb.andWhere("(d.stateId IS NULL OR d.stateId = :stateId)", {
        stateId: input.stateId,
      });
    }

    if (input.districtId) {
      qb.andWhere("(d.districtId IS NULL OR d.districtId = :districtId)", {
        districtId: input.districtId,
      });
    }

    if (input.beatId) {
      qb.andWhere("(d.beatId IS NULL OR d.beatId = :beatId)", {
        beatId: input.beatId,
      });
    }

    // ✅ FIXED: Priority ASC (LOWER = HIGHER PRIORITY)
    qb.orderBy("d.priority", "ASC");

    return qb.getMany();
  }
}