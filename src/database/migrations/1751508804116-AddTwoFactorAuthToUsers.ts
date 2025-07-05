import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTwoFactorAuthToUsers1751508804116
  implements MigrationInterface
{
  name = 'AddTwoFactorAuthToUsers1751508804116';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_USERS_EMAIL"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "isTwoFactorAuthenticationEnabled" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "twoFactorAuthenticationSecret" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "twoFactorAuthenticationSecret"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "isTwoFactorAuthenticationEnabled"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_USERS_EMAIL" ON "users" ("email") `,
    );
  }
}
