export interface IUser {
    email?: string;
    password?: string;
    name?: string;
    timezone?: string;
    uploads?: string;
}

export interface IToken {
    email?: string;
    token?: string;
    expires?: string;
}

export interface IUpload {
    email?: string;
    filename?: string;
    originalname?: string;
    date?: string;
    private?: number;
}

export interface IUserStrict extends IUser {
    email: string;
    password: string;
    name: string;
    timezone: string;
}

export interface IUploadStrict extends IUpload {
    email: string;
    filename: string;
    originalname: string;
    date: string;
    private: number;
}