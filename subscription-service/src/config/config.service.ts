class ConfigService{
    constructor(private env: string | undefined) {}

    public isProduction(): boolean {
        return this.env === 'production';
    }

    public getEnv() {
        return this.env || 'development';
    }

    public getBrockerUri() {
        return process.env.BROKER_URL ?? 'amqps://...';
    }

    public getPort(){
        return process.env.PORT ?? 3001;
    }
}

const configService = new ConfigService(process.env.NODE_ENV);
export { configService };
