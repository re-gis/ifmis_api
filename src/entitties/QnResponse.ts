/* eslint-disable */
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

export class QnReponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  respondedAt: Date;

  @ManyToOne(() => Question, (qn) => qn.id)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  
}
