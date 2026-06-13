import { DataSource, FindOptionsOrder } from "typeorm";
import { User } from "../models/user";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(dataSource.getRepository(User));
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findByPublicId(publicId: string) {
    return this.repo.findOne({ where: { publicId } });
  }

  async findPaginated(skip: number, take: number) {
    return this.repo.findAndCount({ skip, take, order: { createdAt: "DESC" } as FindOptionsOrder<User> });
  }
}
