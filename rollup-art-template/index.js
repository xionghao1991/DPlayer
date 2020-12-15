import { createFilter } from '@rollup/pluginutils';
import { extname } from 'path';
import { readFileSync } from 'fs';

const defaults = {
    exclude: null,
    include: null
};

const allowExts = ['.art', '.html', '.htm'];

function artTemplate(opts) {
    if (opts === void 0) {opts = {};}

    const options = Object.assign({}, defaults, opts);
    const filter = createFilter(options.include, options.exclude);

    return {
        name:"artTemplate",
        load(id) {
            if (!filter(id)) {
                return null;
            }
            if (!allowExts.includes(extname(id))) {
                // not an image
                return null;
            }
            const source = readFileSync(id, "utf-8").replace(/[\r\n]+/gm, '');
            console.log(source);
            return null;
        }
    };
}

export default artTemplate;
