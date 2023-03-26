module.exports = {
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['dotenv/config'],
};