import http from 'k6/http';
import { check } from 'k6';

export const options = {
    scenarios: {
        ramping_request_rate: {
            executor: 'ramping-arrival-rate',
            startRate: 100,
            timeUnit: '1s',
            preAllocatedVUs: 200,
            maxVUs: 1000,
            stages: [
                { target: 500, duration: '30s' },
                { target: 1000, duration: '1m' },
                { target: 2000, duration: '1m' },
                { target: 0, duration: '10s' },
            ],
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.03'],
    },
};

export default function () {
    const res = http.get('http://aa6ac53156c5e4fa0804c1be3d8fd667-241574558.us-west-2.elb.amazonaws.com/https://httpbin.org/get', {
        headers: {
            Origin: 'http://example.com',
        },
    });
    check(res, {
        'status was 200': (r) => r.status === 200,
    });
}
