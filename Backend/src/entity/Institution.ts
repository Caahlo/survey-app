import {
  Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose, plainToClass } from 'class-transformer';
// eslint-disable-next-line import/no-cycle
import Survey from './Survey';
import ApiError from '../ApiError';
// eslint-disable-next-line import/no-cycle
import Credential from './Credential';
// eslint-disable-next-line import/no-cycle
import Utils from '../classes/Utils';

@Entity()
class Institution {
  @Expose()
  @PrimaryGeneratedColumn()
  private readonly institutionId: number;

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

  @Column({ unique: true, nullable: true })
  private passwordResetUUID: string;

  @Expose()
  @OneToMany(() => Survey, (survey) => survey.institution, { nullable: false })
    surveys: Survey[];

  @OneToOne(() => Credential, (credential) => credential.institution, { cascade: true, lazy: true })
    credential: Credential;

  constructor(
    institutionId: number,
    name: string,
    address: string,
    city: string,
    areaCode: string,
    email: string,
    surveys: Survey[],
  ) {
    this.institutionId = institutionId;
    this.name = name;
    this.address = address;
    this.city = city;
    this.areaCode = areaCode;
    this.email = email;
    this.passwordResetUUID = null;
    this.surveys = surveys;
  }

  static from(json: unknown): Institution {
    const institution = plainToClass(Institution, json, { excludeExtraneousValues: true });
    institution.setEmail(institution.email);
    if (
      institution.name
      && institution.address
      && institution.city
      && institution.areaCode
    ) {
      return institution;
    }
    throw new ApiError(`${JSON.stringify(json)} does not specify name, address, city, area code or email!`, 400);
  }

  addSurvey(survey: Survey) {
    if (!this.surveys) {
      this.surveys = [];
    }
    if (survey
      && (!survey.getInstitution() || survey.getInstitution().getId() === this.institutionId)
      && !this.surveys.includes(survey)) {
      this.surveys.push(survey);
    }
  }

  getId(): number {
    return this.institutionId;
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
    const normalizedEmail = Utils.normalizeEmail(email);
    if (normalizedEmail) {
      this.email = normalizedEmail;
    } else {
      throw new ApiError('Invalid Email!', 400);
    }
  }

  setPasswordResetUUID(uuid: string) {
    this.passwordResetUUID = uuid;
  }

  getPasswordResetUUID() {
    return this.passwordResetUUID;
  }

  clearPasswordResetUUID() {
    this.passwordResetUUID = null;
  }
}

export default Institution;
