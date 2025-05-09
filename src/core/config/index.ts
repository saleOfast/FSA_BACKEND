import dotenv from 'dotenv';
import path from 'path';

export const config = () => {
	const x = { path: path.join(__dirname, '../../../.env') }
	console.log(x);
	// console.log(x);

	dotenv.config(x);
	return {
		environment: process.env.NODE_ENV,
		postgresDBUrl: process.env.POSTGRESDB_URL || '',
		port: process.env.PORT || '',
		dbUserName: process.env.DBUSERNAME || 'postgres',
		dbPassword: process.env.DBPASSWORD || 'rootpassword',
		dbHost: process.env.DBHOST || 'localhost',
		dbPort: parseInt(process.env.DBPORT || '5432'),
		dbName: process.env.DBNAME || 'testdb',
		isSynchronize: process.env.IS_SYNCHRONIZE || 'false',
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
