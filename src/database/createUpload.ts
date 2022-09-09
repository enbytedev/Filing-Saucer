import { connection } from './databaseDao.js';

export default async (email: string, filename: string) => {
    connection.execute('INSERT INTO `uploads` (`email`, `filename`, `date`) VALUES (?, ?, ?)', [email, filename, Date.now().toString()]);
}