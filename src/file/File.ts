import { Global } from '@nestjs/common';
import { UUID } from 'crypto';
import { InitiatorAudit } from 'src/audits/Initiator.audit';
import { EFileSizeType } from 'src/enums/EFileSizeType';
import { EFileStatus } from 'src/enums/EFileStatus';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files')
@Global()
export class File extends InitiatorAudit {
  constructor() {
    super();
  }

  @PrimaryGeneratedColumn()
  id: UUID;
  @Column()
  name: String;
  @Column()
  path: String;
  @Column()
  url: String;
  @Column()
  size: number;
  @Column()
  type: String;
  @Column()
  sizeType: EFileSizeType;
  @Column()
  status: EFileStatus;
  getUrl(): String {
    return 'files/load-file/' + this.name;
  }
}
