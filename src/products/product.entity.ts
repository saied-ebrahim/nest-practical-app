import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, } from "typeorm";


@Entity({ name: "products" })
export class Product {

    @PrimaryGeneratedColumn()
    id: number 
 

    @Column({ type: 'varchar', length: 150 })
    title: string

    @Column()
    description: string

    @Column({ type: 'float' })
    price: number

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date


    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updatedAt: Date



}