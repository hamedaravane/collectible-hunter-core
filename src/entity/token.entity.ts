import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class TokenEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created_at: Date;

    @Column()
    creator_address: string;

    @Column()
    creator_profile_address: string;

    @Column({ nullable: true })
    creator_alias: string;

    @Column({ nullable: true })
    creator_twitter: string;

    @Column({ nullable: true })
    creator_email: string;

    @Column({ nullable: true })
    creator_facebook: string;

    @Column({ nullable: true })
    creator_instagram: string;

    @Column({ nullable: true })
    creator_tzdomain: string;

    @Column()
    token_address: string;

    @Column()
    marketplace: string;

    @Column()
    token_image: string;

    @Column()
    token_pk: number;

    @Column()
    mint_date: Date;

    @Column()
    list_date: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    primary_price: number;

    @Column()
    royalty: number;

    @Column()
    editions: number;

    @Column()
    sold_editions: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    sold_rate: number;

    @Column()
    average_collects: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    overall_score: number;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    secondary_price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    price_variation: number;

    @Column({ nullable: true })
    first_secondary_sold_date: Date;
}