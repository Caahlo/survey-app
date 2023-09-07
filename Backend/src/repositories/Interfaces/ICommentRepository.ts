import Comment from '../../entity/Comment';

interface ICommentRepository {
  save: (comments: Comment[]) => Promise<void>;
}

export default ICommentRepository;
