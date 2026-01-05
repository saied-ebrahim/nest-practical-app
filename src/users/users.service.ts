import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcryptjs'
import { LoginDto } from "./dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenType, JWTPayloadType } from "src/utils/types";
import { UserType } from "src/utils/enums";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService) { }

    /**
     * Create New user
     * @param registerDto data for creating user 
     * @returns jwt (access token)
     */
    public async register(registerDto: RegisterDto): Promise<AccessTokenType> {
        const { email, password, userName } = registerDto;
        const userFromDb = await this.usersRepository.findOne({ where: { email } })
        if (userFromDb) throw new BadRequestException("user already exist")

        const hashedPassword = await this.hashPassword(password)

        let newUser = this.usersRepository.create({
            email,
            userName,
            password: hashedPassword
        })
        newUser = await this.usersRepository.save(newUser)
        const accessToken = await this.generateJWT({ id: newUser.id, userType: newUser.userType })

        return { accessToken }
    }


    /**
     * log in 
     * @param loginDto data for login 
     * @returns JWT (access token)
     */
    public async login(loginDto: LoginDto): Promise<AccessTokenType> {
        const { email, password } = loginDto
        const user = await this.usersRepository.findOne({ where: { email } })
        if (!user) throw new BadRequestException("invalid email or password ")
        const passwordCheck = await bcrypt.compare(password, user.password)
        if (!passwordCheck) throw new BadRequestException("invalid email or password ")
        const accessToken = await this.generateJWT({ id: user.id, userType: user.userType })

        return { accessToken }
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
            user.password = await this.hashPassword(password)
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




    private async generateJWT(payload: JWTPayloadType): Promise<string> {

        return this.jwtService.signAsync(payload)
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    }
}