//This test should be done after userflow.cy.js
describe('accept booking and make review', () => {
  it('should register successfully', () => {
    // visit the url
    cy.visit('localhost:3000/');
    cy.url().should('include', 'localhost:3000');

    // The first user login again
    cy.get('button[name="login-btn"]').click();
    cy.url().should('include', 'localhost:3000/login');
    cy.wait(1000);
    cy.get('input[name="email"]').focus().type('randomEmail@email.com');
    cy.get('input[name="password"]').focus().type('password');
    cy.get('button[type="submit"]').click();
    cy.wait(1500);

    // go to myairbrb page to see the booking
    cy.contains('MyAirbrb').click();
    cy.url().should('include', 'localhost:3000/myairbrb');
    cy.wait(1000);

    // accept the booking
    cy.get('button[name="bookingBtn"]').click();
    cy.wait(1000);
    cy.url().should('include', 'localhost:3000/myairbrb/bookings');
    cy.get('button[name="acceptBooking"]').click();
    cy.wait(1000);

    //logout first user
    cy.get('button[name="logout-btn"]').click();
    cy.contains('OK').click();
    cy.url().should('include', 'http://localhost:3000/list/index');
    cy.wait(2000);

    //login second user
    cy.get('button[name="login-btn"]').click();
    cy.url().should('include', 'localhost:3000/login');
    cy.wait(1000);
    cy.get('input[name="email"]').focus().type('user2@email.com');
    cy.get('input[name="password"]').focus().type('password');
    cy.get('button[type="submit"]').click();
    cy.wait(1500);

    //go to the booking list to see the booking and make review
    cy.url().should('include', 'localhost:3000/list/index');
    //go to the detailed page
    cy.contains('New Apartment#123').click();
    cy.url().should('include', 'localhost:3000/listings');
    cy.wait(1000);
    //reviewing
    cy.get('span[name="addReview"]').click();
    cy.wait(100)
    cy.get('.ant-rate-star').should('have.length.at.least', 2);
    cy.get('.ant-modal-content .ant-rate-star').eq(1).click();
    cy.get('textarea[name="comment"]').focus().type('This is a test review');
    cy.wait(100)
    cy.contains('Submit').click();
  });
});
