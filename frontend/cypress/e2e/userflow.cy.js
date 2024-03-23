describe('user happy path', () => {
  it('should register successfully', () => {
    // visit the url
    cy.visit('localhost:3000/');
    cy.url().should('include', 'localhost:3000');

    // Get to register page
    cy.get('button[name="login-btn"]').click();
    cy.url().should('include', 'localhost:3000/login');
    cy.get('a[name="sign-up-href"]').click();
    cy.url().should('include', 'localhost:3000/signup');
    
    // Register
    cy.get('input[name="name"]').focus().type('randomName');
    cy.get('input[name="email"]').focus().type('randomEmail@email.com');
    cy.get('input[name="password"]').focus().type('password');
    cy.get('input[name="confirmPassword"]').focus().type('password');
    cy.get('button[type="submit"]').click();
    cy.wait(100);

    // After login or register, you would go to the listing page.
    // create listing needs to go to 'Myairbrb' page first
    cy.contains('MyAirbrb').click();
    cy.url().should('include', 'localhost:3000/myairbrb');

    // Create a new listing
    cy.get('button[name="createNewListing"]').click();
    cy.url().should('include', 'localhost:3000/create-myairbrb');
    cy.get('input[name="title"]').focus().type('A Good House');
    cy.get('input[name="addressLine"]').focus().type('1 Studio Drive');
    cy.get('input[name="city"]').focus().type('Eastgardens');
    cy.get('input[name="state"]').focus().type('NSW');
    cy.get('input[name="country"]').focus().type('Australia');
    cy.get('input[name="price"]').focus().type('150');
    cy.get('input[id="nest-messages_propertyType"]').click();
    cy.get('div[label="Room"]').click();
    cy.get('input[name="numBathroom"]').focus().type('2');
    cy.get('input[name="numBedroom"]').focus().type('4');
    cy.get('input[name="numBed"]').focus().type('4');
    cy.get('input[id="nest-messages_amenities"]').click();
    cy.get('div[label="Wi-Fi"]').click();
    cy.get('textArea[name="bedroomDetails"]')
      .focus()
      .type('There is 5 bed in bedrooms');
    cy.get('input[id="nest-messages_thumbnail"]').selectFile(
      '../frontend/src/assets/images/house1.jpg',
      {
        force: true,
      }
    );
    cy.wait(1000);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', 'localhost:3000/myairbrb');

    // Change Title and Thumbnail
    cy.get('button[name="editBtn"]').click();
    cy.get('input[name="title"]').focus().clear();
    cy.get('input[name="title"]').focus().type('New Apartment#123');
    cy.get('input[type="file"]').selectFile(
      '../frontend/src/assets/images/house2.jpg',
      {
        force: true,
      }
    );
    cy.get('button[type="submit"]').click();
    cy.url().should('include', 'localhost:3000/myairbrb');

    // Publish Listing
    cy.get('button[name="publishBtn"]').click();
    cy.get('input[id="firstRange"]').click();
    cy.get('td[title="2023-12-29"]').click();
    cy.get('td[title="2023-12-30"]').click();
    cy.wait(1000);
    cy.get('button[name="publishSubmit"]').click();
    cy.url().should('include', 'localhost:3000/myairbrb');
    cy.wait(1000);

    // Unpublish Listing
    cy.get('button[name="publishBtn"]').click();
    cy.wait(100);
    cy.url().should('include', 'localhost:3000/myairbrb');
    cy.wait(2000);

    //Publish the listing for booking:
    cy.get('button[name="publishBtn"]').click();
    cy.get('input[id="firstRange"]').click();
    cy.get('td[title="2023-12-29"]').click();
    cy.get('td[title="2023-12-30"]').click();
    cy.wait(1000);
    cy.get('button[name="publishSubmit"]').click();
    cy.url().should('include', 'localhost:3000/myairbrb');
    cy.wait(2000);
    
    // logout to register another user
    cy.get('button[name="logout-btn"]').click();
    cy.contains('OK').click();
    cy.url().should('include', 'http://localhost:3000/list/index');

    // Get to register page (second user)
    cy.get('button[name="login-btn"]').click();
    cy.url().should('include', 'localhost:3000/login');
    cy.get('a[name="sign-up-href"]').click();
    cy.url().should('include', 'localhost:3000/signup');
    
    // Register
    cy.get('input[name="name"]').focus().type('user2');
    cy.get('input[name="email"]').focus().type('user2@email.com');
    cy.get('input[name="password"]').focus().type('password');
    cy.get('input[name="confirmPassword"]').focus().type('password');
    cy.get('button[type="submit"]').click();
    cy.wait(1000);

    // The second user make a booking
    // first go to listing (home page)
    cy.url().should('include', 'localhost:3000/list/index');
    //go to the detailed page
    cy.contains('New Apartment#123').click();
    cy.url().should('include', 'localhost:3000/listings');
    cy.wait(1000);
    //booking
    cy.get('button[name="bookBtn"]').click();
    cy.get('input[placeholder="Start date"]').click();
    cy.get('td[title="2023-12-29"]').click();
    cy.get('td[title="2023-12-31"]').click();
    cy.wait(1000);
    cy.contains('Submit').click();
    cy.wait(1000);
    
    // logout to second user
    cy.get('button[name="logout-btn"]').click();
    cy.contains('OK').click();
    cy.wait(2000)
    cy.url().should('include', 'http://localhost:3000/list/index');
    
    // The first user login again
    cy.get('button[name="login-btn"]').click();
    cy.url().should('include', 'localhost:3000/login');
    cy.wait(1000);
    cy.get('input[name="email"]').focus().type('randomEmail@email.com');
    cy.get('input[name="password"]').focus().type('password');
    cy.get('button[type="submit"]').click();
    cy.wait(500);
  });
});
