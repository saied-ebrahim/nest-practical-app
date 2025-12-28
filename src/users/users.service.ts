import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>) { }


    public async createUser(dto: CreateUserDto) {
        const newUser = this.usersRepository.create(dto)
        return await this.usersRepository.save(newUser)
    }

    public getAll() {
        return this.usersRepository.find()
    }

    public async getOneBy(id: number) {

        const user = await this.usersRepository.findOne({ where: { id } })
        if (!user) throw new NotFoundException("User Not Found")
        return user
    }

    public async update(id: number, dto: UpdateUserDto) {

        const user = await this.getOneBy(id)
        if (!user) throw new NotFoundException("User Not Found")
        user.firstName = dto.firstName ?? user.firstName
        user.lastName = dto.lastName ?? user.lastName
        user.email = dto.email ?? user.email
        user.password = dto.password ?? user.password
    }

    public async delete(id: number) {
        const user = await this.getOneBy(id)
        if (!user) throw new NotFoundException("User Not Found")
        await this.usersRepository.remove(user)
        return { message: 'product deleted successfully' }
    }




}