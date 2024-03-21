**Setup**
Clone this repository:

git clone https://github.com/ppotanin/qa-task.redvike.rocks


**Install dependencies:**

_`cd automated-form-testing`_

`npm install`

**Running Tests**

Open a terminal in the project directory.

Start the Cypress test runner:

`cypress open` or `npm run cypress:open`
`cypress run` or `npm run cypress:run`

**Test Cases**

_This project includes automated test cases for the following scenarios:_

Test Case 1: Submit form with valid data and verify successful submission.

Test Case 2: Submit form with invalid data (empty fields, mismatched passwords, incorrect email format) and verify validation errors.

Test Case 3: Attempt form submission without completing the CAPTCHA and verify it's blocked.

Test Case 4: Upload various image types for the avatar and verify successful display on the success page.

