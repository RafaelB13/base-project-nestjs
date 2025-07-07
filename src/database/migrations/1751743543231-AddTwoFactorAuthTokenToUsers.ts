import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTwoFactorAuthTokenToUsers1751743543231
  implements MigrationInterface
{
  name = 'AddTwoFactorAuthTokenToUsers1751743543231';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "twoFactorAuthenticationToken" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "twoFactorAuthenticationToken"`,
    );
  }
}
