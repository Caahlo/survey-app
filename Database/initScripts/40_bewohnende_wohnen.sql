DO $$
DECLARE
	questionid question."questionId"%TYPE;

BEGIN

	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Haben Sie ein Einzelzimmer?', 'Wohnen', 'Bewohnende', ARRAY ['Sagen Sie wie Sie wohnen möchten.', 'Fragen Sie nach einem Einzelzimmer, wenn Sie das möchten.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 24, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);




	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Haben Sie in Ihrem Zimmer ein WC?', 'Wohnen', 'Bewohnende', ARRAY ['Sorgen Sie dafür, dass sie Bad / WC in Ruhe benutzen können.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);




	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Haben Sie in Ihrem Zimmer ein Badezimmer?', 'Wohnen', 'Bewohnende', ARRAY ['Sorgen Sie dafür, dass sie Bad / WC in Ruhe benutzen können.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Dürfen Sie in Ihr Zimmer gehen, wenn Sie Ruhe wollen?', 'Wohnen', 'Bewohnende', ARRAY ['Sagen Sie, dass Sie Ruhe haben möchten, wenn das für Sie wichtig ist.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Manchmal', 6, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Haben Sie einen Schlüssel für Ihr Zimmer?', 'Wohnen', 'Bewohnende', ARRAY ['Verlangen Sie einen Schlüssel für Ihr Zimmer.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Darf man das Badezimmer auf der Wohngruppe abschliessen? ', 'Wohnen', 'Bewohnende', ARRAY ['Verlangen Sie einen Schlüssel für das Badezimmer.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Manchmal', 6, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Darf man das WC auf der Wohngruppe abschliessen? ', 'Wohnen', 'Bewohnende', ARRAY ['Verlangen Sie einen Schlüssel für das WC.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Manchmal', 6, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Gibt es Doppelzimmer für Paare? ', 'Wohnen', 'Bewohnende', ARRAY ['Fragen Sie nach einem Zimmer für Paare, wenn Sie das möchten.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 24, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Haben Sie einen Internetzugang? ', 'Wohnen', 'Bewohnende', ARRAY ['Fordern Sie einen Internet-Zugang, wenn Sie einen wollen.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 24, questionid), ('Manchmal', 12, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Darf man in der Institution Sexfilme schauen? ', 'Wohnen', 'Bewohnende', ARRAY ['Wenn Sie einen Sexfilm schauen wollen, ist das erlaubt.', 'Informieren Sie sich: Es gibt erlaubte und verbotene Sexfilme.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Manchmal', 6, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
	
	
	
	
	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
	VALUES (default, 'Sind Sie darüber informiert, was im Internet zum Thema Sexualität verboten ist? ', 'Wohnen', 'Bewohnende', ARRAY ['Informieren Sie sich: Es gibt verschiedene Internetseiten zum Thema Sex. Einige von ihnen sind verboten. Zum Beispiel wenn es um Sex mit Kindern oder Gewalt geht.']) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 12, questionid), ('Manchmal', 6, questionid), ('Nein', 0, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);
END $$
