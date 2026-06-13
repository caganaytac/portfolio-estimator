import { Repository, FindOptionsOrder, FindOptionsWhere, DeepPartial } from "typeorm";

export abstract class BaseRepository<T extends object> {
  protected readonly repo: Repository<T>;
  protected readonly idField: keyof T;

  protected constructor(repo: Repository<T>, idField: keyof T = "id" as keyof T) {
    this.repo = repo;
    this.idField = idField;
  }

  create(payload: DeepPartial<T>) {
    return this.repo.create(payload);
  }

  save(entity: T | DeepPartial<T>) {
    return this.repo.save(entity as any);
  }

  async findById(id: string | number) {
    return this.repo.findOne({ where: { [this.idField]: id } as any });
  }

  findOne(where: FindOptionsWhere<T>) {
    return this.repo.findOne({ where });
  }

  findPaginated(skip = 0, take = 25, order?: FindOptionsOrder<T>) {
    return this.repo.findAndCount({ skip, take, order });
  }

 async update(id: string | number, payload: Partial<T>) {
    await this.repo.update(
      { [this.idField]: id } as FindOptionsWhere<T>,
      payload as any
    );
    return this.findById(id);
  }

  async delete(id: string | number) {
    await this.repo.delete({ [this.idField]: id } as FindOptionsWhere<T> );
}
}