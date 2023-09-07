DO $$
DECLARE
	questionid question."questionId"%TYPE;

BEGIN

	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Wissen Sie, wie Ihre Tochter / Ihr Sohn wohnen will?', 'Wohnen', 'Angehoerige', ARRAY ['Fragen Sie Ihre Tochter / Ihren Sohn wie sie / er wohnen möchte']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 2, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);




	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Wird das Recht auf Privatsphäre in der Institution gewährleistet?', 'Wohnen', 'Angehoerige', ARRAY ['Sprechen Sie es an, wenn Sie das Gefühl haben, in der Institution wird das Recht auf Privatsphäre nicht gewährleistet.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 2, questionid), ('Nein', 0, questionid), ('Manchmal', 1, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);




	INSERT INTO question ("questionId", text, category, "targetGroup")
	VALUES (default, 'Befürworten Sie Doppelzimmer für Paare?', 'Wohnen', 'Angehoerige') RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 0, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
END $$
