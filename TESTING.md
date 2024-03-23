# Testing
## Component Testing 
### All component Test are in the `src/components/test` folder
1. For the first component tested, which is for AverageRating, I test the existance of the Title "Total Reviews (`Review numbers`) and popup, and the hover action of the popup, within three different input cases.
2. For the second component tested, which is for ProfitChart, I test the existance of the inputs data, and I set some data for "bookings" to test the correctness of the data in component.
3. For the third component test, which if for RateReview, I test the existance of the component and the Rate star value on the screen, within 2 different input cases.

***

## Ui testing
There are two different UI testing, one is for the happy path, and the other is for the booking accept function and review function.
### 1. userflow.cy.js (`happy path`): 
In this cypress test, I first register user one (`name: randomname, email: randomEmail@email.com, password: password`), and create a new listing (`title:　A Good House, image: src/assets/image/house1.jpg`), update the listing with thumbnail (`image: src/assets/image/house2.jpg`) and title (`title:　A Good HouseNew Apartment#123`). Then I published this listing once, then I unpublished the listing. 

In order to make a booking example, I published the listing (`title:　A Good HouseNew Apartment#123`) again and I created a second user (`name: user2, email: user2@email.com, password: password`) to went to the detail page of this listing and make a booking on this listing. And then I logout user 2
***
### 2 review-must-after-userflow.cy.js (`booking accept and review`):
*Please first do the `happy path` test before this test. And please clear the local storage (cache) in the browser before this test*

In this cypress test, I first login as user1 (`name: randomname`) , I accept the booking from user2 and logged out user 1.  Then I login as user2 (`name: user2`), and I went to the detial page to leave an review about the booking on this listing (`title: A Good HouseNew Apartment#123`).