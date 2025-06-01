import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1747588867322 implements MigrationInterface {
    name = 'InitMigration1747588867322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "city" character varying NOT NULL, "frequency" character varying NOT NULL, "confirmed" boolean NOT NULL DEFAULT false, "token" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "subscriptions"`);
    }

}
