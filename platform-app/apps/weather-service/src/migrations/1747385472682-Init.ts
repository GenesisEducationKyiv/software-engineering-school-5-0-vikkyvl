import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1747385472682 implements MigrationInterface {
  name = 'Init1747385472682';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "weather" ("id" SERIAL NOT NULL, "city" character varying NOT NULL, "temperature" double precision NOT NULL, "humidity" double precision NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_af9937471586e6798a5e4865f2d" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "weather"`);
  }
}
