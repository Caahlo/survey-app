# Introduction

This is a project that I have worked on with another student a year ago as part of a class.
Everything except for the Frontend has been created by me, so the Frontend is not a reflection of my programming skills, but the rest is.


I think that especially the Backend part shows that I can write code that is maintainable and testable.
I am aware that it is not perfect and that it contains parts that are unfinished,
as we did not have more time available for the project.
My part of the project took around 200 hours to complete from the ground up.

# Project Description

During this project, I created the backend for a survey application, that is designed to be as usable as possible for mental impairments.
Unfortunately, the UI is in german, as this was a requirement by the customer that we worked for.
The source code on the other hand is mainly in english.
I hope the language is not a big barrier, especially as the Backend, the part that has been written by me, is english.


My responsibilities in this project included the creation of the backend for the survey application,
and the database that keeps track of the responses.
In addition to that I have also created a reverse proxy to prevent problems with CORS.
The deployment with Docker was also mostly my responsibility.


During the creation of this project, we interacted with our customer in an agile way,
figuring out the requirements and prioritizing them based on the customer's needs.

# Usage

The web application can be started using the docker command `docker-compose up`.
Unfortunately, some features will not work, as they require an api key for a gmail account.
This includes features like account creation and deletion, as these are features that would send a confirmation email to the user in production.

However, surveys can still be filled out and viewed, which might give you an idea of the workings of the application.

## Filling Out a Survey

Once the application is running, the survey can be filled out under the following link: http://localhost/umfrage.html?institution=test&id=1.
As previously mentioned, the UI, including the questions, are in german.
I recommend choosing Fachmitarbeiter:in or Angehörige:r instead of Bewohner:in in the drop-down menu on the starting page,
as those categories contain the least amount of questions that need to be answered before the survey can be submitted.

## Viewing the Results

Once the form has been filled out at least once,
the results of the survey can be viewed.
To view the results, you can log in under the following link: http://localhost/login.html.
The credentials for the test account are: email: test@example.com, password: 123.
Once successfully logged in, you can scroll down and click on the survey id to view the results.
In addition, the account can be managed by clicking on 'Benutzereinstellungen'.
Some of these features won't work however, as they require gmail api keys.

# Documentation

The documentation for the project can be found in the top-level folder.
As with the source code, not the whole documentation was written by me.
The parts that were written by my are:
* The abstract
* Chapter 2 (Domain Analysis)
* Chapter 4 (Architecture)
* Chapter 5 (Database)
* Chapter 7 (Backend)
* Chapter 8 (Proxy)
* Section 9.1 (Coding Guidelines), 9.2.4 (Backend), 9.3 (Workflow)
* Section 11.3 (Reflection Backend)
* Chapter 13 (Time Management)
* Chapter 14 (CI/CD), excluding 14.4.2 (Frontend)

It contains a lot of additional information that was not summarized in this README,
and skimming the documentation will give you additional insights on the reasonings behind decisions and the most interesting parts of the product.

# Contact

If you have any questions about this example, feel free to send me an email: carlo.delrossi@pm.me
