DO $$
DECLARE
	surveyid survey."surveyId"%TYPE;
    institutionid institution."institutionId"%TYPE;

BEGIN
	INSERT INTO institution ("institutionId", name, address, city, "areaCode", email, "isEmailVerified")
	VALUES (default, 'test', 'some_street 12', 'some_place', '1234', 'test@example.com', true) RETURNING "institutionId" INTO institutionid;

	INSERT INTO credential ("credentialId", "credentialType", "institutionId", "adminAccountId", "passwordHash")
    VALUES (default, 'Institution', institutionid, NULL, '$2b$10$EC8PtF/n/UHxcSo0EUyYkOHUBgaOhaafCh3OvsCE259GJBHbPo.uO'); -- Password: 123
END $$
