const fs = require('fs');
const path = require('path');
const typescript = require('typescript');

module.exports = {
    input: ['src/**/*..{ts,tsx}'],
    output: '.',
    options: {
        debug: true,
        removeUnusedKeys: true,
        sort: true,
        lngs: ['de', 'en', 'tr'],
        defaultlng: 'tr',
        func: {
            list: ['i18next.t', 'i18n.t', 't'],
            extensions: ['.ts', '.tsx']
        },
        trans: { component: 'Trans', extensions: ['.js', '.jsx'] },
        resource: {
            loadPath: './src/i18n/{{lng}}/{{ns}}.json',
            savePath: './src/i18n/{{lng}}/{{ns}}.json',
            jsonIndent: 2,
            lineEnding: '\n'
        },
        nsSeperator: false,
        keySeperator: false
    },
    transform:function customTransform(file,enc,done){
        const {base,ext} = path.parse(file.path);
        const options = {
            tsOptions:{target:'ES2020',
            },

            extensions:['.ts','.tsx']
        };

        if (options.extensions.includes(ext) && !base.includes('.d.ts')) {
            const content : fs.readFileSync(file.path, enc);

            const {outputText} = typescript.transpileModule(content,{
                compilerOptions:options.tsOptions,
                fileName:path.basename(file.path)
            });

            this.parser.parseTransFromString(outputText);
            this.parser.parseFuncFromString(outputText)
        }

        done();
    }
};
