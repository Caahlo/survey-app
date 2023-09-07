DO $$
DECLARE
	questionid question."questionId"%TYPE;

BEGIN
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Gibt es in der Institution ausgebildete sexualpädagogische Fachpersonen?', 'Bildung', 'Fachkraefte', ARRAY ['Stellen Sie sicher, dass es in der Institution Fachpersonen mit sexualpädagogischer Ausbildung gibt.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 4, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);




	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Gibt es Aufklärungsmaterial zum Thema Sexualität in Leichter Sprache?', 'Bildung', 'Fachkraefte', ARRAY ['Planen Sie im Budget Mittel für Aufklärungsmaterial ein.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 4, questionid), ('Nein', 0, questionid), ('Manchmal', 2, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);




	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Haben die Bewohnenden Zugang zum Aufklärungsmaterial?', 'Bildung', 'Fachkraefte', ARRAY ['Stellen Sie Aufklärungsmaterial in Leichter Sprache zur Verfügung und informieren Sie die Bewohnende darüber.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 4, questionid), ('Nein', 0, questionid), ('Manchmal', 2, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
END $$
