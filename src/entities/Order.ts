import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Order {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, user => user.orders, { nullable: true }) // Ajout de nullable: true
    @JoinColumn({ name: "userId" })
    user!: User | null;  // Modifié pour accepter null

    @Column("jsonb")
    products!: Array<{
        productId: string;
        quantity: number;
    }>;

    @Column("decimal", { precision: 10, scale: 2 })
    total!: number;

    @Column()
    status!: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    orderDate!: Date;
}