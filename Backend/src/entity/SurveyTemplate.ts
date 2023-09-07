import {
  Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
// eslint-disable-next-line import/no-cycle
import Question from './Question';
// eslint-disable-next-line import/no-cycle
import Survey from './Survey';

@Entity()
class SurveyTemplate {
  @PrimaryGeneratedColumn()
  private readonly templateId: number;

  @Column({ nullable: false, default: false })
  private published: boolean;

  @ManyToMany(() => Question, (question) => question.templates)
  @JoinTable()
    questions: Question[];

  @OneToMany(() => Survey, (survey) => survey.template)
    surveys: Survey[];

  constructor(templateId: number) {
    this.templateId = templateId;
    this.published = false;
  }

  getTemplateId(): number {
    return this.templateId;
  }

  isPublished(): boolean {
    return this.published;
  }

  publish(): void {
    this.published = true;
  }

  addQuestion(question: Question) {
    if (this.questions === undefined) {
      this.questions = [];
    }
    if (!this.questions.includes(question)) {
      this.questions.push(question);
    }
  }

  removeQuestion(question: Question) {
    if (this.questions && this.questions.includes(question)) {
      this.questions.splice(this.questions.indexOf(question), 1);
    }
  }
}

export default SurveyTemplate;
