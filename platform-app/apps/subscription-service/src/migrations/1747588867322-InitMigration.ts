import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1747588867322 implements MigrationInterface {
  name = 'InitMigration1747588867322';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "subscriptions" ("id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(), "email" varchar NOT NULL, "city" varchar NOT NULL, "frequency" varchar NOT NULL, "confirmed" boolean NOT NULL DEFAULT false, "token" varchar NOT NULL, "created_at" timestamp NOT NULL DEFAULT now(), "updated_at" timestamp NOT NULL DEFAULT now());`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "subscriptions"`);
  }
}
