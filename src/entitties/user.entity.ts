/* eslint-disable */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  TableInheritance,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { InitiatorAudit } from 'src/audits/Initiator.audit';
import { Role } from './role.entity';
import { EAccountStatus } from 'src/enums/EAccountStatus.enum';
import { EGender } from 'src/enums/EGender.enum';
import { File } from 'src/file/File';
import { Appointment } from './appointment.entity';
@Entity('users')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class User extends InitiatorAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: String;

  @Column()
  lastName: String;

  @Column()
  email: String;

  @Column()
  username: String;

  @Column()
  phonenumber: String;

  @Column({
    nullable: true,
    default: null,
  })
  last_login: Date;

  @Column({
    type: String,
    enum: EGender,
    default: EGender[EGender.MALE],
  })
  gender: EGender;
  @JoinColumn({
    name: 'profile_picture',
  })
  profile_pic: File;

  @Column({
    nullable: true,
  })
  password: String;

  @Column({
    nullable: true,
  })
  activationCode: number;

  @Column()
  status: String;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @Column()
  national_id: String;

  @Column({ nullable: true })
  appointments: Appointment[];

  constructor(
    firstName: String,
    lastName: String,
    email: String,
    username: String,
    myGender: EGender,
    national_id: String,
    phonenumber: String,
    password: String,
    status: EAccountStatus,
  ) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.username = username;
    this.gender = myGender;
    // this.profile_pic=this.profile_pic
    this.national_id = national_id;
    this.phonenumber = phonenumber;
    this.password = password;
    this.status = EAccountStatus[status];
  }
}
