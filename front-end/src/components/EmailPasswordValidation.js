function validatePassword(password) {
    const upperCheckRegex = /^(?=.*[A-Z])/;
    const lowerCheckRegex = /^(?=.*[a-z])/;
    const digitCheckRegex = /^(?=.*\d)/;

    return {
        upperCase: upperCheckRegex.test(password),
        lowerCase: lowerCheckRegex.test(password),
        digit: digitCheckRegex.test(password),
        length: password.length >= 8
    }
};

function validateEmail(email) {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
};

export { validatePassword, validateEmail};