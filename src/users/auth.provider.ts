

import { BadRequestException, Injectable, RequestTimeoutException } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcryptjs'
import { LoginDto } from "./dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenType, JWTPayloadType } from "src/utils/types";
import { MailService } from "src/mail/mail.service";
import { randomBytes } from "node:crypto";
import { ConfigService } from "@nestjs/config";

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
        await this.mailService.sendVerifyEmail(email, link)
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
            await this.mailService.sendVerifyEmail(email, link)
            return { message: 'verification email sent successfully, please verify your email' }
        }

        const accessToken = await this.generateJWT({ id: user.id, userType: user.userType })
        // await this.mailService.sendLoginEmail(user.email, user?.userName)

        return { accessToken }
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