import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcryptjs'
import { LoginDto } from "./dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenType, JWTPayloadType } from "src/utils/types";

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

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        let newUser = this.usersRepository.create({
            email,
            userName,
            password: hashedPassword
        })
        newUser = await this.usersRepository.save(newUser)
        const accessToken = await this.generateJWT({ id: newUser.id, userType: newUser.userType })

        return { accessToken }
    }

    public getAll() {
        return this.usersRepository.find()
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

    public async getCurrentUser(id: number) {
        const user = await this.usersRepository.findOne({ where: { id } })
        if (!user) throw new NotFoundException("User Not Found")
        return user
    }


    public async getOneBy(id: number) {

        const user = await this.usersRepository.findOne({ where: { id } })
        if (!user) throw new NotFoundException("User Not Found")
        return user
    }

    public async update(id: number, dto: UpdateUserDto) {

        const user = await this.getOneBy(id)
        if (!user) throw new NotFoundException("User Not Found")
        user.userName = dto.userName ?? user.userName
        user.email = dto.email ?? user.email
        user.password = dto.password ?? user.password
    }

    public async delete(id: number) {
        const user = await this.getOneBy(id)
        if (!user) throw new NotFoundException("User Not Found")
        await this.usersRepository.remove(user)
        return { message: 'product deleted successfully' }
    }



    private async generateJWT(payload: JWTPayloadType): Promise<string> {

        return this.jwtService.signAsync(payload)
    }
}