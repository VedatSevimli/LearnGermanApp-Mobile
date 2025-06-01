import { Login, LoginWithToken } from '../../modules/login/login.type';
import { Question } from '../../modules/verbs/verbs.type';
import api from '../api';
const baseApiPath = process.env.REACT_APP_API_URL;

export const loginWithToken = async ({
    token
}: {
    token: string;
}): Promise<LoginWithToken> => {
    const response = await api(`${baseApiPath}me`, {
        method: 'GET',
        headers: {
            authorization: `Bearer ${token}`
        }
    });

    return response;
};

export const doLogin = async ({
    email,
    password
}: {
    email: string;
    password: string;
}): Promise<Login> => {
    const response = await api(`${baseApiPath}login`, {
        method: 'POST',
        headers: {},
        body: JSON.stringify({ email, password })
    });

    return response;
};
type Register = {
    name: string;
    lastName: string;
    email: string;
    password: string;
};
export const register = async (userData: Register) => {
    const response = await api(`${baseApiPath}register`, {
        method: 'POST',
        headers: {},
        body: JSON.stringify({ ...userData })
    });

    return response;
};

export const saveUserProccess = async (userProgress: {
    email: string;
    word: string;
    wrongAnswers: { question: Question; userAnswer: number }[];
    progressValue: string;
}) => {
    const response = await api(`${baseApiPath}save-user-proccess`, {
        method: 'POST',
        headers: {},
        body: JSON.stringify(userProgress)
    });

    return response;
};
