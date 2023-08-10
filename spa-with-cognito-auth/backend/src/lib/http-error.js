export class HttpError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.name = this.constructor.name
    }
}

export class BadRequestError extends HttpError {
    constructor(message = 'Bad Request') {
        super(message, 400)
        this.name = this.constructor.name // f.e. BadRequestError
    }
}

function httpErrorHandler(error) {
    const statusCode = error.statusCode || 500;
    const responseBody = {
        name: error.name,
        message: error.message,
    }

    if (error instanceof HttpError) {
        if (error instanceof BadRequestError) {
            console.error('Bad request error is caught by the error handler', error);

            return {
                statusCode,
                body: JSON.stringify(responseBody),
            };
        }

        console.error('HttpError is caught by the error handler', error)
        return {
            statusCode,
            body: JSON.stringify(responseBody),
        }
    }

    console.error('An unknown error is caught by the error handler \n', error)
    return {
        statusCode,
        body: JSON.stringify(responseBody),
    };
}

export function withErrorHandler(fn) {
    return async function handler(event) {
        try {
            return await fn(event)
        } catch (error) {
            return httpErrorHandler(error)
        }
    }
}
