
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CURRENT_TIMESTAMP } from "src/utils/constants";
import { UserType } from "src/utils/enums";
import { Product } from "src/products/product.entity";
import { Review } from "src/reviews/review.entity";
import { Exclude } from "class-transformer";

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", length: "50", nullable: true })
    userName: string

    @Column({ type: 'enum', enum: UserType, default: UserType.USER })
    userType: string

    @Column({ default: false })
    isAccountVerified: boolean

    @Column({ type: 'varchar', length: "200", unique: true })
    email: string

    @Column()
    @Exclude()
    password: string

    @CreateDateColumn({ type: "timestamp", default: () => CURRENT_TIMESTAMP })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp", default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date

    @OneToMany(() => Product, (product) => product.user)
    products: Product[]

    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[]
}