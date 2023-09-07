import ICommentRepository from '../../src/repositories/Interfaces/ICommentRepository';
import Comment from '../../src/entity/Comment';

class TestCommentRepository implements ICommentRepository {
  private readonly comments: Comment[] = [];

  constructor(comments: Comment[]) {
    if (comments) {
      this.comments = comments;
    }
  }

  async save(comments: Comment[]): Promise<void> {
    comments.forEach((c) => this.comments.push(c));
    return new Promise((resolve) => {
      resolve();
    });
  }

  getComments() {
    return this.comments;
  }
}

export default TestCommentRepository;
