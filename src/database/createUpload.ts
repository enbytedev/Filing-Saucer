import { connection } from './databaseDao.js';

export default async (email: string, filename: string, originalname: string) => {
    connection.execute('INSERT INTO `uploads` (`email`, `filename`, `originalname`, `date`, `private`) VALUES (?, ?, ?, ?, 0)', [email, filename, originalname, Date.now().toString()]);
}