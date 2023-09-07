import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { plainToClass, Expose } from 'class-transformer';
// eslint-disable-next-line import/no-cycle
import Survey from './Survey';
import TargetGroup from '../enums/TargetGroup';
import ApiError from '../ApiError';
// eslint-disable-next-line import/no-cycle
import Utils from '../classes/Utils';

@Entity()
class Comment {
  @PrimaryGeneratedColumn('uuid')
  private readonly commentId: string;

  @Expose()
  @Column({ nullable: false })
  private category: string;

  @Expose()
  @Column({ nullable: false })
  private text: string;

  @Expose()
  @Column({ nullable: false })
  private targetGroup: string;

  @ManyToOne(() => Survey, (survey) => survey.comments, { onDelete: 'CASCADE' })
    survey: Survey;

  static from(json: unknown): Comment {
    const comment = plainToClass(Comment, json, { excludeExtraneousValues: true });
    const text = Utils.escape(Utils.trim(comment.text));
    const category = Utils.escape(Utils.trim(comment.category));

    if (text && category) {
      comment.text = text;
      comment.category = category;
      return comment;
    }
    throw new ApiError('Object does not specify category and/or text and cannot be converted to comment!', 400);
  }

  getCategory() {
    return this.category;
  }

  getTargetGroup() {
    return this.targetGroup;
  }

  setTargetGroup(targetGroup: TargetGroup) {
    this.targetGroup = targetGroup;
  }

  getText() {
    return this.text;
  }
}

export default Comment;
