import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('Users')
export class User {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({unique: true})
    email: string;

    @Column()
    hashedpassword: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}