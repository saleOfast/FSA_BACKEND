import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { PolicyTypeHead, PolicyTypeHeadRepository } from "../../../../core/DB/Entities/policyHeadType.entity";
import { STATUSCODES, TimelineEnum, UserRole } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from "date-fns";
import { Between, IsNull, Not } from "typeorm";
import { IPolicyTypeHead, PolicyTypeHeadC, PolicyTypeHeadD, PolicyTypeHeadR, PolicyTypeHeadU } from "core/types/PolicyTypeHeadService/PolicyTypeHeadService";

class PolicyHeadTypeService {
    private policyHeadTypeRepository = PolicyTypeHeadRepository();
    private userRespositry = UserRepository()

    constructor() { }

    async addPolicyType(input: PolicyTypeHeadC, payload: IUser): Promise<IApiResponse> {
        try {
            const existingPolicyType = await this.policyHeadTypeRepository.findOne({
                where: {
                    policy_id: input.policy_id,
                    from_date: input.from_date,
                    policy_type_name: input.policy_type_name,
                    claim_type: input.claim_type,
                },
            });

            if (existingPolicyType) {
                return { status: STATUSCODES.CONFLICT, message: "Policy Head Type Already Exist." };
            }

            // Create new policy type
            const newPolicyType = this.policyHeadTypeRepository.create(input);
            const savedPolicyType = await this.policyHeadTypeRepository.save(newPolicyType);

            return { status: STATUSCODES.SUCCESS, message: "Policy type created successfully.", data: savedPolicyType };
        } catch (error) {
            throw error;
        }
    }

    async getPolicyHeadTypeIDWise(input: PolicyTypeHeadR, payload: IUser): Promise<IApiResponse> {
        try {
            const policyTypeData = await this.policyHeadTypeRepository.find({
                where: { policy_id: Number(input.policy_id) },
                relations: ['policy'], // Assuming 'policy' is the relation name in the entity
                order: { from_date: 'DESC' },
                select: {
                    policy: {
                        policy_id: true,
                        policy_name: true,
                        policy_code: true
                    }
                }
            });

            return { status: STATUSCODES.SUCCESS, message: "Policy type list retrieved successfully.", data: policyTypeData };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async getPolicyTypeById(payload: IUser, input: PolicyTypeHeadR): Promise<IApiResponse> {
        try {
            const { policy_type_id } = input;
            const policyType: any | null = await this.policyHeadTypeRepository.findOne({ where: { policy_type_id: Number(policy_type_id) } });
            if (!policyType) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: policyType }
        } catch (error) {
            throw error;
        }
    }

    async getPolicyHeadTypeUserWise(input: PolicyTypeHeadR, payload: IUser): Promise<IApiResponse> {
        try {
            const policyTypeData = await this.policyHeadTypeRepository.createQueryBuilder('policyType')
                .select([
                    'policyType.policy_id',
                    'policyType.from_date',
                    'policyType.to_date',
                    'policyType.claim_type',
                    'policyType.cost_per_km',
                    'DISTINCT(policyType.policy_type_name) as policy_type_name'
                ])
                .where('policyType.policy_id = :ph_id', { ph_id: input.policy_id })
                .orderBy('policyType.from_date', 'DESC')
                .getRawMany();

            return { status: STATUSCODES.SUCCESS, message: "Policy type retrieved successfully.", data: policyTypeData };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async getPolicyForUser(input: PolicyTypeHeadR, payload: IUser): Promise<IApiResponse> {
        try {
            const whereClause: any = {
                policy_type_id: input.policy_type_id,
                from_date: { $lte: input.from_date } // TypeORM equivalent for less than or equal
            };

            if (input.policy_type_name && input.policy_type_name !== 'null' && input.policy_type_name !== 'undefined') {
                whereClause.policy_type_name = input.policy_type_name;
            }

            const policyData = await this.policyHeadTypeRepository.find({
                where: whereClause,
                relations: ['policy'], // Assuming 'policy' is the relation name in the entity
                order: { from_date: 'DESC' },
                take: 1, // Equivalent to `limit: 1`
                withDeleted: true // `paranoid: false` equivalent in Sequelize to include soft-deleted records
            });

            return { status: STATUSCODES.SUCCESS, message: "Lead policy list retrieved successfully.", data: policyData };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async editPolicyHeadType(input: PolicyTypeHeadU, payload: IUser): Promise<IApiResponse> {
        try {
            const { policy_type_id, ...updateData } = input;

            const updateResult = await this.policyHeadTypeRepository.update(policy_type_id, updateData);

            if (updateResult.affected === 0) {
                return { status: STATUSCODES.NOT_FOUND, message: "Policy type not found." };
            }

            return { status: STATUSCODES.SUCCESS, message: "Policy type updated successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async deletePolicyHeadType(input: PolicyTypeHeadD, payload: IUser): Promise<IApiResponse> {
        try {
            const policyHeadType = await this.policyHeadTypeRepository.findOne({
                where: { policy_type_id: input.policy_type_id },
            });
            if (!policyHeadType) {
                return { status: STATUSCODES.NOT_FOUND, message: "Policy Head Type does not exist." };
            }

            await this.policyHeadTypeRepository.softDelete({ policy_type_id: policyHeadType.policy_type_id });
            return { status: STATUSCODES.SUCCESS, message: "Policy head Type deleted successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }
}

export { PolicyHeadTypeService as PolicyHeadType }