import { Brand, BrandRepository } from "../../../../core/DB/Entities/brand.entity";
import { CompetitorBrand, CompetitorBrandRepository } from "../../../../core/DB/Entities/brand.competitor.entity";
import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { CreateBrand, DeleteBrand, GetBrand, GetBrandList, IBrand, UpdateBrand } from "../../../../core/types/BrandService/BrandService";
import { IUser } from "../../../../core/types/AuthService/AuthService";

class BrandController {
    private brand = BrandRepository();
    private competitorBrandRepository = CompetitorBrandRepository();

    constructor() { }

    async add(input: CreateBrand, payload: IUser): Promise<IApiResponse> {
        try {
            const { name, isCompetitor } = input;
            const { emp_id } = payload;

            const newBrand = new Brand();
            newBrand.name = name;
            newBrand.empId = emp_id;
            if (isCompetitor == 1) {
                await this.competitorBrandRepository.save(newBrand);
            } else {
                await this.brand.save(newBrand);
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }


    async list(input: GetBrandList, payload: IUser): Promise<IApiResponse> {
        try {

            let brandList
            if (input.isCompetitor == 1) {
                brandList = await this.competitorBrandRepository.find({
                    where: { isDeleted: false },
                    order: {
                        createdAt: 'DESC'
                    }
                });
            } else {
                brandList = await this.brand.find({
                    where: { isDeleted: false },
                    order: {
                        createdAt: 'DESC'
                    }
                });

            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: brandList }
        } catch (error) {
            throw error;
        }
    }


    async getBrandById(payload: IUser, input: GetBrand, query: any): Promise<IApiResponse> {
        try {
            const { brandId } = input;
            let brand;

            if (query.isCompetitor == 1) {
                brand = await this.competitorBrandRepository.findOne({ where: { CompetitorBrandId: Number(brandId) } });
            } else {
                brand = await this.brand.findOne({ where: { brandId: Number(brandId) } });
            }

            if (!brand) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: brand }
        } catch (error) {
            throw error;
        }
    }


    async update(payload: IUser, input: UpdateBrand): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { name, brandId } = input;
            if (!name) {
                return { message: "Name can't be empty.", status: STATUSCODES.BAD_REQUEST }
            }
            if (input.isCompetitor == 1) {
                await this.competitorBrandRepository.createQueryBuilder().update({ name: name }).where({ CompetitorBrandId: brandId }).execute();
            }
            else {
                await this.brand.createQueryBuilder().update({ name: name }).where({ brandId }).execute();
            }

            return { message: "Updated.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async delete(payload: IUser, input: DeleteBrand, query: any): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { brandId } = input;
            if (query.isCompetitor == 1) {
                await this.competitorBrandRepository.createQueryBuilder().update({ isDeleted: true }).where({ CompetitorBrandId: brandId }).execute();
            } else {
                await this.brand.createQueryBuilder().update({ isDeleted: true }).where({ brandId: brandId }).execute();
            }
            return { message: "Deleted Successfully.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async addMultipleBrands(inputs: CreateBrand[], payload: IUser, isCompetitor: any): Promise<IApiResponse> {
        const { emp_id } = payload;
        console.log({ inputs });

        const brandRepository = BrandRepository();
        const competitorBrandRepository = CompetitorBrandRepository();

        if (!brandRepository) {
            throw new Error("BrandRepository is not properly initialized.");
        }

        // Set to track processed brands (name + empId)
        const processedBrands: Set<string> = new Set();
        const skippedBrands: string[] = [];  // Track skipped brands

        try {
            for (const input of inputs) {
                if (!input || !input.name) {
                    throw new Error("Invalid input data.");
                }

                const { name } = input;
                const key = `${name}-${emp_id}`;  // Create a unique key based on name and empId

                console.log(`Processing brand: ${name}`);

                // Check for in-memory duplicates
                if (processedBrands.has(key)) {
                    skippedBrands.push(`Brand with the name ${name} (Duplicate in input)`);
                    continue;  // Skip the brand if it already exists in the input
                }

                // Mark this brand as processed
                processedBrands.add(key);

                // Validate that the brand doesn't already exist in the database
                let existingBrand
                if (isCompetitor == 1) {
                    existingBrand = await brandRepository.findOneBy({ name, empId: emp_id });
                } else {
                    existingBrand = await competitorBrandRepository.findOneBy({ name, empId: emp_id });
                }
                if (existingBrand) {
                    skippedBrands.push(`Brand with the name ${name} (Already exists in database)`);
                    continue;  // Skip if the brand already exists in the database
                }

                // Create new brand entity
                const newBrand = new Brand();
                newBrand.name = name;
                newBrand.empId = emp_id;

                // Save the brand
                if (isCompetitor == 1) {
                    await competitorBrandRepository.save(newBrand);
                } else {
                    await brandRepository.save(newBrand);
                }

            }

            // Construct the response message
            const message = skippedBrands.length > 0
                ? `Brands created successfully. Skipped brands: ${skippedBrands.join(', ')}.`
                : "All brands created successfully.";

            return {
                message,
                status: STATUSCODES.SUCCESS,
            };
        } catch (error) {
            console.log({ error }, "******************************");
            throw error;
        }
    }
}

export { BrandController as BrandService }