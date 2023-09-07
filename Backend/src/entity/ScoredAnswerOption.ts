import {
  Column, Entity, ManyToOne, PrimaryColumn, JoinColumn,
} from 'typeorm';
// eslint-disable-next-line import/no-cycle
import Question from './Question';
import AnswerOption from '../enums/AnswerOption';

@Entity()
class ScoredAnswerOption {
  @PrimaryColumn()
  private readonly option: string;

  @Column({ nullable: false })
  private score: number;

  @PrimaryColumn()
  private readonly questionId: number;

  @ManyToOne(() => Question, (question) => (question.answerOptions), { nullable: false })
  @JoinColumn({ name: 'questionId' })
    question: Question;

  constructor(answerOption: AnswerOption, score: number, question: Question) {
    this.option = answerOption;
    this.score = score;
    if (question) {
      this.question = question;
      this.questionId = question.getQuestionId();
    }
  }

  getAnswerOption(): AnswerOption {
    return AnswerOption[this.option as keyof typeof AnswerOption];
  }

  getQuestionId(): number {
    return this.questionId;
  }

  setScore(score: number) {
    this.score = score;
  }

  getScore(): number {
    return this.score;
  }
}

export default ScoredAnswerOption;
