import dotenv from 'dotenv';
import path from 'path';

export const config = () => {
	const envPath = process.env.ENV_PATH || path.resolve(process.cwd(), '.env');
	dotenv.config({ path: envPath });

	const environment = process.env.NODE_ENV || 'production';
	console.log('NODE_ENV detected:', environment);
	console.log('All environment variables:', process.env);
	
	// Environment-based database configuration
	let dbConfig: {
		userName: string;
		password: string;
		host: string;
		port: number;
		dbName: string;
		isSynchronize: string;
		ssl?: boolean;
	};
	
	switch (environment) {
		case 'local':
			console.log('local');
			dbConfig = {
				userName: process.env.LOCAL_DBUSERNAME || 'postgres',
				password: process.env.LOCAL_DBPASSWORD || 'admin123',
				host: process.env.LOCAL_DBHOST || 'localhost',
				port: parseInt(process.env.LOCAL_DBPORT || '5432'),
				dbName: process.env.LOCAL_DBNAME || 'fsa_local_database',
				isSynchronize: process.env.LOCAL_IS_SYNCHRONIZE || 'true',
				ssl: false
			};
			break;
			
		case 'development':
			console.log('development');
			dbConfig = {
				userName: process.env.DEV_DBUSERNAME || '4449923_saleofast',
				password: process.env.DEV_DBPASSWORD || 'saleoFast879',
				host: process.env.DEV_DBHOST || 'pgdb1.awardspace.net',
				port: parseInt(process.env.DEV_DBPORT || '5432'),
				dbName: process.env.DEV_DBNAME || '4449923_saleofast',
				isSynchronize: process.env.DEV_IS_SYNCHRONIZE || 'false',
				ssl: false
			};
			break;
			
		case 'production':
		default:
			console.log('production');
			dbConfig = {
				userName: process.env.DBUSERNAME || 'kloudmart',
				password: process.env.DBPASSWORD || 'ubi2hu3ffe2iac',
				host: process.env.DBHOST || '185.176.41.104',
				port: parseInt(process.env.DBPORT || '5432'),
				dbName: process.env.DBNAME || 'kloudmart',
				isSynchronize: process.env.IS_SYNCHRONIZE || 'true',
				ssl: process.env.DB_SSL === 'require'
			};
			break;
	}
	
	console.log(`Connecting to ${environment} database: ${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`);
	
	return {
		environment,
		postgresDBUrl: process.env.POSTGRESDB_URL || '',
		...dbConfig,
		privateKey: process.env.PRIVATEKEY,
		expiry: process.env.EXPIRY,
		accessKey: process.env.AWSACCESSKEY,
		secretKey: process.env.AWSSECRETKEY,
		region: process.env.AWSREGION,
		bucketName: process.env.AWSBUCKETNAME
	};
};

export const validateConfig = () => {
	const cfg = config() as any;
	Object.keys(cfg).forEach((key) => {
		if (cfg[key] === undefined || typeof cfg[key] === 'undefined' || cfg[key] === '') {
			throw new Error(`Please define "${key}" configuration value. See your .env file or the environment variables
            of your system to configure the missing paramenters`);
		}
	});
	return true;
};
