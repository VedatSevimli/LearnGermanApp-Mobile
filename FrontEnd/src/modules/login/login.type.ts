import { Question } from '../verbs/verbs.type';

export {};
type Progress = {
    wrongAnswers: { question: Question; userAnswer: number }[];
    word: string;
    progress: number;
};
export type UserData = {
    _id: string;
    name: string;
    lastName: string;
    email: string;
    progress: [Progress];
    token?: string;
};
export type LoginWithToken = {
    success: boolean;
    data: UserData;
    message: string;
};

export interface Login {
    success: boolean;
    message: string;
    data: UserData;
}
