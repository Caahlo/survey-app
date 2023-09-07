import IAnswerRepository from '../../src/repositories/Interfaces/IAnswerRepository';
import Answer from '../../src/entity/Answer';

class TestAnswerRepository implements IAnswerRepository {
  private readonly answers: Answer[] = [];

  private saveShouldFail = false;

  constructor(answers: Answer[], saveShouldFail: boolean) {
    if (saveShouldFail) {
      this.saveShouldFail = saveShouldFail;
    }
    if (answers) {
      this.answers = answers;
    }
  }

  setSaveShouldFail(bool: boolean) {
    this.saveShouldFail = bool;
  }

  async save(answers: Answer[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.saveShouldFail) {
        reject(new Error('Could not save Answers'));
      } else {
        answers.forEach((answer) => this.answers.push(answer));
        resolve();
      }
    });
  }

  getAnswers() {
    return this.answers.filter(() => true);
  }

  clearAnswers() {
    this.answers.splice(0, this.answers.length);
  }
}

export default TestAnswerRepository;
