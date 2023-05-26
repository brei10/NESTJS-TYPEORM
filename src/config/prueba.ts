

export const EnvConfiguration = () => (
    {
        DB_PASSWORD : process.env.DB_PASSWORD || 'string',
        DB_NAME : process.env.DB_NAME || 'string',
        DB_HOST : process.env.DB_HOST  || 'string',
        DB_PORT : process.env.DB_PORT  || 'string',
    }
)