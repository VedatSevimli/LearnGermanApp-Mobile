export {};
export type LoginWithToken = {
    success: boolean;
    data: {
        _id: string;
        name: string;
        lastName: string;
        email: string;
    };
    message: string;
};

export interface Login {
    success: boolean;
    token: string;
    message: string;
    userName: string;
    userlastName: string;
}
