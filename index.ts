import axios from 'axios';
import * as core from '@actions/core';
import isEqual from 'lodash.isequal';

function parseKeyValue(input: string) {
    if (!input) return {};

    return input.split(',').reduce((result, item) => {
        const [key, value] = item.split('=');
        result[key.trim()] = value.trim();
        return result;
    }, {});
}

async function apiCheck() {
    const maxRetries = parseInt(core.getInput('max_retries')) || 100;
    const retryDelay = parseInt(core.getInput('retry_delay')) || 1000;
    const url = core.getInput('url') || 'https://example.com';
    const method = core.getInput('method') || 'GET';
    const headers = parseKeyValue(core.getInput('request_headers') || '');
    const body = core.getInput('request_body') || '';
    const expectedPassCount = parseInt(core.getInput('expected_pass_count')) || 1;
    const expectedStatus = parseInt(core.getInput('expected_status')) || 200;
    const expectedHeaders = parseKeyValue(core.getInput('expected_headers') || '');
    const expectedBody = core.getInput('expected_body') ? JSON.parse(core.getInput('expected_body')) : {};
    const timeout = parseInt(core.getInput('timeout')) || 3000;

    const options = {
        url,
        method,
        headers,
        data: body ? JSON.parse(body) : {},
        timeout: timeout
    };

    let passCount:number = 0;
    for(let i=0; i<maxRetries; i++) {
        try {
            const response = await axios(options);

            if(response.status === expectedStatus) {
                let isPass = true;

                // Validate headers
                for(const key in expectedHeaders) {
                    if(response.headers[key] !== expectedHeaders[key]) {
                        core.setFailed(`Header ${key} returned ${response.headers[key]}, but expected ${expectedHeaders[key]}`);
                        isPass = false;
                        break;
                    }
                }

                // Validate body
                if(isPass && expectedBody) {
                    const responseBody = response.data;
                    if(!isEqual(responseBody, expectedBody)) {
                        core.setFailed(`Body returned ${JSON.stringify(responseBody)}, but expected ${JSON.stringify(expectedBody)}`);
                        isPass = false;
                    }
                }

                if(isPass) {
                    passCount++;
                    if(passCount === expectedPassCount)
                        break;
                }
            }
            else {
                core.setFailed(`API returned status ${response.status}, but expected ${expectedStatus}`);
                break;
            }
        }
        catch(error) {
            core.error(`API request failed: ${error}`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }

    if(passCount < expectedPassCount)
        core.setFailed(`API didn't pass as expected: ${passCount} out of ${expectedPassCount}`);
}

apiCheck().catch(error => core.setFailed(error.message));
