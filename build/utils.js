"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getParameterNames(fn) {
    if (typeof fn !== 'function')
        return [];
    var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var code = fn.toString().replace(COMMENTS, '');
    var result = code.slice(code.indexOf('(') + 1, code.indexOf(')'))
        .match(/([^\s,]+)/g);
    return result === null
        ? []
        : result;
}
exports.getParameterNames = getParameterNames;
function GetAllParams(req) {
    return Object.assign(req.params, req.query, req.body);
}
exports.GetAllParams = GetAllParams;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwyQkFBa0MsRUFBWTtJQUMxQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxVQUFVLENBQUM7UUFBQyxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ3hDLElBQUksUUFBUSxHQUFHLGtDQUFrQyxDQUFDO0lBQ2xELElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM1RCxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDekIsTUFBTSxDQUFDLE1BQU0sS0FBSyxJQUFJO1VBQ2hCLEVBQUU7VUFDRixNQUFNLENBQUM7QUFDakIsQ0FBQztBQVRELDhDQVNDO0FBRUQsc0JBQTZCLEdBQWE7SUFDdEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxHQUFHLENBQUMsS0FBSyxFQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4RCxDQUFDO0FBRkQsb0NBRUMifQ==