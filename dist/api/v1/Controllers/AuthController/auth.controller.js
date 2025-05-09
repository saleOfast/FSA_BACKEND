"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const verifyToken_1 = require("../../../../core/helper/verifyToken");
const User_entity_1 = require("../../../../core/DB/Entities/User.entity");
const common_1 = require("../../../../core/types/Constent/common");
const salt = bcryptjs_1.default.genSaltSync(10);
const userController = {
    login: (input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { phone, password } = input;
            const user = yield (0, User_entity_1.UserRepository)().findOne({ where: { phone, isDeleted: false } });
            if (!user) {
                return { status: common_1.STATUSCODES.NOT_FOUND, message: "User Not Found." };
            }
            console.log({ user });
            const isMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                return { status: common_1.STATUSCODES.BAD_REQUEST, message: "Invalid Password" };
            }
            const token = yield (0, verifyToken_1.generateToken)(JSON.parse(JSON.stringify({ id: user.emp_id, email: user.email, role: user.role })));
            return { status: common_1.STATUSCODES.SUCCESS, message: "Success.", data: { accessToken: token } };
        }
        catch (error) {
            throw error;
        }
    }),
    createUser: (input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password, firstname, lastname, age, phone, address, city, state, pincode, zone, joining_date, dob, managerId, role, learningRole } = input;
            const hashPassword = bcryptjs_1.default.hashSync(password, salt);
            const userData = yield (0, User_entity_1.UserRepository)().findOne({ where: { phone } });
            if (!userData) {
                const newUser = new User_entity_1.User();
                newUser.firstname = firstname;
                newUser.lastname = lastname;
                newUser.email = email;
                newUser.password = hashPassword;
                newUser.address = address;
                newUser.city = city;
                newUser.state = state;
                newUser.pincode = pincode;
                newUser.age = age;
                newUser.phone = phone;
                newUser.zone = zone;
                newUser.joining_date = joining_date;
                newUser.dob = dob;
                newUser.managerId = managerId;
                newUser.role = role;
                newUser.learningRole = learningRole;
                yield (0, User_entity_1.UserRepository)().save(newUser);
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            return { status: common_1.STATUSCODES.DATABASE_DUPLICATE_ERROR_CODE, message: "User Already Exists." };
        }
        catch (error) {
            throw error;
        }
    }),
    createUsers(inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUsers = [];
            const skippedUsers = []; // Track skipped users
            const processedPhones = new Set(); // Track unique phone numbers in input
            // Validate and map each input to a User entity
            for (const input of inputs) {
                const { email, password, firstname, lastname, age, phone, address, zone, joining_date, dob, managerId, role, learningRole } = input;
                // Hash the password
                const hashPassword = bcryptjs_1.default.hashSync(password, salt);
                // Check for in-memory duplicates
                if (processedPhones.has(phone)) {
                    skippedUsers.push(`User with phone ${phone} (Duplicate in input)`);
                    continue; // Skip the user if a duplicate is found in the input
                }
                // Mark this phone number as processed
                processedPhones.add(phone);
                // Check if user already exists in the database
                const existingUser = yield (0, User_entity_1.UserRepository)().findOne({ where: { phone } });
                if (existingUser) {
                    skippedUsers.push(`User with phone ${phone} (Already exists in database)`);
                    continue; // Skip the user if they already exist in the database
                }
                // Create new user entity
                const newUser = new User_entity_1.User();
                newUser.firstname = firstname;
                newUser.lastname = lastname;
                newUser.email = email;
                newUser.password = hashPassword;
                newUser.address = address;
                newUser.age = age;
                newUser.phone = phone;
                newUser.zone = zone;
                newUser.joining_date = joining_date;
                newUser.dob = dob;
                newUser.managerId = managerId;
                newUser.role = role;
                newUser.learningRole = learningRole;
                newUsers.push(newUser); // Add the new user to the list of users to be saved
            }
            try {
                // Save all valid users at once
                if (newUsers.length > 0) {
                    yield (0, User_entity_1.UserRepository)().save(newUsers);
                }
                // Construct the response message
                const message = skippedUsers.length > 0
                    ? `Users created successfully. Skipped users: ${skippedUsers.join(', ')}.`
                    : "All users created successfully.";
                return { status: common_1.STATUSCODES.SUCCESS, message };
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
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
    verifyEmail: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield (0, User_entity_1.UserRepository)().findOne({ where: { id: userId } });
            const emailConfirmed = true;
            if (user) {
                const { firstname, lastname, email, password } = user;
                yield (0, User_entity_1.UserRepository)().save(Object.assign(Object.assign({}, user), { emailConfirmed }));
                return { error: false, status: 200, message: "Success.", data: [] };
            }
            else {
                return { error: { error: true, status: 404, message: "User Not Found.", data: [] } };
            }
        }
        catch (error) {
            throw error;
        }
    }),
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
    forgotPassword: (input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, phone, dob } = input;
            // const { empId } = payload;
            const user = yield (0, User_entity_1.UserRepository)().findOne({
                where: { phone, isDeleted: false },
                select: ['emp_id', 'role', 'dob']
            });
            if (!user) {
                // const passwordResetToken = await generateVerifyEmailToken(JSON.parse(JSON.stringify({ id: user.emp_id, email: email })))
                // const url = `${process.env.HOST}/reset-password/${user.emp_id}/${passwordResetToken}/`;
                // const name = `${user.firstname} ${user.lastname}`;
                // const html = await resetPassword(url, name);
                // await emailGenerator(email, "Saleofast Forgot Password ✔", html);
                // return { status: STATUSCODES.SUCCESS, message: 'PASSWORD_RESET_EMAIL_SENT', data: null };
                return { status: common_1.STATUSCODES.BAD_REQUEST, message: 'User Invalid', data: null };
            }
            const inputDob = new Date(dob);
            const userDob = new Date(user.dob);
            // Validate the day, month, and year components
            const isDobValid = inputDob.getDate() === userDob.getDate() &&
                inputDob.getMonth() === userDob.getMonth() &&
                inputDob.getFullYear() === userDob.getFullYear();
            console.log({ isDobValid });
            if (!isDobValid) {
                return { status: common_1.STATUSCODES.BAD_REQUEST, message: 'Wrong Date of Birth', data: null };
            }
            return { status: common_1.STATUSCODES.SUCCESS, message: 'Success', data: user };
        }
        catch (error) {
            throw error;
        }
    }),
    forgotRedirect: (input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id, token } = input;
            const user = yield (0, User_entity_1.UserRepository)().findOne({ where: { emp_id: Number(id) } });
            if (user) {
                return { status: common_1.STATUSCODES.SUCCESS, message: 'SUCCESS.', data: null };
            }
            else {
                return { status: common_1.STATUSCODES.BAD_REQUEST, message: 'INVALID USER.', data: null };
            }
        }
        catch (error) {
            throw error;
        }
    }),
    resetPasswordConfirm: (input) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { password, confirmPassword, empId } = input;
            if (password !== confirmPassword) {
                return { status: common_1.STATUSCODES.BAD_REQUEST, message: 'Password do not match', data: null };
            }
            const hashPassword = bcryptjs_1.default.hashSync(password, salt);
            yield (0, User_entity_1.UserRepository)().createQueryBuilder().update({ password: hashPassword }).where({ emp_id: empId }).execute();
            return { status: common_1.STATUSCODES.SUCCESS, message: 'PASSWORD_RESET_SUCCESSFULLY', data: null };
        }
        catch (error) {
            throw error;
        }
    }),
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
};
exports.userController = userController;
