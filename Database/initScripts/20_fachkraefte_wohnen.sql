DO $$
DECLARE
	questionid question."questionId"%TYPE;

BEGIN
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Haben die Bewohnenden Einzelzimmer, wenn sie es wünschen?', 'Wohnen', 'Fachkraefte', ARRAY ['Stellen Sie auf Wunsch Einzelzimmer zu Verfügung.', 'Fragen Sie die Bewohnenden, wie Sie wohnen möchten.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 4, questionid), ('Nein', 0, questionid), ('Manchmal', 2, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);




	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Haben die Zimmer ein eigenes WC?', 'Wohnen', 'Fachkraefte', ARRAY ['Ermöglichen Sie, dass die Benutzung der sanitären Anlagen so flexibel wie möglich geschieht,', 'Bei einem Um- resp. Neubau soll darauf geachtet werden, dass alle Zimmer ein eigenes WC und ein eigenes Bad haben.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 4, questionid), ('Nein', 0, questionid), ('Manchmal', 2, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);




	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Haben die Zimmer eine eigene Dusche?', 'Wohnen', 'Fachkraefte', ARRAY ['Ermöglichen Sie, dass die Benutzung der sanitären Anlagen so flexibel wie möglich geschieht,', 'Bei einem Um- resp. Neubau soll darauf geachtet werden, dass alle Zimmer ein eigenes WC und ein eigenes Bad haben.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 4, questionid), ('Nein', 0, questionid), ('Manchmal', 2, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
END $$
