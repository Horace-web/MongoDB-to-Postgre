import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Order } from "./Order";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ nullable: true })
    age!: number;

    @Column("jsonb", { nullable: true }) // Pour stocker l'adresse comme JSON
    address!: {
        street: string;
        city: string;
        zipCode: string;
    };

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    // Relation avec les commandes
    @OneToMany(() => Order, order => order.user)
    orders!: Order[];
}