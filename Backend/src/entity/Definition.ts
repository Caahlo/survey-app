import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
// eslint-disable-next-line import/no-cycle
import Question from './Question';

@Entity()
class Definition {
  @PrimaryColumn()
  @Column()
  private title: string;

  @Column()
  private text: string;

  @PrimaryColumn()
  private questionId: number;

  @ManyToOne(() => Question, (question) => question.definitions)
  @JoinColumn({ name: 'questionId' })
    question: Question;

  constructor(question: Question, title: string, text: string) {
    this.question = question;
    this.title = title;
    this.text = text;
  }
}

export default Definition;
