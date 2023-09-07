DO $$
DECLARE
	questionid question."questionId"%TYPE;

BEGIN

	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Dürfen Sie bestimmen, ob Sie von einem Mann oder einer Frau gepflegt werden?', 'Gesundheit und Pflege', 'Bewohnende', ARRAY ['Ist es ihnen wichtig, ob Sie von einer Frau oder einem Mann gepflegt werden? Teilen Sie das den Fachleuten mit. ']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 6, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);




	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Werden Ihre Bedürfnisse bei der Intim-Pflege berücksichtigt?', 'Gesundheit und Pflege', 'Bewohnende', ARRAY ['Sie müssen herausfinden, was Ihre Bedürfnisse bei der Intim-Pflege sind.', 'Teilen Sie diese Bedürfnisse den Fachleuten mit.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 6, questionid), ('NichtBeurteilbar', 0, questionid);
	
	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	INSERT INTO definition (title, text, "questionId")
    VALUES ('Intim-Pflege', 'Intimpflege ist die Körper-pflege im Bereich der Geschlechts-Organe. Bei der Intimpflege werden die Geschlechts-Organe gewaschen.', questionid);




	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Fühlen Sie sich bei der Intimpflege sicher?', 'Gesundheit und Pflege', 'Bewohnende', ARRAY ['Sprechen Sie darüber, wenn Sie sich bei der Intimpflege nicht sicher fühlen.', 'Sagen Sie, was die Fachperson anders machen muss.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 6, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Wissen Sie wie sie sich vor Geschlechts-Krankheiten schützen können?', 'Gesundheit und Pflege', 'Bewohnende', ARRAY ['Informieren Sie sich, wie Sie sich vor Geschlechts-Krankheiten schützen können.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 6, questionid), ('NichtBeurteilbar', 0, questionid);

	-- Definition
	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	INSERT INTO definition (title, text, "questionId")
    VALUES ('Geschlechts-Krankheiten', 'Beim Sex kann man sich mit verschiedenen Geschlechts-Krankheiten anstecken. Wenn Sie krank sind, merken Sie es oft nicht. Beim Sex kann man sich vor Geschlechts-Krankheiten schützen.', questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Eine Frage nur an Frauen:<br> Gehen Sie regelmässig (1x im Jahr) zur Untersuchung bei einer Frauenärztin?', 'Gesundheit und Pflege', 'Bewohnende', ARRAY ['Die regelmässige Kontrolle bei der Frauenärztin ist sehr wichtig. Achten Sie deshalb darauf, dass Sie 1x pro Jahr zum Untersuch gehen.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 24, questionid), ('Nein', 0, questionid), ('Manchmal', 12, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
END $$
