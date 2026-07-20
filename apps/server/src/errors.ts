class AppError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode || 500;
	}
}

export class UnauthorizedError extends AppError {
	constructor(message = "unauthorized") {
		super(message, 401);
	}
}

export class ConflictError extends AppError {
	constructor(message = "Conflict Error") {
		super(message, 409);
	}
}
