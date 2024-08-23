class Validator {
    constructor() {
        this.rules = {};
    }

    addRule(field, rule, errorMessage) {
        if (!this.rules[field]) {
            this.rules[field] = [];
        }
        this.rules[field].push({ rule, errorMessage });
    }

    validateField(fieldElement) {
        const field = fieldElement.name;
        const value = fieldElement.value;
        const errors = [];

        if (this.rules[field]) {
            this.rules[field].forEach(({ rule, errorMessage }) => {
                if (!rule(value)) {
                    errors.push(errorMessage);
                }
            });
        }

        return errors;
    }

    validateForm(form) {
        const errors = {};
        Object.keys(this.rules).forEach(field => {
            const fieldElement = form.querySelector(`[name="${field}"]`);
            const fieldErrors = this.validateField(fieldElement);
            if (fieldErrors.length > 0) {
                errors[field] = fieldErrors;
            }
        });
        return errors;
    }

    displayErrors(form, errors) {
        // Clear previous errors
        form.querySelectorAll('.error-message').forEach(errorElem => {
            errorElem.innerText = '';
        });

        // Display new errors
        Object.keys(errors).forEach(field => {
            const fieldElement = form.querySelector(`[name="${field}"]`);
            const errorContainer = fieldElement.nextElementSibling;
            errorContainer.innerText = errors[field].join(', ');
        });
    }

    clearErrors(form) {
        form.querySelectorAll('.error-message').forEach(errorElem => {
            errorElem.innerText = '';
        });
    }
}

// Example usage
const form = document.querySelector('#myForm');
const validator = new Validator();

// Password criteria elements
const lengthCriteria = document.getElementById('length');
const numberCriteria = document.getElementById('number');
const specialCriteria = document.getElementById('special');

validator.addRule('username', value => value.length >= 3, 'Username must be at least 3 characters long.');
validator.addRule('email', value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), 'Invalid email format.');
validator.addRule('password', value => value.length >= 6, 'Password must be at least 6 characters long.');
validator.addRule('password', value => /[0-9]/.test(value), 'Password must contain at least one number.');
validator.addRule('password', value => /[!@#$%^&*(),.?":{}|<>]/.test(value), 'Password must contain at least one special character.');

// Live validation with checklist update
form.querySelector('#password').addEventListener('input', (e) => {
    const value = e.target.value;

    // Update criteria checklist
    lengthCriteria.classList.toggle('valid', value.length >= 6);
    numberCriteria.classList.toggle('valid', /[0-9]/.test(value));
    specialCriteria.classList.toggle('valid', /[!@#$%^&*(),.?":{}|<>]/.test(value));

    // Validate field
    const fieldErrors = validator.validateField(e.target);
    const errorContainer = e.target.nextElementSibling.nextElementSibling;
    errorContainer.innerText = fieldErrors.join(', ');
});

// Form submission validation
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errors = validator.validateForm(form);
    if (Object.keys(errors).length === 0) {
        alert('Form submitted successfully!');
        validator.clearErrors(form);
        // Proceed with form submission (e.g., AJAX request)
    } else {
        validator.displayErrors(form, errors);
    }
});
