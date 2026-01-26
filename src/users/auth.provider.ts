

import { BadRequestException, Injectable, RequestTimeoutException } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcryptjs'
import { LoginDto } from "./dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { JWTPayloadType } from "src/utils/types";
import { MailService } from "src/mail/mail.service";
import { randomBytes } from "node:crypto";
import { ConfigService } from "@nestjs/config";
import { ResetPasswordDto } from "./dtos/reset-password.dto";

@Injectable()
export class AuthProvider {
    @InjectRepository(User) private readonly usersRepository: Repository<User>
    constructor(private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        private readonly config: ConfigService
    ) { }

    /**
     * Create New user
     * @param registerDto data for creating user 
     * @returns jwt (access token)
     */
    public async register(registerDto: RegisterDto) {
        const { email, password, userName } = registerDto;
        const userFromDb = await this.usersRepository.findOne({ where: { email } })
        if (userFromDb) throw new BadRequestException("user already exist")

        const hashedPassword = await this.hashPassword(password)

        let newUser = this.usersRepository.create({
            email,
            userName,
            password: hashedPassword,
        })

        newUser = await this.usersRepository.save(newUser)
        newUser.verificationToken = randomBytes(32).toString('hex')
        await this.usersRepository.save(newUser);
        const link = this.generateLink(newUser.id, newUser.verificationToken)
        await this.mailService.sendVerifyEmailTemplate(email, link)
        return { message: 'verification email sent successfully, please verify your email' }
    }


    /**
     * log in 
     * @param loginDto data for login 
     * @returns JWT (access token)
     */
    public async login(loginDto: LoginDto) {
        const { email, password } = loginDto

        const user = await this.usersRepository.findOne({ where: { email } })

        if (!user) throw new BadRequestException("invalid email or password ")

        const passwordCheck = await bcrypt.compare(password, user.password)
        if (!passwordCheck) throw new BadRequestException("invalid email or password ")
        if (!user.isAccountVerified) {
            let verificationToken = user.verificationToken
            if (!verificationToken) {
                user.verificationToken = randomBytes(32).toString('hex')
                const result = await this.usersRepository.save(user)
                verificationToken = result.verificationToken
            }
            const link = this.generateLink(user.id, verificationToken)
            await this.mailService.sendVerifyEmailTemplate(email, link)
            return { message: 'verification email sent successfully, please verify your email' }
        }

        const accessToken = await this.generateJWT({ id: user.id, userType: user.userType })
        // await this.mailService.sendLoginEmail(user.email, user?.userName)

        return { accessToken }
    }

    public async sendResetPasswordLink(email: string) {
        const user = await this.usersRepository.findOne({ where: { email } })
        if (!user) throw new BadRequestException("user with this email not found")

        user.resetPasswordToken = randomBytes(32).toString('hex')
        const result = await this.usersRepository.save(user)
        const resetPasswordLink = `${this.config.get<string>("CLIENT_DOMAIN")}/reset-password/${user.id}/${result.resetPasswordToken}`
        await this.mailService.sendResetPasswordEmailTemplate(email, resetPasswordLink)
        return { message: "Password reset link sent to your email, check your inbox" }
    }

    /**
    * 
    * @param userId
    * @param resetPasswordToken
    * @returns
    */
    public async getResetPasswordLink(userId: number, resetPasswordToken: string) {
        const user = await this.usersRepository.findOne({ where: { id: userId } })
        if (!user) throw new BadRequestException('user with this email not found')

        if (user.resetPasswordToken === null || user.resetPasswordToken !== resetPasswordToken)
            throw new BadRequestException("invalid link")

        return { message: 'valid link' }
    }

    public async resetPassword(dto: ResetPasswordDto) {
        const { newPassword, resetPasswordToken, userId } = dto
        const user = await this.usersRepository.findOne({ where: { id: userId } })
        if (!user) throw new BadRequestException('user with this email not found')

        if (user.resetPasswordToken === null || user.resetPasswordToken !== resetPasswordToken)
            throw new BadRequestException("invalid link")
        const hashedPassword = await this.hashPassword(newPassword)
        user.password = hashedPassword
        user.resetPasswordToken = null
        await this.usersRepository.save(user)
        return { message: "password reset successfully , please log in " }
    }


    public async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    }


    private async generateJWT(payload: JWTPayloadType): Promise<string> {
        return this.jwtService.signAsync(payload)
    }


    public generateLink(id: number, verificationToken: string | null) {
        return `${this.config.get<string>('DOMAIN')}/api/users/verify-email/${id}/${verificationToken}`
    }

}