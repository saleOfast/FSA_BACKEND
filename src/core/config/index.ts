import dotenv from 'dotenv';
import path from 'path';

export const config = () => {
	const x = { path: path.join(__dirname, '../../../.env') }
	console.log(x);
	// console.log(x);

	dotenv.config(x);

	// Select DB credentials based on environment
	const env = (process.env.NODE_ENV || 'production').toLowerCase();
	const isLocal = env === 'local' || env === 'development';
	const isDev = env === 'development';

	const dbUserName = isLocal
		? (process.env.LOCAL_DBUSERNAME || process.env.DBUSERNAME || 'postgres')
		: (isDev ? (process.env.DEV_DBUSERNAME || process.env.DBUSERNAME) : process.env.DBUSERNAME) || 'postgres';

	const dbPassword = isLocal
		? (process.env.LOCAL_DBPASSWORD || process.env.DBPASSWORD || 'rootpassword')
		: (isDev ? (process.env.DEV_DBPASSWORD || process.env.DBPASSWORD) : process.env.DBPASSWORD) || 'rootpassword';

	const dbHost = isLocal
		? (process.env.LOCAL_DBHOST || process.env.DBHOST || 'localhost')
		: (isDev ? (process.env.DEV_DBHOST || process.env.DBHOST) : process.env.DBHOST) || 'localhost';

	const dbPort = isLocal
		? parseInt(process.env.LOCAL_DBPORT || process.env.DBPORT || '5432')
		: parseInt((isDev ? (process.env.DEV_DBPORT || process.env.DBPORT) : process.env.DBPORT) || '5432');

	const dbName = isLocal
		? (process.env.LOCAL_DBNAME || process.env.DBNAME || 'testdb')
		: (isDev ? (process.env.DEV_DBNAME || process.env.DBNAME) : process.env.DBNAME) || 'testdb';

	const isSynchronize = isLocal
		? (process.env.LOCAL_IS_SYNCHRONIZE || process.env.IS_SYNCHRONIZE || 'false')
		: (isDev ? (process.env.DEV_IS_SYNCHRONIZE || process.env.IS_SYNCHRONIZE) : process.env.IS_SYNCHRONIZE) || 'false';

	return {
		environment: process.env.NODE_ENV,
		postgresDBUrl: process.env.POSTGRESDB_URL || '',
		port: process.env.PORT || '',
		dbUserName,
		dbPassword,
		dbHost,
		dbPort,
		dbName,
		isSynchronize,
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
