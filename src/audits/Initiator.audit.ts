import { SerializeOptions } from '@nestjs/common';
import { TimeStampsAudit } from './timestamp.audit';

@SerializeOptions({
  strategy: 'excludeAll',
})
export abstract class InitiatorAudit extends TimeStampsAudit {
  constructor() {
    super();
  }

  creadBy: String;
  updatedBy: String;
}
