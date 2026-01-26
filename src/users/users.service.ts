import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { LoginDto } from "./dtos/login.dto";
import { AccessTokenType, JWTPayloadType } from "src/utils/types";
import { UserType } from "src/utils/enums";
import { AuthProvider } from "./auth.provider";
import { join } from "node:path";
import { cwd } from "node:process";
import { unlinkSync } from "node:fs";
import { ResetPasswordDto } from "./dtos/reset-password.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        private readonly authProvider: AuthProvider,
    ) { }

    public async register(registerDto: RegisterDto) {
        return this.authProvider.register(registerDto)
    }


    public async login(loginDto: LoginDto) {
        return this.authProvider.login(loginDto)
    }
    public async sendResetPassword(email: string) {
        return this.authProvider.sendResetPasswordLink(email)
    }
    public getResetPassword(userId: number, resetPasswordToken: string) {
        return this.authProvider.getResetPasswordLink(userId, resetPasswordToken)
    }

    public resetPassword(dto: ResetPasswordDto) {
        return this.authProvider.resetPassword(dto)
    }

    public async verifyEmail(id: number, token: string) {
        try {
            // const payload = await this.jwtService.verifyAsync(token, {
            //     secret: this.config.get('JWT_SECRET'),
            // });
            // const userId = payload.id;
            const user = await this.usersRepository.findOne({ where: { id } });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            if (user.verificationToken !== token) {
                throw new BadRequestException('Invalid or expired verification token');
            }
            user.isAccountVerified = true;
            user.verificationToken = null;
            await this.usersRepository.save(user);
            return { message: 'Email verified successfully. You can now login.' };
        } catch (error) {
            throw new BadRequestException('Invalid or expired token');
        }
    }


    public async getCurrentUser(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } })
        if (!user) throw new NotFoundException("User Not Found")
        return user
    }



    public getAll(): Promise<User[]> {
        return this.usersRepository.find()
    }

    public async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const { password, userName } = updateUserDto

        const user = await this.usersRepository.findOne({ where: { id } })
        if (!user) throw new NotFoundException("User Not Found")
        user.userName = userName ?? user.userName
        if (password) {
            user.password = await this.authProvider.hashPassword(password)
        }

        return this.usersRepository.save(user)
    }

    public async delete(userId: number, payload: JWTPayloadType) {
        const user = await this.getCurrentUser(userId)
        if (user.id === payload.id || payload.userType === UserType.ADMIN) {

            await this.usersRepository.remove(user)
            return { message: 'user deleted successfully' }
        }

        throw new ForbiddenException("access denied, you are not allowed ")

    }

    public async setProfileImage(userId: number, newProfileImage: string) {
        const user = await this.getCurrentUser(userId)
        if (user.profileImage === null) {
            user.profileImage = newProfileImage
        } else {
            await this.removeProfileImage(userId)
            user.profileImage = newProfileImage
        }
        return this.usersRepository.save(user)
    }

    public async removeProfileImage(userId: number) {
        console.log("user")
        const user = await this.getCurrentUser(userId)
        console.log(user)

        // if (user.profileImage === null)
        //     throw new BadRequestException('there is no profile image')
        const imagePath = join(cwd(), `./uploads/users/${user.profileImage}`)
        console.log(imagePath)
        unlinkSync(imagePath)
        user.profileImage = null;
        return this.usersRepository.save(user)
    }

}