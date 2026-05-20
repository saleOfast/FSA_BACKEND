import bcrypt from 'bcryptjs';
import { generateToken, generateForgotPasswordToken, verifyForgotPasswordToken} from '../../../../core/helper/verifyToken';
import { emailGenerator } from '../../../../core/helper/sendEmail';
import { UserRepository, User } from '../../../../core/DB/Entities/User.entity';
import { Profile } from '../../../../core/DB/Entities/profile.entity';
import { IUser, Login, SignUp as ISignUp, ForgetPassword } from '../../../../core/types/AuthService/AuthService';
import { UserRole } from '../../../../core/types/Constent/common';
import { IApiResponse } from '../../../../core/types/Constent/commonService';
import { STATUSCODES } from '../../../../core/types/Constent/common';
import ProfileController from '../profileController/profile.controller';

// const { privateKey, expiry } = process.env;
const { forgotPasswordPrivateKey, forgotPasswordExpiry } = process.env;
import jwt from "jsonwebtoken";
interface SignUp extends Omit<ISignUp, 'role'> {
//   role: UserRole;
  profileId?: number;
}

const salt = bcrypt.genSaltSync(10);

const userController = {
    login: async (input: Login): Promise<IApiResponse> => {
    try {

        const {
            phone: inputPhone,
            password: inputPassword
        } = input;

        const user: IUser | null = await UserRepository().findOne({
            where: {
                phone: inputPhone,
                isDeleted: false
            },
            relations: ["profile"]
        });

        if (!user) {
            return {
                status: STATUSCODES.NOT_FOUND,
                message: "User Not Found."
            };
        }

        const isMatch: boolean = await bcrypt.compare(
            inputPassword,
            user.password
        );

        if (!isMatch) {
            return {
                status: STATUSCODES.BAD_REQUEST,
                message: "Invalid Password"
            };
        }

        const token = await generateToken(
            JSON.parse(
                JSON.stringify({
                    id: user.emp_id,
                    username: user.username,
                    email: user.email,
                    role: user.roleId
                })
            )
        );

        const { password, ...userData } = user;

        let profileWithPermissions = null;
        if (user.profileId) {
            profileWithPermissions =
                await ProfileController.getProfileWithPermissions(user.profileId);
        }

        return {
            status: STATUSCODES.SUCCESS,
            message: "Success.",
            data: {
                accessToken: token,
                user: {
                    ...userData,
                    profile: profileWithPermissions
                }
            }
        };

    } catch (error) {
        throw error;
    }
},


  createUser: async (input: SignUp): Promise<IApiResponse> => {

    try {

        const {
            firstname,
            middlename,
            lastname,
            username,
            email,
            password,
            active,
            country,
            state,
            city,
            region,
            pincode,
            street,
            phone,
            mobile,
            department,
            division,
            team,
            vertical,
            title,
            language,
            timeZone,
            employeeId,
            joining_date,
            resignationDate,
            managerId,
            delegatedApproverId,
            roleId,
            profileId,
            // role
        } = input;

        const existingUser = await UserRepository().findOne({
            where: [
                { phone },
                { username },
                { employeeId }
            ]
        });

        if (existingUser) {
            return {
                status: STATUSCODES.DATABASE_DUPLICATE_ERROR_CODE,
                message: "User Already Exists."
            };
        }

        const hashPassword = bcrypt.hashSync(password, salt);

        const newUser = new User();

        newUser.firstname = firstname;
        newUser.middlename = middlename!;
        newUser.lastname = lastname;

        newUser.username = username;

        newUser.email = email!;

        newUser.password = hashPassword;

        newUser.active = active ?? true;

        newUser.country = country!;
        newUser.state = state!;
        newUser.city = city!;
        newUser.region = region!;
        newUser.pincode = pincode!;
        newUser.street = street!;

        newUser.phone = phone!;
        newUser.mobile = mobile!;

        newUser.department = department!;
        newUser.division = division!;
        newUser.team = team!;
        newUser.vertical = vertical!;
        newUser.title = title!;

        newUser.language = language!;
        newUser.timeZone = timeZone!;
        newUser.employeeId = employeeId!;

        newUser.joining_date = joining_date!;
        newUser.resignationDate = resignationDate!;

        newUser.managerId = managerId!;
        newUser.delegatedApproverId = delegatedApproverId!;

        newUser.roleId = roleId!;

        // newUser.role = roleId;

        if (profileId) {

            const profile = await UserRepository().manager.findOne(Profile, {
                where: { profileId,isDeleted: false }
            });

            if (!profile) {
                return {
                    status: STATUSCODES.BAD_REQUEST,
                    message: "Profile Not Found"
                };
            }

            newUser.profile = profile;
        }

        const savedUser = await UserRepository().save(newUser);

        const userWithRelations = await UserRepository().findOne({
            where: { emp_id: savedUser.emp_id, isDeleted: false },
        });

        let profileWithPermissions: Profile | null = null;
        if (profileId) {
            profileWithPermissions = await ProfileController.getProfileWithPermissions(profileId);
        }

        const source = userWithRelations ?? savedUser;
        const { password: _pw, ...safeUser } = source;

        return {
            status: STATUSCODES.SUCCESS,
            message: "Success.",
            data: {
                ...safeUser,
                profile: profileWithPermissions,
            },
        };

    } catch (error) {
        throw error;
    }
},

createUsers: async (inputs: SignUp[]): Promise<IApiResponse> => {

    const newUsers: User[] = [];

    const skippedUsers: string[] = [];

    const processedPhones: Set<string> = new Set();

    const processedUsernames: Set<string> = new Set();

    for (const input of inputs) {

        const {
            firstname,
            middlename,
            lastname,
            username,
            email,
            password,
            active,
            country,
            state,
            city,
            region,
            pincode,
            street,
            phone,
            mobile,
            department,
            division,
            team,
            vertical,
            title,
            language,
            timeZone,
            employeeId,
            joining_date,
            resignationDate,
            managerId,
            delegatedApproverId,
            roleId,
            profileId,
            // role
        } = input;

        if (processedPhones.has(phone!)) {
            skippedUsers.push(
                `User with phone ${phone} already exists in input`
            );
            continue;
        }

        if (processedUsernames.has(username)) {
            skippedUsers.push(
                `User with username ${username} already exists in input`
            );
            continue;
        }

        processedPhones.add(phone!);

        processedUsernames.add(username);

        const existingUser = await UserRepository().findOne({
            where: [
                { phone: phone! },
                { username: username },
                { employeeId: employeeId! }
            ]
        });

        if (existingUser) {
            skippedUsers.push(
                `User with phone ${phone} already exists`
            );
            continue;
        }

        let profile: Profile | null = null;

        if (profileId) {

            profile = await UserRepository().manager.findOne(Profile, {
                where: { profileId }
            });

            if (!profile) {
                skippedUsers.push(
                    `Profile not found for user ${phone}`
                );
                continue;
            }
        }

        const hashPassword = bcrypt.hashSync(password, salt);

        const newUser = new User();

        newUser.firstname = firstname!;
        newUser.middlename = middlename!;
        newUser.lastname = lastname!;

        newUser.username = username;

        newUser.email = email!;

        newUser.password = hashPassword;

        newUser.active = active ?? true;

        newUser.country = country!;
        newUser.state = state!;
        newUser.city = city!;
        newUser.region = region!;
        newUser.pincode = pincode!;
        newUser.street = street!;

        newUser.phone = phone!;
        newUser.mobile = mobile!;

        newUser.department = department!;
        newUser.division = division!;
        newUser.team = team!;
        newUser.vertical = vertical!;
        newUser.title = title!;

        newUser.language = language!;
        newUser.timeZone = timeZone!;

        newUser.employeeId = employeeId!;

        newUser.joining_date = joining_date!;
        newUser.resignationDate = resignationDate!;

        newUser.managerId = managerId!;
        newUser.delegatedApproverId = delegatedApproverId!;

        newUser.roleId = roleId!;

        // newUser.role = role;

        if (profile) {
            newUser.profile = profile;
        }

        newUsers.push(newUser);
    }

    try {

        if (newUsers.length > 0) {
            await UserRepository().save(newUsers);
        }

        return {
            status: STATUSCODES.SUCCESS,
            message:
                skippedUsers.length > 0
                    ? `Users created successfully. Skipped users: ${skippedUsers.join(", ")}`
                    : "All users created successfully."
        };

    } catch (error) {
        throw error;
    }
},

    // verifyEmail: async (userId: number) => {
    //     try {
    //         const user: IUser | null = await UserRepository().findOne({ where: { email: userId } })

    //         // const user = await EmergeInfluencerModel.userTempModel.findOne({ _id: userId });
    //         const emailConfirmed = true;
    //         if (user) {
    //             const { firstname, lastname, email, password } = user;
    //             await UserRepository().save({ firstname, lastname, email, password, emailConfirmed });
    //             // const userModel = new EmergeInfluencerModel.userModel({ firstname, lastname, email, password, emailConfirmed });
    //             // await userModel.save();

    //             // await EmergeInfluencerModel.userTempModel.deleteOne({ _id: user.id });
    //             return { error: false, status: 200, message: "Success.", data: [] }
    //         } else {
    //             return { error: { error: true, status: 404, message: "User Not Found.", data: [] } }
    //         }
    //     } catch (error) {
    //         throw error;
    //     }
    // },

    // token: async (input: any, refreshToken: string) => {
    //     try {
    //         // const user = await EmergeInfluencerModel.userModel.findOne({ email: input.email });
    //         const user : IUser | null = await UserRepository().findOne({ email: input.email })
    //         const existingRefreshToken = user.security.token;
    //         if (await existingRefreshToken.some(async (token: any) => { token.refreshToken == refreshToken })) {
    //             // Generate New Access Token
    //             const token = await generateToken(JSON.parse(JSON.stringify(user)));
    //             return { error: false, status: 200, message: 'Success.', data: null, accessToken: token }
    //         } else {
    //             return { error: true, status: 401, message: "Invalid Refresh Token." }
    //         }
    //     } catch (error) {
    //         throw error;
    //     }
    // },

    // verifyEmail: async (userId: number) => {
    //     try {
    //         const user: IUser | null = await UserRepository().findOne({ where: { id: userId } });
    //         const emailConfirmed = true;
    //         if (user) {
    //             const { firstname, lastname, email, password } = user;
    //             await UserRepository().save({ ...user, emailConfirmed });
    //             return { error: false, status: 200, message: "Success.", data: [] };
    //         } else {
    //             return { error: { error: true, status: 404, message: "User Not Found.", data: [] } };
    //         }
    //     } catch (error) {
    //         throw error;
    //     }
    // },

    // token: async (input: any, refreshToken: string) => {
    //     try {
    //         const user: IUser | null = await UserRepository().findOne({ where: { email: input.email } });
    //         if (user && user.security.token.some((token: any) => token.refreshToken === refreshToken)) {
    //             const token = await generateToken(JSON.parse(JSON.stringify(user)));
    //             return { error: false, status: 200, message: 'Success.', data: null, accessToken: token };
    //         } else {
    //             return { error: true, status: 401, message: "Invalid Refresh Token." };
    //         }
    //     } catch (error) {
    //         throw error;
    //     }
    // },

    forgotPassword: async (input: ForgetPassword): Promise<IApiResponse> => {
    try {

        const { phone, joining_date } = input;

        const user: IUser | null = await UserRepository().findOne({
            where: {
                phone,
                isDeleted: false
            },
            select: [
                "emp_id",
                "firstname",
                "lastname",
                "phone",
                "joining_date",
                "roleId"
            ]
        });

        if (!user) {
            return {
                status: STATUSCODES.BAD_REQUEST,
                message: "User Invalid",
                data: null
            };
        }

        const inputJoiningDate = new Date(joining_date);
        const userJoiningDate = new Date(user.joining_date!);

        const isJoiningDateValid =
            inputJoiningDate.getDate() === userJoiningDate.getDate() &&
            inputJoiningDate.getMonth() === userJoiningDate.getMonth() &&
            inputJoiningDate.getFullYear() === userJoiningDate.getFullYear();

        if (!isJoiningDateValid) {
            return {
                status: STATUSCODES.BAD_REQUEST,
                message: "Wrong Joining Date",
                data: null
            };
        }

const token = await generateForgotPasswordToken({
    id: user.emp_id,
    role: user.roleId!
});

const resetLink =
`http://localhost:4000/reset-password/${user.emp_id}/${token}`;

return {
   status: STATUSCODES.SUCCESS,
   message: "Success",
   data: {
      resetLink
   }
};
    } catch (error) {
        throw error;
    }
},
    // forgotRedirect: async (input: any): Promise<IApiResponse> => {
    //     try {
    //         const { id, token } = input;
    //         const user: IUser | null = await UserRepository().findOne({ where: { emp_id: Number(id) } });
    //         if (user) {
    //             return { status: STATUSCODES.SUCCESS, message: 'SUCCESS.', data: null };
    //         } else {
    //             return { status: STATUSCODES.BAD_REQUEST, message: 'INVALID USER.', data: null };
    //         }
    //     } catch (error) {
    //         throw error;
    //     }
    // },

resetPasswordConfirm: async (input: any): Promise<IApiResponse> => {
    try {

        const {
            empId,
            token,
            password,
            confirmPassword
        } = input;

        // CHECK PASSWORD MATCH
        if (password !== confirmPassword) {
            return {
                status: STATUSCODES.BAD_REQUEST,
                message: "Password do not match",
                data: null
            };
        }

        console.log("TOKEN RECEIVED ====================================>", token);
        // VERIFY TOKEN
 const decoded: any =
            verifyForgotPasswordToken(token);

        console.log("DECODED TOKEN =====>", decoded);


console.log("DECODED TOKEN ==================================>", decoded);
        // CHECK TOKEN USER MATCH
        if (decoded.id != empId) {
            return {
                status: STATUSCODES.BAD_REQUEST,
                message: "Invalid Token",
                data: null
            };
        }

        // CHECK USER EXISTS
        const user: IUser | null = await UserRepository().findOne({
            where: {
                emp_id: empId,
                isDeleted: false
            }
        });

        if (!user) {
            return {
                status: STATUSCODES.BAD_REQUEST,
                message: "User Not Found",
                data: null
            };
        }

        // HASH PASSWORD
        const hashPassword = bcrypt.hashSync(password, salt);

        // UPDATE PASSWORD
        await UserRepository()
            .createQueryBuilder()
            .update(User)
            .set({
                password: hashPassword
            })
            .where({
                emp_id: empId
            })
            .execute();

        return {
            status: STATUSCODES.SUCCESS,
            message: "PASSWORD_RESET_SUCCESSFULLY",
            data: null
        };

    } catch (error: any) {

        // TOKEN EXPIRED
        if (error.name === "TokenExpiredError") {
            return {
                status: STATUSCODES.BAD_REQUEST,
                message: "Token Expired",
                data: null
            };
        }

        // INVALID TOKEN
        if (error.name === "JsonWebTokenError") {
            return {
                status: STATUSCODES.BAD_REQUEST,
                message: "Invalid Token",
                data: null
            };
        }

        throw error;
    }
},

    // forgotPassword: async (input: any) => {
    //     try {
    //         const { email } = input;
    //         const user = await EmergeInfluencerModel.userModel.findOne({ email: email });
    //         if (user) {
    //             const passwordResetToken = uuidv4();
    //             const expiresIn = moment().add(30, 'm').toISOString();

    //             // Update user with password token
    //             await EmergeInfluencerModel.userModel.findOneAndUpdate({ email: email }, {
    //                 $set: {
    //                     'security.passwordReset': {
    //                         token: passwordResetToken,
    //                         provisionalPassword: null,
    //                         expires: expiresIn,
    //                     },
    //                 },
    //             });
    //             const url = `${process.env.HOST}/authentication/reset-password/${passwordResetToken}`;
    //             const name = `${user.firstName} ${user.lastName}`
    //             const html = await resetPassword(url, name);
    //             /* Generate Reset Password Email */
    //             await emailGenerator(email, "Emerge Forgot Password ✔", html);
    //             // console.log(passwordResetToken, 'password reset Token', emailRes)
    //             return { success: { error: false, status: 200, message: 'PASSWORD_RESET_EMAIL_SENT', data: null } }
    //         } else {
    //             throw "INVALID USER.";
    //         }
    //     } catch (error) {
    //         throw error;
    //     }
    // },

    // resetPasswordConfirm: async (input: any) => {
    //     try {
    //         const { password, email } = input;
    //         const user = await EmergeInfluencerModel.userModel.findOne({ email: email });
    //         if (user) {
    //             const check = new Date(user.security.passwordReset.expires).getTime()
    //             console.log(new Date().getTime() <= check)
    //             if (new Date().getTime() <= check) {
    //                 const hashPassword = await bcrypt.hashSync(password, salt);
    //                 await EmergeInfluencerModel.userModel.updateOne({ email: email }, {
    //                     $set: {
    //                         'password': hashPassword,
    //                         'security.passwordReset.token': null,
    //                         'security.passwordReset.provisionalPassword': null,
    //                         'security.passwordReset.expiry': null,
    //                     },
    //                 });
    //                 return { success: { error: false, status: 200, message: 'PASSWORD_RESET_SUCCESS', data: null } };
    //             } else {
    //                 await EmergeInfluencerModel.userModel.updateOne({ email: email }, {
    //                     $set: {
    //                         'security.passwordReset.token': null,
    //                         'security.passwordReset.provisionalPassword': null,
    //                         'security.passwordReset.expiry': null,
    //                     },
    //                 });
    //                 return { error: { error: true, status: 401, message: 'PASSWORD_RESET_TOKEN_EXPIRED', data: null } };
    //             }
    //         }
    //     } catch (error) {
    //         throw error;
    //     }
    // },

    // getAllData: async () => {
    //     try {
    //         return await EmergeInfluencerModel.userModel.find();
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}

export { userController };