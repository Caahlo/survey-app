import Answer from '../../entity/Answer';

interface IAnswerRepository {
  save: (answers: Answer[]) => Promise<void>;
}

export default IAnswerRepository;
