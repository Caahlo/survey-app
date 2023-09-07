import { EntityManager, Repository } from 'typeorm';
import ICommentRepository from './Interfaces/ICommentRepository';
import Comment from '../entity/Comment';

class CommentRepository implements ICommentRepository {
  private commentRepository: Repository<Comment>;

  constructor(entityManager: EntityManager) {
    this.commentRepository = entityManager.getRepository(Comment);
  }

  public async save(comments: Comment[]) {
    await this.commentRepository.save(comments);
  }
}

export default CommentRepository;
