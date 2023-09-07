import {
  Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import AnswerOption from '../enums/AnswerOption';
// eslint-disable-next-line import/no-cycle
import Answer from './Answer';
// eslint-disable-next-line import/no-cycle
import SurveyTemplate from './SurveyTemplate';
// eslint-disable-next-line import/no-cycle
import ScoredAnswerOption from './ScoredAnswerOption';
// eslint-disable-next-line import/no-cycle
import Definition from './Definition';
import QuestionType from '../enums/QuestionType';

@Entity()
class Question {
  @Expose()
  @PrimaryGeneratedColumn()
  private readonly questionId: number;

  @Column({ nullable: false })
  private text: string;

  @Column({ nullable: false })
  private category: string;

  @Column({ nullable: false })
  private targetGroup: string;

  @Column({ default: true, nullable: false })
  private hasSmileys: boolean;

  @Column('varchar', { array: true, default: <string[]>[] })
  private recommendations: string[];

  @Expose()
  private questionType: QuestionType;

  @OneToMany(
    () => ScoredAnswerOption,
    (option) => option.question,
    { eager: true, cascade: true },
  )
    answerOptions: ScoredAnswerOption[];

  @ManyToMany(() => SurveyTemplate, (template) => template.questions)
    templates: SurveyTemplate[];

  @OneToMany(() => Answer, (answer) => answer.question)
    answers: Answer[];

  @OneToMany(
    () => Definition,
    (definition) => definition.question,
    { cascade: true, nullable: true },
  )
    definitions: Definition[];

  constructor(
    questionId: number,
    text: string,
    category: string,
    targetGroup: string,
    answerOptions: ScoredAnswerOption[],
  ) {
    this.questionId = questionId;
    this.text = text;
    this.category = category;
    this.targetGroup = targetGroup;
    if (answerOptions) {
      this.setAnswerOptions(answerOptions);
    }
    this.setQuestionType();
  }

  public setQuestionType() {
    if (!this.answerOptions || this.answerOptions.length === 0) {
      return;
    }
    const yes = this.answerOptions.filter((ao) => ao.getAnswerOption() === AnswerOption.Ja)[0];
    const no = this.answerOptions.filter((ao) => ao.getAnswerOption() === AnswerOption.Nein)[0];
    if (!yes || !no) {
      this.questionType = QuestionType.Haltungsfrage;
    } else if (yes.getScore() === no.getScore()) {
      this.questionType = QuestionType.Haltungsfrage;
      this.hasSmileys = false;
    } else if (yes.getScore() > no.getScore()) {
      this.questionType = QuestionType.Standardfrage;
    } else if (yes.getScore() < no.getScore()) {
      this.questionType = QuestionType.Umkehrfrage;
    }
  }

  private initializeAnswerOptionsIfNecessary() {
    if (!this.answerOptions) {
      this.answerOptions = [];
    }
  }

  setAnswerOptions(options: ScoredAnswerOption[]): void {
    if (options) {
      this.answerOptions = [];
      options.forEach(
        (option) => this.addAnswerOption(option.getAnswerOption(), option.getScore()),
      );
    }
  }

  addAnswerOption(answerOption: AnswerOption, score: number): void {
    this.initializeAnswerOptionsIfNecessary();
    if (this.containsOption(answerOption)) {
      const optionToReplace = this.answerOptions
        .filter((option) => option.getAnswerOption() === answerOption)[0];
      const replaceIndex = this.answerOptions.indexOf(optionToReplace);
      this.answerOptions[replaceIndex].setScore(score);
    } else {
      this.answerOptions.push(new ScoredAnswerOption(answerOption, score, this));
    }
  }

  private containsOption(answerOption: AnswerOption): boolean {
    return this.answerOptions
      .filter((option) => (option.getAnswerOption() === answerOption))
      .length > 0;
  }

  removeAnswerOption(answerOption: AnswerOption): void {
    this.initializeAnswerOptionsIfNecessary();
    if (this.containsOption(answerOption)) {
      this.answerOptions = this.answerOptions.filter(
        (option) => (option.getAnswerOption() !== answerOption),
      );
    }
  }

  getAnswerOptions(): AnswerOption[] {
    this.initializeAnswerOptionsIfNecessary();
    return this.copyAnswerOptions();
  }

  private copyAnswerOptions(): AnswerOption[] {
    return this.answerOptions.map((option) => (option.getAnswerOption()));
  }

  isLegitimateAnswer(answerOption: AnswerOption): boolean {
    this.initializeAnswerOptionsIfNecessary();
    return this.containsOption(answerOption);
  }

  getQuestionId(): number {
    return this.questionId;
  }

  getText(): string {
    return this.text;
  }

  getCategory(): string {
    return this.category;
  }

  getTargetGroup(): string {
    return this.targetGroup;
  }

  setText(text: string): void {
    this.text = text;
  }

  setCategory(category: string): void {
    this.category = category;
  }

  setTargetGroup(targetGroup: string): void {
    this.targetGroup = targetGroup;
  }
}

export default Question;
