export declare const Models: Record<string, import("sequelize").ModelStatic<any>>;
export interface FastlyOptions {
    modelDir: string;
    db: {
        dialect: 'mysql' | 'postgres' | 'sqlite';
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
    };
    tablePrefix?: string;
    apiPrefix?: string;
    swagger?: boolean;
    redoc?: boolean;
    logStartupInfo: boolean;
}
export declare function Faster(options: FastlyOptions): import("express-serve-static-core").Express;
//# sourceMappingURL=index.d.ts.map