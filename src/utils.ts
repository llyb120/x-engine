import { Request } from 'express';
export function getParameterNames(fn: Function) {
    if (typeof fn !== 'function') return [];
    var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var code = fn.toString().replace(COMMENTS, '');
    var result = code.slice(code.indexOf('(') + 1, code.indexOf(')'))
        .match(/([^\s,]+)/g);
    return result === null
        ? []
        : result;
}

export function GetAllParams(req : Request){
    return Object.assign(req.params,req.query,req.body); 
}
