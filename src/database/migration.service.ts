import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Executa todas as migrations pendentes
   */
  async runMigrations(): Promise<void> {
    try {
      this.logger.log('Iniciando execução de migrations...');
      const migrations = await this.dataSource.runMigrations();

      if (migrations.length === 0) {
        this.logger.log('Nenhuma migration pendente encontrada');
      } else {
        this.logger.log(
          `${migrations.length} migration(s) executada(s) com sucesso:`,
        );
        migrations.forEach((migration) => {
          this.logger.log(`- ${migration.name}`);
        });
      }
    } catch (error) {
      this.logger.error('Erro ao executar migrations:', error);
      throw error;
    }
  }

  /**
   * Reverte a última migration
   */
  async revertLastMigration(): Promise<void> {
    try {
      this.logger.log('Revertendo última migration...');
      await this.dataSource.undoLastMigration();
      this.logger.log('Migration revertida com sucesso');
    } catch (error) {
      this.logger.error('Erro ao reverter migration:', error);
      throw error;
    }
  }

  /**
   * Mostra o status das migrations
   */
  async showMigrationStatus(): Promise<boolean> {
    try {
      const hasPending = await this.dataSource.showMigrations();
      return hasPending;
    } catch (error) {
      this.logger.error('Erro ao mostrar status das migrations:', error);
      throw error;
    }
  }

  /**
   * Verifica se há migrations pendentes
   */
  async hasPendingMigrations(): Promise<boolean> {
    try {
      const hasPending = await this.dataSource.showMigrations();
      return hasPending;
    } catch (error) {
      this.logger.error('Erro ao verificar migrations pendentes:', error);
      return false;
    }
  }
}
