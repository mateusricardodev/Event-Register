import { Strategy } from 'passport-jwt';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: {
        sub: string;
        email: string;
        role: string;
    }): Promise<{
        id: string;
        email: string;
        role: string;
    }>;
}
export {};
