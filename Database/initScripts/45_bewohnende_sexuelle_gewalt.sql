DO $$
DECLARE
	questionid question."questionId"%TYPE;

BEGIN

	INSERT INTO question ("questionId", text, category, "targetGroup", recommendations, "hasSmileys")
	VALUES (default, 'Hat das Wohnheim Ihnen erklärt, was sexuelle Gewalt ist?', 'Sexuelle Gewalt', 'Bewohnende', ARRAY ['Es ist wichtig, dass an über sexuelle Gewalt spricht. So lernt man, dass nicht alle Berührungen erlaubt sind.'], true) RETURNING "questionId" into questionid;

	INSERT INTO scored_answer_option (option, score, "questionId")
	VALUES ('Ja', 6, questionid), ('Nein', 0, questionid), ('Manchmal', 3, questionid), ('NichtBeurteilbar', 0, questionid);

	INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
	VALUES ((SELECT MAX("templateId") from survey_template), questionid);

	INSERT INTO definition (title, text, "questionId")
	VALUES ('Sexuelle Gewalt', 'Jemand belästigt Sie sexuell. Zum Beispiel: jemand berührt Sie an einer intimen Stelle. Zum Beispiel am Busen oder Po. Sie wollen das aber nicht. Oder jemand zwingt Sie zum Sex. Das ist verboten.', questionid);




    INSERT INTO question ("questionId", text, category, "targetGroup", recommendations)
    VALUES (default, 'Macht das Wohnheim etwas gegen sexuelle Belästigung?', 'Sexuelle Gewalt', 'Bewohnende', ARRAY ['Es sind nicht alle Berührungen erlaubt. Wenn jemand Sie belästigt, muss das Folgen für diese Person haben.']) RETURNING "questionId" into questionid;

    INSERT INTO scored_answer_option (option, score, "questionId")
    VALUES ('Ja', 6, questionid), ('Nein', 0, questionid), ('Manchmal', 3, questionid), ('NichtBeurteilbar', 0, questionid);

    INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
    VALUES ((SELECT MAX("templateId") from survey_template), questionid);

    INSERT INTO definition (title, text, "questionId")
    VALUES ('Sexuelle Belästigung', 'Stellen Sie sich vor: Jemand starrt auf Ihren Po oder Ihren Busen. Oder: Jemand macht dich sexuel blöd an. Das ist sexuelle Belästigung.', questionid);




    INSERT INTO question ("questionId", text, category, "targetGroup", "hasSmileys", recommendations)
    VALUES (default, 'Haben Sie in diesem Wohnheim schon einmal sexuelle Gewalt erlebt?', 'Sexuelle Gewalt', 'Bewohnende', false, ARRAY ['Es darf im Wohnheim keine sexuelle Gewalt geben. Falls Sie sexuelle Gewalt erleben, ist es wichtig, dass Sie es einer Fachperson sagen.']) RETURNING "questionId" into questionid;

    INSERT INTO scored_answer_option (option, score, "questionId")
    VALUES ('Ja', 0, questionid), ('Nein', 6, questionid), ('Manchmal', 0, questionid), ('NichtBeurteilbar', 0, questionid);

    INSERT INTO survey_template_questions_question ("surveyTemplateTemplateId", "questionQuestionId")
    VALUES ((SELECT MAX("templateId") from survey_template), questionid);
END $$
