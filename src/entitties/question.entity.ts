/* eslint-disable */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Status } from 'src/enums/Status.enum';
import { InitiatorAudit } from 'src/audits/Initiator.audit';
import { AnyNsRecord } from 'dns';

@Entity()
export class Question extends InitiatorAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  filePath: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column()
  status: Status;

  @Column('jsonb', { nullable: true })
  response: any;

  // Linking the user with his question
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  constructor(
    content: string,
    status: Status,
    response: any,
    filePath: string,
  ) {
    super();
    this.content = content;
    this.filePath = filePath;
    this.response = response;
    this.status = status;
  }
}
