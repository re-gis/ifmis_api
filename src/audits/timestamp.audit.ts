import { SerializeOptions } from '@nestjs/common';
import { CreateDateColumn } from 'typeorm';

@SerializeOptions({
  strategy: 'exposeAll',
})
export abstract class TimeStampsAudit {
  constructor() {}

  @CreateDateColumn({ name: 'created_at', default: new Date(Date.now()) })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', default: new Date(Date.now()) })
  updatedAt: Date;
}
