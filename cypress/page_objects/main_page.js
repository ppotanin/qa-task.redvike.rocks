export class Main_page {
// Selectors for form elements
    first_name_field = '[name="first_name"]';
    last_name_field = '[name="last_name"]';
    email_field = '[name="email"]';
    password_field = '[name="password"]';
    confirm_password_field = '[name="confirm_password"]';
    avatar_field = '[name="avatar"]';

    // Selectors for CAPTCHA slider
    slider_trumb = '#slider-thumb';
    locked_slider_text = 'Slide to Submit';
    slider_track = '#slider-track';
    unlocked_slider_text = 'Unlocked';

    // Submit button and verification selectors
    submit_button = 'form';

    // Methods for interacting with form elements

    // Form interaction methods
    set_field(element, text) {
        return cy.get(element)
            .should('be.visible')
            .should('be.empty')
            .clear()
            .type(text)
            .should('have.value', text);
    }

    upload_avatar(file) {
        cy.fixture(file).as('test_image')
        cy.get(this.avatar_field).then(function (el) {
            const blob = Cypress.Blob.base64StringToBlob(this.test_image, 'image/jpg')
            const file = new File([blob], 'test.jpg', {type: 'image/jpg'})
            const list = new DataTransfer()
            list.items.add(file)
            el[0].files = list.files
            el[0].dispatchEvent(new Event('change', {bubbles: true}))
        })
    }

    swipe_captcha(moving_px_value) {
        // Check if the captcha is initially locked
        cy.get(this.slider_trumb).should('contain.text', this.locked_slider_text)

        // Get the slider track element
        cy.get(this.slider_track).then(($sliderTrack) => {
            // Get the initial position of the slider thumb
            const initialLeft = parseFloat($sliderTrack.find(this.slider_trumb).css('left'))

            // Simulate dragging the slider thumb to unlock the captcha
            cy.get(this.slider_trumb).trigger('mousedown', {which: 1, pageX: initialLeft})
            cy.get(this.slider_trumb).trigger('mousemove', {pageX: initialLeft + moving_px_value}) // Adjust as needed
            cy.get(this.slider_trumb).trigger('mouseup')

            // Check if the captcha is unlocked after dragging
            cy.get(this.slider_trumb).should('contain.text', this.unlocked_slider_text)
        })
    }

    custom_swipe_captcha(moving_px_value) {
        // Check if the captcha is initially locked
        cy.get(this.slider_trumb).should('contain.text', this.locked_slider_text)

        // Get the slider track element
        cy.get(this.slider_track).then(($sliderTrack) => {
            // Get the initial position of the slider thumb
            const initialLeft = parseFloat($sliderTrack.find(this.slider_trumb).css('left'))

            // Simulate dragging the slider thumb to unlock the captcha
            cy.get(this.slider_trumb).trigger('mousedown', {which: 1, pageX: initialLeft})
            cy.get(this.slider_trumb).trigger('mousemove', {pageX: initialLeft + moving_px_value}) // Adjust as needed
            cy.get(this.slider_trumb).trigger('mouseup')
        })
    }

    click_submit_button() {
        cy.get(this.submit_button)
            .submit()
    }

    url_contains(path) {
        cy.url().should('include', path)
    }

    form_contains(value) {
        cy.contains(value)
            .should('be.visible')
    }

    set_empty_field_and_submit_form(element) {
        cy.get(element)
            .should('be.visible')
            .clear()
            .click()
        // Optional: Use .type('{enter}') to simulate pressing Enter key
        this.click_submit_button()
    }

    uploaded_image_displayed() {
        cy.get('img[src*=".jpg"]')
            // Check if the image is visible
            .should('be.visible')
    }

    check_field_error_messege(element, message) {
        cy.window().then((win) => {
            const fieldInput = win.document.querySelector(`input[name="${element}"]`);

            // Check if the element is found
            if (fieldInput) {
                const validationMessage = fieldInput.validationMessage;
                expect(validationMessage).to.include(message);
            } else {
                // Handle element not found error (optional: throw an error or log a message)
                console.error(`Element with name "${element}" not found.`);
            }
        });
    }
}