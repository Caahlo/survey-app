DO $$
DECLARE
	questionid question."questionId"%TYPE;

BEGIN

	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Dürfen Sie im Wohnheim über Nacht Besuch haben?', 'Umgang mit Sexualität', 'Bewohnende', ARRAY ['Sprechen Sie mit den Fachleuten darüber, wenn Sie Besuch über Nacht haben wollen. Niemand darf eine Beziehung verbieten. Finden Sie gemeinsam eine Lösung.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 24, questionid), ('Nein', 0, questionid), ('Manchmal', 12, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Wissen Sie was man machen muss, damit eine Frau nicht schwanger wird?', 'Umgang mit Sexualität', 'Bewohnende', ARRAY ['Informieren Sie sich darüber, was man machen muss, damit eine Frau nicht schwanger wird.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 24, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Dürfen Sie und Ihr Partner selber entscheiden, <strong>ob</strong> Sie verhüten wollen oder nicht?', 'Umgang mit Sexualität', 'Bewohnende', ARRAY ['Sie dürfen selbst entscheiden, ob Sie verhüten wollen. Natürlich müssen Sie das besprechen mit der Person, mit der Sie Sex haben.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 6, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	INSERT INTO definition (title, text, "questionId")
    VALUES ('Verhüten', 'Mit Verhütungs-Mittel bekommt man kein Kind. Es gibt verschiedene Verhütungs- Mittel: Das Kondom beim Mann. Die Anti-Baby-Pille bei der Frau sind bekannte Verhütungsmittel.', questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Dürfen Sie selber entscheiden, <strong>wie</strong> Sie verhüten wollen?', 'Umgang mit Sexualität', 'Bewohnende', ARRAY ['Sie dürfen selbst entscheiden, wie Sie verhüten. Natürlich müssen Sie das besprechen mit der Person, mit der Sie Sex haben.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 6, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Können Sie ungestört Sex haben im Wohnheim?', 'Umgang mit Sexualität', 'Bewohnende', ARRAY ['Sie haben das Recht, im Wohnheim Sex zu haben, wenn Sie das wollen. Achten Sie darauf, dass sie niemanden dabei stören. Und andere Personen dürfen auch Sie nicht stören.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 24, questionid), ('Nein', 0, questionid), ('Manchmal', 12, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Bekommen Sie Kondome, wenn Sie das brauchen?', 'Umgang mit Sexualität', 'Bewohnende', ARRAY ['Fragen Sie nach Kondomen, wenn Sie welche brauchen.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 6, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Findet das Wohnheim Selbstbefriedigung in Ordnung?', 'Umgang mit Sexualität', 'Bewohnende', ARRAY ['Sie haben das Recht, sich selbst zu befriedigen. Das ist erlaubt. Achten Sie darauf, dass Sie niemanden stören. Und andere dürfen Sie auch nicht dabei stören.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 24, questionid), ('Nein', 0, questionid), ('Manchmal', 12, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Sind Sex-Spielzeuge erlaubt?', 'Umgang mit Sexualität', 'Bewohnende', ARRAY ['Sie dürfen Sex-Spielzeuge gebrauchen, wenn Sie das wollen.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 6, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Dürfen Sie Berührer:innen treffen, wenn Sie das möchten?', 'Umgang mit Sexualität', 'Bewohnende', ARRAY ['Sie haben das Recht eine Berührerin oder einen Berührer zu treffen, wenn Sie das wollen. Die Fachpersonen sollen Sie dabei unterstützen.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 6, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	INSERT INTO definition (title, text, "questionId")
    VALUES ('Berührer:in', 'Eine Berührerin begleitet Menschen mit Behinderungen beim Entdecken und Erleben ihrer eigenen Sexualität.', questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Dürfen Sie eine Sexarbeiter:in treffen, wenn Sie das möchten?', 'Umgang mit Sexualität', 'Bewohnende', ARRAY ['Sie haben das Recht eine Sexarbeiterin oder einen Sexarbeiter zu treffen, wenn Sie das wollen. Die Fachpersonen sollen Sie dabei unterstützen.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('Manchmal', 6, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	INSERT INTO definition (title, text, "questionId")
    VALUES ('Sexarbeiter:in', 'Eine Sexarbeiter:in bietet Sex gegen Geld an.', questionid);
END $$
