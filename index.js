const core = require('@actions/core');

try {
    const url = core.getInput('url');
    const method = core.getInput('method');
    const requestHeaders = core.getInput('request_headers');
    const requestBody = core.getInput('request_body');
    const expectedStatus = core.getInput('expected_status');
    const expectedHeaders = core.getInput('expected_headers');
    const expectedBody = core.getInput('expected_body');
    const timeout = core.getInput('timeout');

    core.info(`url: ${url}`);
    core.info(`method: ${method}`);
    core.info(`requestHeaders: ${requestHeaders}`);
    core.info(`requestBody: ${requestBody}`);
    core.info(`expectedStatus: ${expectedStatus}`);
    core.info(`expectedHeaders: ${expectedHeaders}`);
    core.info(`expectedBody: ${expectedBody}`);
    core.info(`timeout: ${timeout}`);
} catch (error) {
    core.setFailed(error.message);
}