DO $$
DECLARE
	questionid question."questionId"%TYPE;

BEGIN

	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Wird die Intimsphäre Ihrer Tochter / Ihres Sohnes in der Institution respektiert?', 'Gesundheit und Pflege', 'Angehoerige', ARRAY ['Reden Sie mit Ihrer Tochter / Ihrem Sohn über ihre / seine Bedürfnisse bei der Intimpflege.', 'Vergewissern Sie sich, dass die Fachpersonen diese Bedürfnisse ernstnehmen.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 2, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);




	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Haben sie Ihre Tochter / Ihren Sohn darüber informiert, wie sie / er sich vor Geschlechtskrankheiten schützen kann?', 'Gesundheit und Pflege', 'Angehoerige', ARRAY ['Reden Sie mit Ihrer Tochter / Ihrem Sohn darüber, wie er / sie sich vor Geschlechtskrankheiten schützen kann.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 2, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);




	INSERT INTO question ("questionId", text, category, "targetGroup")
	VALUES (default, 'Haben Sie die Möglichkeit, Ihre Tochter / Ihren Sohn zu ärztlichen Untersuchungen zu begleiten, wenn sie / er das will?', 'Gesundheit und Pflege', 'Angehoerige') RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 2, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
END $$
