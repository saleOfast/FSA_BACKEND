import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { PolicyHead, PolicyHeadRepository } from "../../../../core/DB/Entities/policyHead.entity";
import { STATUSCODES, TimelineEnum, UserRole } from "../../../../core/types/Constent/common";
import { IPolicyHead, PolicyHeadC, PolicyHeadD, PolicyHeadR, PolicyHeadU } from "../../../../core/types/PolicyHeadService/PolicyHeadService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import { Between, IsNull, Not } from "typeorm";

class PolicyHeadService {
    private policyHeadRepository = PolicyHeadRepository();
    private userRespositry = UserRepository()

    constructor() { }

    async createPolicyHead(input: PolicyHeadC, payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const user = await this.userRespositry.findOne({ where: { emp_id } });
            if (!user) {
                return { status: STATUSCODES.NOT_FOUND, message: "User Not Found." };
            }
            const existingPolicy = await this.policyHeadRepository.findOne({
                where: {
                    policy_name: input.policy_name,
                }
            });

            if (existingPolicy) {
                return { status: STATUSCODES.CONFLICT, message: "Policy head type already exists." };
            }
            let count: number = await this.policyHeadRepository.count()
            input.policy_code = `PH_${count + 1}`
            let newPolicy = await this.policyHeadRepository.save(input);

            return { status: STATUSCODES.SUCCESS, message: "Policy type created successfully.", data: newPolicy };
        } catch (error) {
            throw error;
        }
    }

    async getPolicyHead(input: PolicyHeadR, payload: IUser): Promise<IApiResponse> {
        try {
            const policyHeadList = await this.policyHeadRepository.find();
            return { status: STATUSCODES.SUCCESS, message: "Policy list retrieved successfully.", data: policyHeadList };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

      async getPolicyHeadById(payload: IUser, input: PolicyHeadR): Promise<IApiResponse> {
            try {
                const { policy_id } = input;
                const policy: any | null = await this.policyHeadRepository.findOne({ where: { policy_id: Number(policy_id) } });
                if (!policy) {
                    return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
                }
    
                return { message: "Success.", status: STATUSCODES.SUCCESS, data: policy }
            } catch (error) {
                throw error;
            }
        }
    
        async editPolicyHead(input: PolicyHeadU, payload: IUser): Promise<IApiResponse> {
            try {
                if (input.policy_id) {
                    const existingPolicy = await this.policyHeadRepository.findOne({
                        where: { policy_id: input.policy_id },
                    });
                    if (!existingPolicy) {
                        return { status: STATUSCODES.CONFLICT, message: "Policy head does not exists." };
                    }
                    const existingPolicyName = await this.policyHeadRepository.findOne({
                        where: {
                            policy_id: Not(input.policy_id),
                            policy_name: input.policy_name,
                        },
                    });
                    if (existingPolicyName) {
                        return { status: STATUSCODES.CONFLICT, message: "Policy head name already exists." };
                    }
    
                    await this.policyHeadRepository.update({ policy_id: input.policy_id }, input);
                }
    
    
                return { status: STATUSCODES.SUCCESS, message: "Policy head updated successfully." };
            } catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        }

    async deletePolicyHead(input: PolicyHeadD, payload: IUser): Promise<IApiResponse> {
        try {
            const policyHead = await this.policyHeadRepository.findOne({
                where: { policy_id: input.policy_id },
            });

            if (!policyHead) {
                return { status: STATUSCODES.NOT_FOUND, message: "Policy head does not exist." };
            }
            await this.policyHeadRepository.softDelete({ policy_id: policyHead.policy_id });
            return { status: STATUSCODES.SUCCESS, message: "Policy head deleted successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

}

export { PolicyHeadService as PolicyHead }