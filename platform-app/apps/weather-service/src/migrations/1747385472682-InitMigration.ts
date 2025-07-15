import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1747385472682 implements MigrationInterface {
  name = 'Init1747385472682';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "weather" ("id" SERIAL PRIMARY KEY, "city" VARCHAR NOT NULL, "temperature" FLOAT NOT NULL, "humidity" FLOAT NOT NULL, "description" VARCHAR NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now());`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "weather"`);
  }
}
