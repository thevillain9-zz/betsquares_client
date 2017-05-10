import { IUser } from './iuser';

export interface ILoginResponse {
    success: boolean;
    message : string;
    token: string;
    user: IUser;
    status: number;
    statusText: string;
}