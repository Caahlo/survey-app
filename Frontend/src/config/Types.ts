// Fetch type
export type API = {
//   host: string,
//   port: string,
//   hostUri: Function,
//   baseUri: Function,
  baseUrl: string,
  institutionName: string,
  identifier: string,
  targetGroup: string,
};

// Fetch type
export type AnswerOption = {
  option: string,
  score: number,
  questionId: number,
};

export type Definition = {
  title: string,
  text: string,
};

export type FetchQuestion = {
  questionId: number;
  text: string,
  category: string,
  targetGroup: string,
  answerOptions: Array<AnswerOption>,
  hasSmileys: boolean,
  definitions: Array<Definition>,
};

export type FetchedQuestions = {
  questions: Array<FetchQuestion>,
};

// Send type
export type SendQuestion = {
  questionId: number,
};

export type SendAnswer = {
  question: SendQuestion,
  answer: string,
};

export type Comments = {
  category: string,
  text: string,
};

export type SendAnswers = {
  answers: Array<SendAnswer>,
  comments: Array<Comments>,
};

// Result type
export type PersonaResult = {
  scores: {
    achievedResult: string,
    possibleResult: string,
  },
  comments: Array<string>,
  recommendations: Array<string>,
};

export type Result = {
  category: string,
  Fachkraefte: PersonaResult,
  Bewohnende: PersonaResult,
  Angehoerige: PersonaResult,
};

export type FetchedResults = {
  results: Array<Result>;
};

export type LoginRequest = {
  email: string,
  password: string,
};

// export type RefreshRequest = {
//   accessToken: string,
// };

export type RegisterRequest = {
  institution: {
    name: string,
    address: string,
    city: string,
    areaCode: string,
    email: string,
    password: string,
  };
};

export type SurveyId = string;
export type AllSurveysResponse = {
  surveys: [
    {
      surveyId: SurveyId,
      startDate: string,
      endDate: string,
    },
  ];
};

export type SelectorId = string;

export type RequestInstitutionUpdate = {
  institution: {
    institutionId: string,
    name: string,
    address: string,
    city: string,
    areaCode: string,
    email: string,
  },
};

export type RequestPasswordUpdate = {
  institution: {
    institutionId: string,
    oldPassword: string,
    newPassword: string,
  },
};

export type RequestEmailUpdate = {
  institution: {
    institutionId: string,
    newEmail: string,
  },
};
