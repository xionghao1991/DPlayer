import { createFilter } from '@rollup/pluginutils';
import { extname } from 'path';
import template from '@cnst/art-template';
import precompile from '@cnst/art-template/lib/precompile';

const defaults = {
    exclude: null,
    include: null,
};

const allowExts = ['.art', '.html', '.htm'];



function artTemplate(opts) {
    if (opts === void 0) {
        opts = {};
    }

    const options = Object.assign({}, defaults, opts);
    const filter = createFilter(options.include, options.exclude);

    return {
        name: 'artTemplate',

        transform(source, id) {
            if (!filter(id)) {
                return null;
            }
            if (!allowExts.includes(extname(id))) {
                // not an image
                return null;
            }

            // const use = (match, url) => {
            //     let code;
            //     const output = 'raw';
            //     match = match.toString();
            //     if (isUrlRequest(url, htmlResourceRoot)) {
            //         const urlRequest = urlToRequest(url, htmlResourceRoot);
            //         const attr = match.split(url);
            //         const codes = [attr[0], urlRequest, attr[1]].map(JSON.stringify);
            //         let result = self.load(codes[1]);
            //         console.log(result);
            //         code = codes[0] + `+import(${codes[1]})+` + codes[2];
            //     } else {
            //         code = JSON.stringify(match);
            //     }
            //     console.log(code);
            //     return {
            //         output,
            //         code,
            //     };
            // };


            if (options.rules === undefined) {
                options.rules = [];
            }

            if (options.ignore === undefined) {
                options.ignore = [];
            }
            options.debug = false;
            options.rules.push(...template.defaults.rules);

            // htmlResourceRules.forEach(test => {
            //     options.rules.push({
            //         test,
            //         use,
            //     });
            // });


            options.sourceRoot = process.cwd();
            options.ignore.push(`require`);

            options.source = source;
            options.filename = id;
            let result = precompile(options);
            const x = {
                code: result.toString(),
                map: { mappings: result.sourceMap },
            };

            return x;
        },
    };
}


export default artTemplate;
