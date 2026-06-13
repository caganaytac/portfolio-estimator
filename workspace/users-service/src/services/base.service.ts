import { AppError } from "../utils/appError";
import { BaseRepository } from "../repositories/base.repository";
import { DeepPartial } from "typeorm";

export abstract class BaseService<
  T extends object,
  C extends DeepPartial<T> = DeepPartial<T>,
  U extends DeepPartial<T> = DeepPartial<T>
> {
  constructor(protected readonly repo: BaseRepository<T>) {}

  async create(dto: C): Promise<T> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async getById(id: string | number): Promise<T | null> {
    return this.repo.findById(id);
  }

  async list(page = 1, pageSize = 25) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await this.repo.findPaginated(skip, pageSize);
    return { data, total, page, pageSize };
  }

  async update(id: string | number, dto: U): Promise<T | null> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError(404, "Resource not found");
    return this.repo.update(id, dto as Partial<T>);
  }

  async delete(id: string | number) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError(404, "Resource not found");
    await this.repo.delete(id);
  }
}
