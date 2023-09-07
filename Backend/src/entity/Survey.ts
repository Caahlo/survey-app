import {
  Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
// eslint-disable-next-line import/no-cycle
import SurveyTemplate from './SurveyTemplate';
// eslint-disable-next-line import/no-cycle
import Institution from './Institution';
// eslint-disable-next-line import/no-cycle
import Answer from './Answer';
// eslint-disable-next-line import/no-cycle
import Comment from './Comment';

@Entity()
class Survey {
  static readonly defaultDuration = 30;

  @Column({ nullable: false })
  private readonly startDate: Date;

  @Column({ nullable: false })
  private readonly endDate: Date;

  @PrimaryGeneratedColumn()
  private readonly surveyId: number;

  // eslint-disable-next-line max-len
  @ManyToOne(() => SurveyTemplate, (template) => template.surveys, { eager: true, nullable: false, onDelete: 'RESTRICT' })
  readonly template: SurveyTemplate;

  @ManyToOne(() => Institution, (institution) => institution.surveys, { nullable: false, onDelete: 'CASCADE' })
  readonly institution: Institution;

  @OneToMany(() => Answer, (answer) => answer.survey)
    answers: Answer[];

  @OneToMany(() => Comment, (comment) => comment.survey, {
    cascade: true,
    orphanedRowAction: 'disable',
    onDelete: 'CASCADE',
  })
    comments: Comment[];

  constructor(
    surveyId: number,
    institution: Institution,
    template: SurveyTemplate,
    durationInDays: number,
  ) {
    this.surveyId = surveyId;
    this.institution = institution;
    this.template = template;
    const startDate = new Date();
    const endDate = Survey.getEndDate(startDate, durationInDays);
    this.startDate = startDate;
    this.endDate = endDate;
  }

  private static getEndDate(startDate: Date, duration: number) {
    const thresholdValue = process.env.ENVIRONMENT === 'Develop' ? 0 : 1;
    // eslint-disable-next-line no-param-reassign
    duration = duration >= thresholdValue ? duration : this.defaultDuration;
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + duration);
    return endDate;
  }

  getStartDate(): Date {
    return this.startDate;
  }

  getEndDate(): Date {
    return this.endDate;
  }

  getSurveyId(): number {
    return this.surveyId;
  }

  getTemplate(): SurveyTemplate {
    return this.template;
  }

  getInstitution(): Institution {
    return this.institution;
  }
}

export default Survey;
