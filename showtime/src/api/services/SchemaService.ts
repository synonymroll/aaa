/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SchemaService {

    /**
     * Get the OpenAPI definition.
     * Get the OpenAPI definition.
     * @returns any The OpenAPI definition.
     * @throws ApiError
     */
    public static getOpenApi(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/openapi.json',
        });
    }

}
