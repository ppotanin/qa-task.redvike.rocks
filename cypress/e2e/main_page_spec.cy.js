import moment from 'moment';
import { Main_page } from '../page_objects/main_page';

describe('Form Submission Test', () => {
    let timestamp = moment().format('DDMMYYhhmm');
    const main_page = new Main_page();

    let user_name = `Joe${timestamp}`;
    let last_name = `Doe${timestamp}`;
    let email = `johndoe${timestamp}@example.com`;
    let password = '1q2w3e4r5t6y';

    // Test Case 1: Automate successful form submission and verify data on success page
    it('Test 1: Submit form with valid data and verify successful submission', () => {
        // 1. Visit the application URL
        cy.visit('https://qa-task.redvike.rocks/');

        // 2. Fill in the form fields with valid data
        main_page.set_field(main_page.first_name_field, user_name);
        main_page.set_field(main_page.last_name_field, last_name);
        main_page.set_field(main_page.email_field, email);
        main_page.set_field(main_page.password_field, password);
        main_page.set_field(main_page.confirm_password_field, password);

        // 3. Upload avatar (if needed, assuming 'avatar.jpg' is valid)
        main_page.upload_avatar('avatar.jpg');

        // 4. Slide the CAPTCHA slider to completion (assuming successful completion is at 732.5px)
        main_page.swipe_captcha(732.5);

        // 5. Submit the form
        main_page.click_submit_button();

        // 6. Verify successful submission URL
        main_page.url_contains('/success'); // Verify URL contains '/success'

        // 7. Verify success message on success page
        main_page.form_contains('Successful Form Submissions');

        // 8. Verify submitted user data is displayed on success page
        main_page.form_contains(user_name);
        main_page.form_contains(last_name);
        main_page.form_contains(email);

        // 9. Verify "Back to Form" link is displayed
        main_page.form_contains('Back to Form');
    })

    // Test Case 2.1: Verify error messages for empty required fields
    it('Test 2.1: Verify error messages for empty required fields', () => {
        cy.visit('https://qa-task.redvike.rocks/');

        // Submit the form without filling any fields
        main_page.click_submit_button();

        // Verify error messages for each field
        main_page.check_field_error_messege('first_name', 'Please fill in this field.');
        main_page.check_field_error_messege('last_name', 'Please fill in this field.');
        main_page.check_field_error_messege('password', 'Please fill in this field.');
        main_page.check_field_error_messege('email', 'Please fill in this field.');
    });

// Test Case 2.2: Verify email format error message
    it('Test 2.2: Verify email format error message', () => {
        cy.visit('https://qa-task.redvike.rocks/');

        // Fill in some data and enter an incorrect email
        main_page.set_field(main_page.first_name_field, user_name);
        main_page.set_field(main_page.last_name_field, last_name);
        main_page.set_field(main_page.email_field, 'incorrectemail'); // Incorrect email
        main_page.set_field(main_page.password_field, 'password123');
        main_page.set_field(main_page.confirm_password_field, 'password123');

        main_page.click_submit_button();

        main_page.check_field_error_messege('email', "Please include an '@' in the email address." +
            " 'incorrectemail' is missing an '@'.");
    });

// Test Case 2.3: Verify password mismatch error message
    it('Test 2.3: Verify password mismatch error message', () => {
        cy.visit('https://qa-task.redvike.rocks/');

        // Fill in some data with mismatched passwords
        main_page.set_field(main_page.first_name_field, user_name);
        main_page.set_field(main_page.last_name_field, last_name);
        main_page.set_field(main_page.email_field, 'valid@email.com');
        main_page.set_field(main_page.password_field, 'password123');
        main_page.set_field(main_page.confirm_password_field, 'differentpassword'); // Mismatched password

        // Solve CAPTCHA (assuming successful completion is at 732.5px)
        main_page.swipe_captcha(732.5);

        main_page.click_submit_button();

        // Verify submission failure and password mismatch message
        cy.url().should('not.include', '/success'); // Ensure URL does not change to success page
        cy.contains('Passwords do not match!').should('exist');
    });

    //Test Case 3: Validate CAPTCHA functionality by submitting without completion
    it('Test 3: Verify CAPTCHA blocks form submission if not completed', () => {
        // 1. Visit the application URL
        cy.visit('https://qa-task.redvike.rocks/');

        // 2. Fill in the form fields with valid data
        main_page.set_field(main_page.first_name_field, user_name);
        main_page.set_field(main_page.last_name_field, last_name);
        main_page.set_field(main_page.email_field, email);
        main_page.set_field(main_page.password_field, password);
        main_page.set_field(main_page.confirm_password_field, password);

        // 3. Upload avatar (if needed, assuming 'avatar.jpg' is valid)
        main_page.upload_avatar('avatar.jpg');

        // 4. Slide the captcha slider incompletely (assuming successful completion is at 732.5px)
        main_page.custom_swipe_captcha(300); // Slide to a partial value

        // 5. Submit the form
        main_page.click_submit_button();

        // 6. Verify CAPTCHA error message is displayed
        main_page.form_contains('Please solve the captcha!'); // Expected error message
    });

// Test Case 4: Test the form with various types of images for the avatar and
// verify that the uploaded image is correctly displayed on the success page.
    it('Test 4: Validate avatar upload and display on success page', () => {
        // 1. Visit the application URL
        cy.visit('https://qa-task.redvike.rocks/');

        // 2. Fill in the form fields with valid data
        main_page.set_field(main_page.first_name_field, user_name);
        main_page.set_field(main_page.last_name_field, last_name);
        main_page.set_field(main_page.email_field, email);
        main_page.set_field(main_page.password_field, password);
        main_page.set_field(main_page.confirm_password_field, password);

        // 3. Upload an image exceeding the size limit (expected error)
        main_page.upload_avatar('SampleJPGImage_5mbmb.jpg'); // File name suggests it's larger than 2MB
        main_page.click_submit_button();
        main_page.form_contains('File size must be less than 2 MB.'); // Verify error message

        // 4. Upload a valid avatar image
        main_page.upload_avatar('avatar.jpg'); // Assuming 'avatar.jpg' is within size limit

        // 5. Complete the CAPTCHA and submit the form
        main_page.custom_swipe_captcha(700);
        main_page.click_submit_button();

        // 6. Verify the uploaded image is displayed on the success page
        main_page.uploaded_image_displayed(); // This function should verify the image is present
    });
})