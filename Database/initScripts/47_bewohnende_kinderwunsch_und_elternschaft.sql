DO $$
DECLARE
	questionid question."questionId"%TYPE;

BEGIN

	INSERT INTO question ("questionId", text, category, "targetGroup")
	VALUES (default, 'Wünschen Sie sich Kinder?', 'Kinderwunsch und Elternschaft', 'Bewohnende') RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 0, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Können Sie im Wohnheim mit einer Fachperson offen über einen Kinderwunsch reden?', 'Kinderwunsch und Elternschaft', 'Bewohnende', ARRAY ['Fragen Sie im Wohnheim nach Informationen zum Thema Kinderwunsch und Eltern werden.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 6, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Fühlen Sie sich im Wohnheim von den Fachpersonen ernst genommen mit dem Kinderwunsch?', 'Kinderwunsch und Elternschaft', 'Bewohnende', ARRAY ['Fragen Sie im Wohnheim nach Informationen zum Thema Kinderwunsch und Eltern werden.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 6, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup")
	VALUES (default, 'Können Sie sich mit dem Kinderwunsch beschäftigen? Zum Beispiel Besuche in einer Kinderkrippe; Babysimulator.', 'Kinderwunsch und Elternschaft', 'Bewohnende') RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 24, questionid), ('Nein', 0, questionid), ('Manchmal', 12, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	INSERT INTO definition (title, text, "questionId")
    VALUES ('Baby-Simulator', 'Das ist eine Baby-Puppe. Sie verhält sich wie ein Baby. Sie weint oder die Windeln müssen gewechselt werden. Damit können Sie ein paar Tage ausprobieren, wie es ist ein Baby zu pflegen.', questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Gibt es im Wohnheim Informationen zum Thema Kinderwunsch?', 'Kinderwunsch und Elternschaft', 'Bewohnende', ARRAY ['Reden Sie offen darüber, wenn Sie sich mehr mit Ihrem Kinderwunsch beschäftigen wollen.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 24, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup")
	VALUES (default, 'Dürfen Sie im Wohnheim bleiben, wenn Sie Vater oder Mutter werden?', 'Kinderwunsch und Elternschaft', 'Bewohnende') RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup")
	VALUES (default, 'Wünschen Sie sich ein Wohnangebot mit Unterstützung, wenn Sie Vater oder Mutter werden?', 'Kinderwunsch und Elternschaft', 'Bewohnende') RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 6, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
END $$
