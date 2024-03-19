import { Login, LoginWithToken } from '../../modules/login/login.type';

const baseApiPath = 'http://localhost:5000/api/';
export const loginWithToken = async ({
    token
}: {
    token: string;
}): Promise<LoginWithToken> => {
    const response = await fetch(`${baseApiPath}me`, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            authorization: `Bearer ${token}`
        })
    });
    const res = await response.json();
    return res;
};

export const doLogin = async ({
    email,
    password
}: {
    email: string;
    password: string;
}): Promise<Login> => {
    const response = await fetch(`${baseApiPath}login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        },
        body: JSON.stringify({ email, password })
    });
    const res = await response.json();
    return res;
};
