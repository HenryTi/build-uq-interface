"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryPageCaller = exports.QueryQueryCaller = exports.ActionCaller = exports.EntityCaller = void 0;
const web_1 = require("../web");
class EntityCaller extends web_1.Caller {
    constructor(entity, params, $$user = undefined, waiting = true) {
        super(params, $$user, waiting);
        this.tries = 0;
        this._entity = entity;
    }
    get entity() { return this._entity; }
    //大多的entityCaller都不需要这个
    //buildParams() {return this.entity.buildParams(this.params);}
    request() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.entity.loadSchema();
            let ret = yield this.innerRequest();
            return ret;
        });
    }
    innerCall() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.entity.uqApi.xcall(this);
        });
    }
    innerRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            let jsonResult = yield this.innerCall();
            let { $uq, $modify, res } = jsonResult;
            this.entity.uq.pullModify($modify);
            if ($uq === undefined) {
                let ret = this.xresult(res);
                return ret;
            }
            return yield this.retry($uq);
        });
    }
    xresult(res) { return res; }
    get headers() {
        let { ver, uq } = this.entity;
        let { uqVersion } = uq;
        return {
            uq: `${uqVersion}`,
            en: `${ver}`,
        };
    }
    retry(schema) {
        return __awaiter(this, void 0, void 0, function* () {
            ++this.tries;
            if (this.tries > 5)
                throw new Error(`${schema.entity.name} can not get right uq response schema, 5 tries`);
            this.rebuildSchema(schema);
            return yield this.innerRequest();
        });
    }
    rebuildSchema(schema) {
        let { uq, entity } = schema;
        if (uq !== undefined) {
            this.entity.uq.buildEntities(uq);
        }
        if (entity !== undefined) {
            this.entity.setSchema(entity);
        }
    }
}
exports.EntityCaller = EntityCaller;
class ActionCaller extends EntityCaller {
    get entity() { return this._entity; }
}
exports.ActionCaller = ActionCaller;
class QueryQueryCaller extends EntityCaller {
    get entity() { return this._entity; }
    ;
    get path() { return `query/${this.entity.name}`; }
    xresult(res) {
        let data = this.entity.unpackReturns(res);
        return data;
    }
    buildParams() { return this.entity.buildParams(this.params); }
}
exports.QueryQueryCaller = QueryQueryCaller;
class QueryPageCaller extends EntityCaller {
    get params() { return this._params; }
    ;
    get entity() { return this._entity; }
    ;
    //results: {[name:string]:any[]};
    get path() { return `query-page/${this.entity.name}`; }
    buildParams() {
        let { pageStart, pageSize, params } = this.params;
        let p;
        if (params === undefined) {
            p = { key: '' };
        }
        else {
            p = this.entity.buildParams(params);
        }
        /*
        switch (typeof params) {
            case 'undefined': p = {key: ''}; break;
            default: p = _.clone(params); break;
        }
        */
        p['$pageStart'] = pageStart;
        p['$pageSize'] = pageSize;
        return p;
    }
    ;
    xresult(res) {
        let ret = this.entity.unpackReturns(res);
        //return this.results.$page;// as any[];
        return ret;
    }
}
exports.QueryPageCaller = QueryPageCaller;
//# sourceMappingURL=caller.js.map