class CustomError extends Error {
    constructor(message, code) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
    }
}

const createError = (message, code) => {
    return new CustomError(message, code);
};


