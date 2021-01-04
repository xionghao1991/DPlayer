import { createFilter } from '@rollup/pluginutils';
import { extname } from 'path';
import urlToRequest from './urlToRequest';
import template from '@cnst/art-template';
import precompile from '@cnst/art-template/lib/precompile';

const defaults = {
    exclude: null,
    include: null,
};

const allowExts = ['.art', '.html', '.htm'];

const path = require('path');

export function isUrlRequest(url, root) {
    // An URL is not an request if

    // 1. It's an absolute url and it is not `windows` path like `C:\dir\file`
    if (/^[a-z][a-z0-9+.-]*:/i.test(url) && !path.win32.isAbsolute(url)) {
        return false;
    }

    // 2. It's a protocol-relative
    if (/^\/\//.test(url)) {
        return false;
    }

    // 3. It's some kind of url for a template
    if (/^[{}[\]#*;,'§$%&(=?`´^°<>]/.test(url)) {
        return false;
    }

    // 4. It's also not an request if root isn't set and it's a root-relative url
    if ((root === undefined || root === false) && /^\//.test(url)) {
        return false;
    }

    return true;
}

function artTemplate(opts) {
    if (opts === void 0) {
        opts = {};
    }

    const options = Object.assign({}, defaults, opts);
    const filter = createFilter(options.include, options.exclude);
    let htmlResourceRules = [/\bsrc="([^"]*)"/];
    const htmlResourceRoot = options.htmlResourceRoot;
    const use = (match, url) => {
        let code;
        const output = 'raw';
        match = match.toString();

        if (isUrlRequest(url, htmlResourceRoot)) {
            const urlRequest = urlToRequest(url, htmlResourceRoot);
            const attr = match.split(url);
            const codes = [attr[0], urlRequest, attr[1]].map(JSON.stringify);
            code = codes[0] + `+require(${codes[1]})+` + codes[2];
        } else {
            code = JSON.stringify(match);
        }

        return {
            output,
            code,
        };
    };

    if (options.htmlResourceRules !== undefined) {
        if (Array.isArray(options.htmlResourceRules)) {
            htmlResourceRules = options.htmlResourceRules;
        } else if (options.htmlResourceRules === false) {
            htmlResourceRules = [];
        } else {
            throw new Error(`Invalid value to options parameter htmlResourceRules`);
        }
    }

    if (options.rules === undefined) {
        options.rules = [];
    }

    if (options.ignore === undefined) {
        options.ignore = [];
    }

    options.rules.push(...template.defaults.rules);
    htmlResourceRules.forEach(test => {
        options.rules.push({
            test,
            use,
        });
    });


    options.sourceRoot = process.cwd();
    options.ignore.push(`require`);
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
            options.source = source;
            options.filename = id;
            let result = precompile(options);
            const code = result.toString();
            const x = {
                code: code,
                map: { mappings: '' },
            };

            return x;
        },
    };
}


export default artTemplate;
