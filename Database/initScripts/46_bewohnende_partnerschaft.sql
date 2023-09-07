DO $$
DECLARE
	questionid question."questionId"%TYPE;

BEGIN

	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Sind Liebes-Beziehungen im Wohnheim erlaubt?', 'Partnerschaft', 'Bewohnende', ARRAY ['Sie haben ein Recht darauf, Ihre Liebesbeziehung zu leben. Sprechen Sie mit dem Wohnheim darüber.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 24, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Sind auch Liebes-Beziehungen zwischen Männern oder zwischen Frauen erlaubt? (homosexuelle Beziehungen)', 'Partnerschaft', 'Bewohnende', ARRAY ['Sie haben ein Recht darauf, Ihre Liebesbeziehung zu leben. Egal in wen Sie sich verlieben. Ob in einen Mann oder in eine Frau. Sprechen Sie mit dem Wohnheim darüber.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 24, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	INSERT INTO definition (title, text, "questionId")
    VALUES ('Homo-Sexualität', '<b>Homo-Sexualität bei Frauen:</b><br>Eine Frau verliebt sich in eine Frau und will mit ihr Sex haben. Dann ist die Frau «homo-sexuell». Man kann auch sagen «lesbisch».<br><b>Homo-Sexualität bei Männern:</b><br>Ein Mann verliebt sich in einen Mann und will mit ihm Sex haben. Dann ist der Mann «homo-sexuell». Man kann auch sagen: «schwul».', questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Wissen Sie wie man eine:n Partner:in kennenlernt?', 'Partnerschaft', 'Bewohnende', ARRAY ['Fragen Sie nach Unterstützung, damit Sie eine:n Partner:in kennen lernen können.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 6, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Dürfen Sie auf dem Internet eine:n Partner:in suchen?', 'Partnerschaft', 'Bewohnende', ARRAY ['Im Internet gibt es Seiten, um eine:n Partner:in zu suchen. Fragen Sie nach Unterstützung. ']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 6, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Bekommen Sie Unterstützung, wenn es Probleme gibt in der Partnerschaft?', 'Partnerschaft', 'Bewohnende', ARRAY ['Fragen Sie im Wohnheim nach Hilfe, wenn es Probleme in der Partnerschaft gibt.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 24, questionid), ('Nein', 0, questionid), ('Manchmal', 12, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Können Sie im Wohnheim mit einer Fachperson über einen Heiratswunsch reden?', 'Partnerschaft', 'Bewohnende', ARRAY ['Versuchen Sie, im Wohnheim offen darüber zu reden, wenn Sie heiraten möchten. So können Sie gute Hilfe bekommen.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 24, questionid), ('Nein', 0, questionid), ('Manchmal', 12, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
END $$
