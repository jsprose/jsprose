export class JSProseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'JSProseError';
    }
}
