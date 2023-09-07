DO $$
DECLARE
	questionid question."questionId"%TYPE;

BEGIN

	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Gibt es im Wohnheim Ansprechpersonen zum Thema Sexualität?', 'Bildung', 'Bewohnende', ARRAY ['Sie müssen mit einer Fachperson über Sexualität reden können, wenn Sie das wollen. Die Institution soll Ihnen helfen, jemanden zu finden.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 24, questionid), ('Nein', 0, questionid), ('Manchmal', 3, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);




	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Gibt es im Wohnheim Bücher oder Hefte über Sexualität?', 'Bildung', 'Bewohnende', ARRAY ['Fragen Sie nach Büchern oder Heften über Sexualität.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 3, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);




	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Gib es für Sie Kurse zum Thema Sexualität im Wohnheim?', 'Bildung', 'Bewohnende', ARRAY ['Sagen Sie es, wenn Sie einen Kurs zum Thema Sexualität besuchen wollen.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 3, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Kennen Sie eine Beratungsstelle zum Thema Sexualität?', 'Bildung', 'Bewohnende', ARRAY ['Sie müssen mit einer Fachperson über Sexualität reden können, wenn Sie das wollen. Die Institution soll Ihnen helfen, jemanden zu finden.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 24, questionid), ('Nein', 0, questionid), ('Manchmal', 3, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Dürfen Sie sich auf Internetseiten zum Thema Sexualität und Beziehung informieren?', 'Bildung', 'Bewohnende', ARRAY ['Es ist erlaubt, Internetseiten zum Thema Sexualität und Beziehung zu besuchen.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Manchmal', 6, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Kennen Sie die UNBRK (Behindertenrechtskonvention)? Das ist eine Vereinbarung über die Rechte von Menschen mit Behinderungen.', 'Bildung', 'Bewohnende', ARRAY ['Sie müssen die UN-BRK kennenlernen. Dort steht alles über die Rechte von Menschen mit Behinderungen. Fragen Sie unbedingt danach.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 24, questionid), ('Manchmal', 12, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
END $$
