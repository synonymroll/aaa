/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ArnieDetailed = ({
    killCount: number;
    name: string;
} & {
    kills: Array<{
        badGuy: string;
        oneLiner?: string;
        weapon?: string;
    }>;
    one_liner?: string;
});

