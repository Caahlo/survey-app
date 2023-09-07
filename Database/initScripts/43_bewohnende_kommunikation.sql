DO $$
DECLARE
	questionid question."questionId"%TYPE;

BEGIN

	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Gibt es ein Sexual-Konzept in Ihrem Wohnheim?', 'Kommunikation / Reden über Sexualität', 'Bewohnende', ARRAY ['Erkundigen Sie sich, ob es im Wohnheim ein Sexual-Konzept gibt. Finden Sie heraus, was da drin steht.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 24, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	INSERT INTO definition (title, text, "questionId")
    VALUES ('Sexual-Konzept', 'Das Sexual-konzept beschreibt, wie im Wohnheim mit dem Thema Sexualität umgegangen wird. Damit alle Menschen Ihre Sexualität leben können.', questionid);




	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Wissen Sie was im Sexual-Konzept steht?', 'Kommunikation / Reden über Sexualität', 'Bewohnende', ARRAY ['Erkundigen Sie sich, ob es im Wohnheim ein Sexual-Konzept gibt. Finden Sie heraus, was da drin steht.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 6, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Macht das Wohnheim, was in diesem Konzept steht?', 'Kommunikation / Reden über Sexualität', 'Bewohnende', ARRAY ['Reden Sie mit einer Fachperson wenn Sie denken, dass Sexual-Konzept wird nicht gut umgesetzt im Wohnheim.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 6, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'War Sexualität beim Eintrittsgespräch ein Thema?', 'Kommunikation / Reden über Sexualität', 'Bewohnende', ARRAY ['Informieren Sie sich bei einem Eintritt in ein WohnWohnheim, wie mit dem Thema Sexualität umgegangen wird.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 6, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Können Sie im Wohnheim offen über Sexualität reden, wenn Sie das möchten?', 'Kommunikation / Reden über Sexualität', 'Bewohnende', ARRAY ['Sagen Sie, dass es für Sie wichtig ist, mit jemandem über das Thema Sexualität reden zu können.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 6, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Werden Sie gefragt, bevor das Wohnheim Informationen über Sie weitergibt?', 'Kommunikation / Reden über Sexualität', 'Bewohnende', ARRAY ['Das Wohnheim muss Sie fragen, bevor man Informationen über Sie weitergibt. Das ist Ihr Recht.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 24, questionid), ('Nein', 0, questionid), ('Manchmal', 12, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
END $$
