/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ArnieService {

    /**
     * Get a list of Arnies.
     * Get a list of Arnie summary data.
     * @param page
     * @param pageSize
     * @param sort
     * @returns any A list of Arnies.
     * @throws ApiError
     */
    public static listArnies(
        page?: number,
        pageSize: number = 20,
        sort?: Array<string>,
    ): CancelablePromise<({
        meta: {
            currentPage: number;
            lastPage: number;
            pageSize: number;
            total: number;
        };
    } & {
        data: Array<({
            id: string;
            createdAt: string;
            updatedAt: string;
        } & {
            killCount: number;
            name: string;
        })>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/arnies',
            query: {
                'page': page,
                'pageSize': pageSize,
                'sort': sort,
            },
        });
    }

    /**
     * Get an Arnie.
     * Get a detailed Arnie.
     * @param id
     * @returns any An Arnie.
     * @throws ApiError
     */
    public static getArnieById(
        id: string,
    ): CancelablePromise<({
        id: string;
        createdAt: string;
        updatedAt: string;
    } & ({
        killCount: number;
        name: string;
    } & {
        kills: Array<{
            badGuy: string;
            oneLiner?: string;
            weapon?: string;
        }>;
        one_liner?: string;
    }))> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/arnies/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Update an Arnie.
     * Update an Arnie.
     * @param id
     * @param requestBody
     * @returns any Update result.
     * @throws ApiError
     */
    public static putArnieById(
        id: string,
        requestBody?: ({
            killCount: number;
            name: string;
        } & {
            kills: Array<{
                badGuy: string;
                oneLiner?: string;
                weapon?: string;
            }>;
            one_liner?: string;
        }),
    ): CancelablePromise<{
        id: string;
        createdAt: string;
        updatedAt: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/arnies/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
