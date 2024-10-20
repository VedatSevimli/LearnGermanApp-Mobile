export const getDefConv = (learnedVerbs: string[]) => {
    return [
        {
            parts: [
                {
                    text: `I am learning german. Now i know some words: ${learnedVerbs.join(
                        ', '
                    )}. I would like you to help me learn German. The sentences which you. The sentences you use when answering must be very simple and understandable. If I don't understand something, I'll ask you. You have to explain it very well and simply. And off course you have to speak always in german language! `
                }
            ],
            role: 'user'
        },
        {
            parts: [
                {
                    text: "Alright let's start"
                }
            ],
            role: 'model'
        }
    ];
};
