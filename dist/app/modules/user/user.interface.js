"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IActive = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SUPERADMIN"] = "SUPERADMIN";
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["GUIDE"] = "GUIDE";
})(Role || (exports.Role = Role = {}));
var IActive;
(function (IActive) {
    IActive["ACTIVE"] = "ACTIVE";
    IActive["INACTIVE"] = "INACTIVE";
    IActive["BLOCKED"] = "BLOCKED";
})(IActive || (exports.IActive = IActive = {}));
