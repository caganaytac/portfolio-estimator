import { Person } from "../models/person";
import { PersonRepository } from "../repositories/person.repository";
import { BaseService } from "./base.service";
import { UserService } from "./user.service";
import { CreatePersonDto } from "../dtos/create-person.dto";
import { UpdatePersonDto } from "../dtos/update-person.dto";
import { PersonDetailsDto } from "../dtos/person-details.dto";

export class PersonService extends BaseService<Person> {
  constructor(
    private readonly personRepo: PersonRepository,
    private readonly userService: UserService
  ) {
    super(personRepo);
  }

// Creates a new person profile and the associated user account
  async createPerson(dto: CreatePersonDto): Promise<Person> {
    const newUser = await this.userService.createUser(dto);

    return this.create({
      userId: newUser.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      dateOfBirth: new Date(dto.dateOfBirth),
      taxId: dto.taxId,
      taxResidenceCountry: dto.taxResidenceCountry,
      riskClass: dto.riskClass,
      investmentHorizon: dto.investmentHorizon,
    });
  }

// intern: get only person.ts


  async getPersonDetails(userId: number): Promise<PersonDetailsDto | null> {
    return this.personRepo.findPersonDetailsById(userId);
  }

  async getPersonDetailsByPublicId(publicId: string): Promise<PersonDetailsDto | null> {
    return this.personRepo.findPersonDetailsByPublicId(publicId);
  }

  async listPersons(page = 1, pageSize = 25) {
    return this.list(page, pageSize);
  }

  async listAllPersonDetails(page = 1, pageSize = 25) {
    const skip = (page - 1) * pageSize;
    return this.personRepo.listAllDetails(skip, pageSize);
  }

  async updatePerson(userId: number, dto: UpdatePersonDto) {
    const existing = await this.personRepo.findById(userId);
    if (!existing) throw new Error("Person profile not found");
    const payload = dto.dateOfBirth ? { ...dto, dateOfBirth: new Date(dto.dateOfBirth) } : dto;
    return this.update(userId, payload);
  }

  async deletePerson(userId: number) {
    const existing = await this.personRepo.findById(userId);
    if (!existing) throw new Error("Person profile not found");
    await this.delete(userId);
  }
}
