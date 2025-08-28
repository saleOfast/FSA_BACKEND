import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { DistributorRepository, Distributor } from "../../../../core/DB/Entities/distributors.entity";
import { CreateDistributorDto, GetDistributorByIdDto, ListDistributorsFilterDto, UpdateDistributorDto } from "../../../../core/types/DistributorService/DistributorService";
import { SelectQueryBuilder } from "typeorm";

class DistributorController {
    private distributorRepository = DistributorRepository();

    constructor() { }

    async create(input: CreateDistributorDto): Promise<IApiResponse> {
        try {
            const { distributorName, type, address, isActive } = input;

            const entity = new Distributor();
            entity.distributorName = distributorName;
            entity.type = type;
            entity.address = address;
            entity.isActive = isActive;

            await this.distributorRepository.save(entity as any);
            return { status: STATUSCODES.SUCCESS, message: "Success." }
        } catch (error) {
            throw error;
        }
    }

    async update(input: UpdateDistributorDto): Promise<IApiResponse> {
        try {
            const { distributorId, distributorName, type, address, isActive } = input;
            const existing: Distributor | null = await this.distributorRepository.findOne({ where: { distributorId: Number(distributorId) } as any }) as any;
            if (!existing) {
                return { message: "Not Found.", status: STATUSCODES.BAD_REQUEST };
            }
            await this.distributorRepository.createQueryBuilder()
                .update({ distributorName, type, address, isActive })
                .where({ distributorId: Number(distributorId) } as any)
                .execute();

            return { status: STATUSCODES.SUCCESS, message: 'Success.' };
        } catch (error) {
            throw error;
        }
    }

    async list(input: ListDistributorsFilterDto): Promise<IApiResponse> {
        try {
            let { search, pageNumber = '1', pageSize = '10' } = input;
            let query: SelectQueryBuilder<Distributor> = (this.distributorRepository as any).createQueryBuilder('distributor');

            if (search) {
                query.where(
                    `(
                        LOWER(distributor.distributor_name) LIKE LOWER(:searchTerm) OR
                        LOWER(distributor.type) LIKE LOWER(:searchTerm)
                     )`,
                    { searchTerm: `%${search.toLowerCase()}%` }
                );
            }

            query.orderBy('distributor.updatedAt', 'DESC');
            query.skip((+pageNumber - 1) * +pageSize).take(+pageSize);
            const result = await query.getManyAndCount();

            const response = {
                distributors: result.length > 0 ? result[0] : [],
                pagination: {
                    pageNumber: +pageNumber,
                    pageSize: +pageSize,
                    totalRecords: result.length > 0 ? result[1] : 0
                }
            }

            return { status: STATUSCODES.SUCCESS, message: 'Success.', data: response };
        } catch (error) {
            throw error;
        }
    }

    async getById(input: GetDistributorByIdDto): Promise<IApiResponse> {
        try {
            const { distributorId } = input;
            const distributorDetails: Distributor | null = await this.distributorRepository.findOne({ where: { distributorId: Number(distributorId) } as any }) as any;
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: distributorDetails }
        } catch (error) {
            throw error;
        }
    }
}

export { DistributorController as DistributorService }