DO $$
DECLARE
	questionid question."questionId"%TYPE;

BEGIN

	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Haben Sie Ihre Tochter / Ihren Sohn über das Thema Sexualität aufgeklärt?', 'Bildung', 'Angehoerige', ARRAY ['Reden Sie mit ihrem Sohn / ihrer Tochter über Sexualität und klären Sie fragen, wo nötig.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 2, questionid), ('Nein', 0, questionid), ('Manchmal', 1, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);


	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Ist es Ihnen wichtig, dass Ihr Sohn / Ihre Tochter zum Thema Sexualität aufgeklärt ist?', 'Bildung', 'Angehoerige', ARRAY ['Reden Sie mit ihrem Sohn / ihrer Tochter über Sexualität und klären Sie fragen, wo nötig.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 2, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);


	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Hat Ihr Sohn / Ihre Tochter in der Institution Zugang zu Aufklärungsmaterial?', 'Bildung', 'Angehoerige', ARRAY ['Fordern Sie bei den Fachpersonen Aufklärungsmaterial.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 2, questionid), ('Nein', 0, questionid), ('Manchmal', 1, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
END $$
