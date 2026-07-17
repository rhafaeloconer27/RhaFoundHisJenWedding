RHAF & JEN MULTI-PAGE WEDDING INVITATION

STRUCTURE

rhaf-jen-wedding-multipage/
|
|-- index.html
|-- home.html
|-- sponsors.html
|-- location.html
|-- attire.html
|-- gift-guide.html
|-- faq.html
|-- contact.html
|-- rsvp.html
|-- prenup.html
|
|-- css/
|   |-- style.css
|
|-- js/
|   |-- common.js
|   |-- countdown.js
|   |-- rsvp.js
|
|-- images/
|   |-- design-reference.png
|
|-- README.txt


HOW IT WORKS

1. index.html is the invitation cover.
2. Clicking Open Invitation goes to home.html.
3. Each navigation icon opens a separate HTML page.
4. The navigation bar is fixed at the bottom and is visible on every page.
5. The current page is automatically highlighted.


HOW TO RUN

Double-click index.html.

For better testing, you may also use VS Code Live Server.


WEDDING DATE

The countdown is configured in js/countdown.js:

const WEDDING_DATE = new Date("2027-02-04T15:00:00+08:00");


IMPORTANT

The RSVP form is front-end only. To save responses, connect it to
Google Forms, Formspree, Firebase, Supabase, or your own API.
