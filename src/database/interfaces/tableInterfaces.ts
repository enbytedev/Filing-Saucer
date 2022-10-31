export interface IUser {
    userId?: number; // primary key, should auto increment. do not manually assign.
    email: string;
    password: string;
    name: string;
    timezone: string;
}

export interface IToken {
    userId?: string;
    token?: string;
    expires?: string;
}

export interface IUploadOptional {
    fileId?: number; // primary key, should auto increment. do not manually assign.
    userId?: number;
    filename?: string;
    date?: string;
    private?: number;
}

export interface IUpload extends IUploadOptional {
    userId: number;
    filename: string;
    date: string;
    private: number;
}