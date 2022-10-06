export interface IUser {
    userId?: string; // primary key, should auto increment. do not manually assign.
    email: string;
    password: string;
    name: string;
    timezone: string;
}

export interface IToken {
    email?: string;
    token?: string;
    expires?: string;
}

export interface IUploadOptional {
    fileId?: string; // primary key, should auto increment. do not manually assign.
    userId?: string;
    filename?: string;
    date?: string;
    private?: number;
}

export interface IUpload extends IUploadOptional {
    userId: string;
    filename: string;
    date: string;
    private: number;
}