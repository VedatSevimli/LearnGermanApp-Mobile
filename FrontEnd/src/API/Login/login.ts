import { getCustomConfig } from '../../App';
import { Login, LoginWithToken } from '../../modules/login/login.type';
import { Question } from '../../modules/verbs/verbs.type';
import { getApiBasePath } from '../../utils/util';
import api from '../api';

export const loginWithToken = async ({
    token
}: {
    token: string;
}): Promise<LoginWithToken> => {
    const response = await api(`${getApiBasePath()}me`, {
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
    const response = await api(`${getApiBasePath()}login`, {
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
    const response = await api(`${getApiBasePath()}register`, {
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
    const response = await api(`${getApiBasePath()}save-user-proccess`, {
        method: 'POST',
        headers: {},
        body: JSON.stringify(userProgress)
    });

    return response;
};
