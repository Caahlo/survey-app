import {
  Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose, plainToClass, Type } from 'class-transformer';
import AnswerOption from '../enums/AnswerOption';
// eslint-disable-next-line import/no-cycle
import Question from './Question';
// eslint-disable-next-line import/no-cycle
import Survey from './Survey';
import ApiError from '../ApiError';

@Entity()
class Answer {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Expose()
  @Type(() => Question)
  @ManyToOne(() => Question, (question) => question.answers, { nullable: false })
  readonly question: Question;

  @Expose()
  @Column({ nullable: false })
  private answer: string;

  @ManyToOne(() => Survey, (survey) => survey.answers, { eager: true, nullable: false, onDelete: 'CASCADE' })
    survey: Survey;

  constructor(answerId: string, question: Question, answerOption: AnswerOption) {
    this.id = answerId;
    this.question = question;
    this.answer = answerOption;
  }

  static from(json: unknown): Answer {
    const answer = plainToClass(Answer, json, { excludeExtraneousValues: true });
    if (answer.question && answer.answer) {
      return answer;
    }
    throw new ApiError(`${json} does not specify question and/or answer and cannot be converted!`, 400);
  }

  getQuestionId() {
    return this.question.getQuestionId();
  }

  getAnswerOption() {
    return this.answer;
  }

  setAnswerOption(answerOption: AnswerOption) {
    this.answer = answerOption;
  }
}

export default Answer;
