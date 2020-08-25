import express from 'express';
import { EngineConfig } from './classes/EngineConfig';
export { checkRoute, checkRouteSync } from './classes/EngineRoute';
export { checkConfig, checkConfigSync } from './classes/EngineConfig';
export declare class ServerInstance {
    _app: express.Application;
    _server: any;
    _config: EngineConfig;
    running: boolean;
    constructor();
    start(callback?: any): Promise<unknown> | undefined;
    stop(callback?: any): Promise<unknown> | undefined;
    changeResponse(method: string, path: string, responseName: string, callback?: any): Promise<unknown> | undefined;
    createSync(config: EngineConfig): {
        result: string | null;
        error: string | null;
    };
    create(config: EngineConfig, callback?: any): Promise<unknown>;
    private createEngine;
}
