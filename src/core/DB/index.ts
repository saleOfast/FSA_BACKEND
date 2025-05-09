import { DbConnections } from './postgresdb';



const postgresdb = DbConnections.AppDbConnection;

/**
 * @description Gracefully shutdown resources
 * @returns Promise
 */
const close = async (): Promise<void> => {
    try {
        if (postgresdb.isConnected) {
            await postgresdb.close();
            console.log('PostgresDB connection Closed');
        }
    } catch (error: any) {
        console.log('Error while closing postgresdb', error);
        throw error;
    }
};

/**
 * @description Initialise the application's resources
 * @returns Promise
 */
const start = async () => {
    await close();
    await postgresdb.initialize();
};

/**
 * @description Verify if resources is connected or not
 * @throws Error if not connected
 */
const verifyResourceAccess = async () => {
    if (!postgresdb.isConnected) {
        throw new Error('postgresdb is not connected.');
    }
};


export {
    postgresdb,
    start,
    close,
    verifyResourceAccess
}