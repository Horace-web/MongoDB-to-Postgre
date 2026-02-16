import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column("decimal", { precision: 10, scale: 2 })
    price!: number;

    @Column()
    category!: string;

    @Column()
    inStock!: boolean;

    @Column("text", { array: true, nullable: true }) // Tableau de tags
    tags!: string[];
}