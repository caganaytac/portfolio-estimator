import {
  Repository,
  FindOptionsOrder,
  FindOptionsWhere,
  FindOptionsRelations,
  DeepPartial,
} from "typeorm";

export abstract class BaseRepository<T extends object> {
  protected readonly repo: Repository<T>;
  protected readonly id: keyof T;

  protected constructor(
    repo: Repository<T>,
    id: keyof T = "id" as keyof T,
  ) {
    this.repo = repo;
    this.id = id;
  }

  create(payload: DeepPartial<T>) {
    return this.repo.create(payload);
  }

  save(entity: T | DeepPartial<T> | DeepPartial<T>[]) {
    return this.repo.save(entity as any);
  }


  async findById(id: string, relations?: FindOptionsRelations<T>) {
    return this.repo.findOne({
      where: { [this.id]: id } as FindOptionsWhere<T>,
      relations,
    });
  }

  findOne(where: FindOptionsWhere<T>, relations?: FindOptionsRelations<T>) {
    return this.repo.findOne({ where, relations });
  }


  findMany(
    where: FindOptionsWhere<T>,
    order?: FindOptionsOrder<T>,
    relations?: FindOptionsRelations<T>,
  ) {
    return this.repo.find({ where, order, relations });
  }

  findPaginated(
    skip = 0,
    take = 25,
    order?: FindOptionsOrder<T>,
    where?: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
  ) {
    return this.repo.findAndCount({ skip, take, order, where, relations });
  }

  async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    const count = await this.repo.count({ where });
    return count > 0;
  }

  count(where?: FindOptionsWhere<T>): Promise<number> {
    return this.repo.count({ where });
  }

  // useful if a caller updates then immediately needs the joined result
  async update(id: string, payload: Partial<T>, relations?: FindOptionsRelations<T>) {
    await this.repo.update(
      { [this.id]: id } as FindOptionsWhere<T>,
      payload as any
    );
    return this.findById(id, relations);
  }

  async delete(id: string) {
    await this.repo.delete({ [this.id]: id } as FindOptionsWhere<T>);
  }
}
