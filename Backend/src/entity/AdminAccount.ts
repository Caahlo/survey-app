import {
  Column, Entity, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose, plainToClass } from 'class-transformer';
import ApiError from '../ApiError';
// eslint-disable-next-line import/no-cycle
import Credential from './Credential';
// eslint-disable-next-line import/no-cycle
import Utils from '../classes/Utils';

@Entity()
class AdminAccount {
  @Expose()
  @PrimaryGeneratedColumn()
  private readonly accountId: number;

  @Expose()
  @Column({ nullable: false })
  private name: string;

  @Expose()
  @Column({ nullable: false })
  private address: string;

  @Expose()
  @Column({ nullable: false })
  private city: string;

  @Expose()
  @Column({ nullable: false })
  private areaCode: string;

  @Expose()
  @Column({ unique: true })
  private email: string;

  @OneToOne(() => Credential, (credential) => credential.adminAccount)
    credential: Credential;

  constructor(
    accountId: number,
    name: string,
    address: string,
    city: string,
    areaCode: string,
    email: string,
  ) {
    this.accountId = accountId;
    this.name = name;
    this.address = address;
    this.city = city;
    this.areaCode = areaCode;
    this.email = email;
  }

  static from(json: unknown): AdminAccount {
    const adminAccount = plainToClass(AdminAccount, json, { excludeExtraneousValues: true });
    const normalizedEmail = Utils.normalizeEmail(adminAccount.email);
    if (!normalizedEmail) {
      throw new ApiError('Invalid email!', 400);
    }
    adminAccount.email = normalizedEmail;
    if (adminAccount.name
      && adminAccount.address
      && adminAccount.city
      && adminAccount.areaCode
      && adminAccount.email
    ) {
      return adminAccount;
    }
    throw new ApiError(`${JSON.stringify(json)} does not specify name, address, city, area code or email!`, 400);
  }

  getId(): number {
    return this.accountId;
  }

  getName(): string {
    return this.name;
  }

  setName(value: string) {
    this.name = value;
  }

  getAddress(): string {
    return this.address;
  }

  setAddress(value: string) {
    this.address = value;
  }

  getCity(): string {
    return this.city;
  }

  setCity(value: string) {
    this.city = value;
  }

  getAreaCode(): string {
    return this.areaCode;
  }

  setAreaCode(value: string) {
    this.areaCode = value;
  }

  getEmail() {
    return this.email;
  }

  setEmail(email: string) {
    this.email = email;
  }
}

export default AdminAccount;
