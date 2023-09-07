import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import CredentialType from '../enums/CredentialType';
// eslint-disable-next-line import/no-cycle
import Institution from './Institution';
// eslint-disable-next-line import/no-cycle
import AdminAccount from './AdminAccount';
import hashing from '../authentication/hashing';
import ApiError from '../ApiError';

@Entity()
class Credential {
  @PrimaryGeneratedColumn('uuid')
  private credentialId: string;

  @Column()
  private readonly credentialType: string;

  @Column({ nullable: true })
  private institutionId: number;

  @Column({ nullable: true })
  private adminAccountId: number;

  @Column()
  private passwordHash: string;

  @OneToOne(
    () => Institution,
    (institution) => institution.credential,
    { nullable: true, eager: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'institutionId' })
    institution: Institution;

  @OneToOne(
    () => AdminAccount,
    (account) => account.credential,
    { nullable: true, eager: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'adminAccountId' })
    adminAccount: AdminAccount;

  private constructor(
    password: string,
    entity: Institution | AdminAccount,
  ) {
    try {
      this.passwordHash = Credential.generatePasswordHash(password);
    } catch (e) {
      this.passwordHash = undefined;
    }
    if (entity instanceof Institution) {
      this.institution = entity;
      this.credentialType = CredentialType.Institution;
    } else if (entity instanceof AdminAccount) {
      this.adminAccount = entity;
      this.credentialType = CredentialType.Admin;
    }
  }

  private static generatePasswordHash(password: string) {
    const salt = hashing.generateSalt();
    return hashing.hashPassword(password, salt);
  }

  public static newCredentialsForInstitution(password: string, institution: Institution) {
    const credential = new Credential(password, institution);
    if (credential.passwordHash === undefined) {
      throw new ApiError('Could not create credentials! Password cannot be undefined!', 400);
    }
    return credential;
  }

  public static newCredentialsForAdmin(password: string, adminAccount: AdminAccount) {
    const credential = new Credential(password, adminAccount);
    if (credential.passwordHash === undefined) {
      throw new ApiError('Could not create credentials! Password cannot be undefined!', 400);
    }
    return credential;
  }

  public passwordIsCorrect(password: string) {
    return hashing.checkPlainAndHash(password, this.passwordHash);
  }

  public getHolder() {
    switch (this.credentialType) {
      case CredentialType.Institution:
        return this.institution;
      case CredentialType.Admin:
        return this.adminAccount;
      default:
        return null;
    }
  }

  public getType() {
    return CredentialType[this.credentialType as keyof typeof CredentialType];
  }

  public changePassword(oldPassword: string, newPassword: string) {
    if (!this.passwordIsCorrect(oldPassword)) {
      throw new ApiError('Incorrect Credentials!', 401);
    }
    this.passwordHash = Credential.generatePasswordHash(newPassword);
  }

  public resetPassword(password: string) {
    this.passwordHash = Credential.generatePasswordHash(password);
  }
}

export default Credential;
