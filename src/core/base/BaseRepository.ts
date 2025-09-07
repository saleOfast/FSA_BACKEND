import { Repository, DataSource, EntityTarget, FindOptionsWhere, ObjectLiteral, DeepPartial } from 'typeorm';
import { DbConnections } from '../DB/postgresdb';

export class BaseRepository<T extends ObjectLiteral> {
  protected repo: Repository<T>;
  protected dataSource: DataSource;

  private entity: EntityTarget<T>;
  private maxRetries = 5;
  private retryDelay = 1000; // 1 second

  constructor(entity: EntityTarget<T>, repository?: Repository<T>) {
    this.entity = entity;
    if (repository) {
      this.repo = repository;
      this.dataSource = repository.manager.connection;
    } else {
      this.initializeRepository();
    }
  }

  private initializeRepository() {
    try {
      this.dataSource = DbConnections.AppDbConnection.getConnection();
      this.repo = this.dataSource.getRepository(this.entity);
    } catch (error) {
      // Repository will be initialized on first access
      this.repo = null as any;
    }
  }

  protected async ensureRepositoryInitialized() {
    if (!this.repo) {
      let retries = 0;
      while (retries < this.maxRetries) {
        try {
          this.initializeRepository();
          if (this.repo) return;
        } catch (error) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          retries++;
        }
      }
      throw new Error('Failed to initialize repository after multiple attempts');
    }
  }

  async create(data: DeepPartial<T>): Promise<T> {
    await this.ensureRepositoryInitialized();
    const entity = this.repo.create(data as DeepPartial<T>);
    return await this.repo.save(entity);
  }

  async findById(id: number, relations?: string[]): Promise<T | null> {
    await this.ensureRepositoryInitialized();
  
    const metadata = this.dataSource.getMetadata(this.entity);
    const primaryColumn = metadata.primaryColumns[0].propertyName;
  
    return await this.repo.findOne({
      where: { [primaryColumn]: id } as any,
      relations,
    });
  }

  async findAll(
    filter: FindOptionsWhere<T> = {},
    page: number = 1,
    limit: number = 10,
    relations?: string[]
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    await this.ensureRepositoryInitialized();
    const [data, total] = await this.repo.findAndCount({
      where: filter,
      relations,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    await this.ensureRepositoryInitialized();
    await this.repo.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    await this.ensureRepositoryInitialized();
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }

  async transaction<R>(work: (manager: Repository<T>) => Promise<R>): Promise<R> {
    await this.ensureRepositoryInitialized();
    return await this.dataSource.transaction(async (entityManager) => {
      const managerRepo = entityManager.withRepository(this.repo);
      return await work(managerRepo);
    });
  }
}
