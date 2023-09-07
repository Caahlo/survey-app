create EXTENSION if not exists "uuid-ossp";

create table survey_template
(
    "templateId" serial
        constraint "PK_43bf75485850497edeae0452149"
            primary key,
    published    boolean not null
);

alter table survey_template
    owner to dbuser;


create table institution
(
    "institutionId"     serial
        constraint "PK_cf98e79edca7c6f9724dddd7cee"
            primary key,
    name                varchar               not null,
    address             varchar               not null,
    city                varchar               not null,
    "areaCode"          varchar               not null,
    email               varchar               not null
        constraint "UQ_43c747addb41aeac8b1da0c58d5"
            unique,
    "isEmailVerified"   boolean default false not null,
    "passwordResetUUID" varchar
        constraint "UQ_da3dd4b261ae3667aac7f96ccb8"
            unique
);

alter table institution
    owner to dbuser;


create table admin_account
(
    "accountId" serial
        constraint "PK_1dfa43a2ff9b8eb487042b628ea"
            primary key,
    name        varchar not null,
    address     varchar not null,
    city        varchar not null,
    "areaCode"  varchar not null,
    email       varchar not null
        constraint "UQ_f3e0154c250dadde6d843ffc220"
            unique
);


create table survey
(
    "startDate"                timestamp not null,
    "endDate"                  timestamp not null,
    "surveyId"                 serial
        constraint "PK_2bb1a75a612fa166da6f77122ba"
            primary key,
    "templateTemplateId"       integer
        constraint "FK_5faddfd2c7d68f788f2d1bc9ec7"
            references survey_template,
    "institutionInstitutionId" integer
        constraint "FK_a25b2aa938c4bc354caf095f780"
            references institution
);

alter table survey
    owner to dbuser;

create table question
(
    "questionId"    serial
        constraint "PK_f5c864430d1f3626bc6671d6b8d"
            primary key,
    text            varchar              not null,
    category        varchar              not null,
    "targetGroup"   varchar              not null,
    "hasSmileys"    boolean default true not null,
    recommendations character varying[] default '{}'::character varying[] not null
);

alter table question
    owner to dbuser;

create table answer
(
    id                   uuid default uuid_generate_v4() not null
        constraint "PK_9232db17b63fb1e94f97e5c224f"
            primary key,
    answer               varchar                         not null,
    "questionQuestionId" integer
        constraint "FK_d6b11fa94dbccb3d64d31fb36c6"
            references question,
    "surveySurveyId"     integer
        constraint "FK_31b7faacfb88df076330302de04"
            references survey
);

alter table answer
    owner to dbuser;

create table scored_answer_option
(
    option       varchar not null,
    score        integer not null,
    "questionId" integer not null
        constraint "FK_498443813d82c49fbe991e14b2f"
            references question,
    constraint "PK_c4dc76f91ea49efab19daf89a16"
        primary key (option, "questionId")
);

alter table scored_answer_option
    owner to dbuser;

create table survey_template_questions_question
(
    "surveyTemplateTemplateId" integer not null
        constraint "FK_97485701829249f9ddc85be5c42"
            references survey_template
            on update cascade on delete cascade,
    "questionQuestionId"       integer not null
        constraint "FK_d3af2a91317234aba3d9abfa33a"
            references question,
    constraint "PK_89fcc7f8b7fc2409fce6a36065d"
        primary key ("surveyTemplateTemplateId", "questionQuestionId")
);

alter table survey_template_questions_question
    owner to dbuser;

create index "IDX_97485701829249f9ddc85be5c4"
    on survey_template_questions_question ("surveyTemplateTemplateId");

create index "IDX_d3af2a91317234aba3d9abfa33"
    on survey_template_questions_question ("questionQuestionId");


create table comment
(
    "commentId"      uuid default uuid_generate_v4() not null
        constraint "PK_1b03586f7af11eac99f4fdbf012"
            primary key,
    category         varchar                         not null,
    text             varchar                         not null,
    "targetGroup"    varchar                         not null,
    "surveySurveyId" integer
        constraint "FK_ea3672aef7db4dfc2a1709c730f"
            references survey
);

alter table comment
    owner to dbuser;




create table definition
(
    title        varchar not null,
    text         varchar not null,
    "questionId" integer not null
        constraint "PK_d73ec9d8ee7193b9abbd0dd255c"
            primary key
        constraint "FK_d73ec9d8ee7193b9abbd0dd255c"
            references question
);

alter table definition
    owner to dbuser;


create table credential
(
    "credentialId"   uuid default uuid_generate_v4() not null
        constraint "PK_a460b79cf670a88e009751855c4"
            primary key,
    "credentialType" varchar                         not null,
    "institutionId"  integer
        constraint "REL_a01dc5bac9bfdcb81ad801f09d"
            unique
        constraint "FK_a01dc5bac9bfdcb81ad801f09d9"
            references institution,
    "adminAccountId" integer
        constraint "REL_b2d6b58a936924eb873f487952"
            unique
        constraint "FK_b2d6b58a936924eb873f487952c"
            references admin_account,
    "passwordHash"   varchar                         not null
);

alter table credential
    owner to dbuser;
