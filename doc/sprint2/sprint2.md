# Sprint 2

#### Goal

Enable our users (youth, donor, merchant) to interact with each other. Donors can browse the youth profile and donate to them; youth can browse the products offered by merchants and purchase them by credits; merchants can manage their stores and get profits.

#### Participation

All team members attended the meeting and contributed (Luowei, Shengsong, Tony, Joshua, and Abhishek)

#### Team Capacity:

Team capacity is listed below implicitly in terms of hours per subtask.

#### Spikes

Paypal API

## Chosen User Stories

#### Note: subtasks are listed under each user story.

**TEA4-9**: As James (a merchant), I want to be able to upload my products and enter details such as a picture and price so that potential buyers (homeless youth) can see and purchase them.

1.  Create UI for uploading a product (2 hours) (Abhishek)

2.  Creating backend endpoint to validate and store product information (3 hours) (Abhishek)

**TEA4-5**: As Mike (a homeless youth), I want to see the products offered by merchants so that I can exchange my credits for their goods and services.

1.  Create UI for /store page (2 hours) (Luowei)

2.  Frontend can sort products by price and type (1hours) (Luowei)

3.  Frontend implements searching for specific products (2hours)(Luowei)

4.  Create endpoint for retrieving all product uploads (3 hours) (Shengsong)

5.  Implement credit system for youths to purchase products (3 hours) (Shengsong)

6.  Connect frontend youth payment interface to backend purchase endpoint(2hours)(Shengsong)

7.  Make product card component reusable on /store(2hours) (Joshua)

**TEA4-15**: As Dorothy (a donor), I want to browse homeless youths’ profiles so that I can select who I want to donate to.

1.  Create youths public profile page UI (2 hours) (Joshua)

2.  Create homepage UI (where all youths are displayed) (2 hour) (Joshua)

3.  Create endpoint for pulling all youths' profile information (1 hour) (Joshua)

**TEA4-17**: As Dorothy (a donor), I want to donate to a homeless youth so that I can help them.

1.  Create donation UI on youths' profile pages (2 hours) (Joshua)

2.  Harmonize frontend and backend client ID and client secret (2 hours) (Joshua)

3.  Fix mongoose query for pending donations (1hours) (Joshua)

4.  Implement credit system for donors to donate to youths (2 hours) (Tony)
