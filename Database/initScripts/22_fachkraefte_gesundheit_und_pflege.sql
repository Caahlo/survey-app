DO $$
DECLARE
	questionid question."questionId"%TYPE;

BEGIN
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Dürfen die Bewohnenden bestimmen, ob sie von einem Mann oder einer Frau gepflegt werden?', 'Gesundheit und Pflege', 'Fachkraefte', ARRAY ['Falls es den Bewohnenden wichtig ist, ob sie von einem Mann oder eine Frau gepflegt werden, muss dies so weit wie möglich berücksichtigt werden.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 4, questionid), ('Nein', 0, questionid), ('Manchmal', 2, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);




	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Werden individuelle Bedürfnisse der Bewohnenden bei der Intimpflege berücksichtigt?', 'Gesundheit und Pflege', 'Fachkraefte', ARRAY ['Klären Sie die individuellen Bedürfnisse der Bewohnenden bei der Intimpflege und handeln Sie danach.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 4, questionid), ('Nein', 0, questionid), ('Manchmal', 2, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);




	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Sind Informationen über Geschlechtskrankheiten für Bewohnende verfügbar?', 'Gesundheit und Pflege', 'Fachkraefte', ARRAY ['Stellen Sie sicher, dass alle über Geschlechtskrankheiten informiert sind.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 4, questionid), ('Nein', 0, questionid), ('Manchmal', 2, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
END $$
