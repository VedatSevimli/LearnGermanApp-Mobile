const whiteList = ['http://localhost:3000', ''];

export const corsOptions = (req, callback) => {
    let corsoptions;
    console.log(req.header('Origin'));
    if (whiteList.indexOf(req.header('Origin')) !== -1) {
        corsoptions = { origin: true };
    } else {
        corsoptions = { origin: false };
    }

    callback(null, corsOptions);
};
