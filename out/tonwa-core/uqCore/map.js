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
exports.Map = exports.UqMap = void 0;
const entity_1 = require("./entity");
const action_1 = require("./action");
const caller_1 = require("./caller");
class UqMap extends entity_1.Entity {
    constructor() {
        super(...arguments);
        this.actions = {};
        this.queries = {};
    }
    get typeName() { return 'map'; }
    setSchema(schema) {
        super.setSchema(schema);
        this.schemaFrom = this.schema.from;
        let { actions, queries, keys } = schema;
        this.uq.buildFieldTuid(this.keys = keys);
        for (let i in actions) {
            let actionSchema = actions[i];
            let { name } = actionSchema;
            let action = this.uq.newAction(name, undefined);
            action.setSchema(actionSchema);
            action.buildFieldsTuid();
            this.actions[i] = action;
        }
        for (let i in queries) {
            let querySchema = queries[i];
            let { name } = querySchema;
            let query = this.uq.newQuery(name, undefined);
            query.setSchema(querySchema);
            query.buildFieldsTuid();
            this.queries[i] = query;
        }
    }
    add(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield new AddCaller(this, param).request();
            return ret;
        });
    }
    del(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield new DelCaller(this, param).request();
            return ret;
        });
    }
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield new AllCaller(this, undefined).request();
            return ret;
        });
    }
    page(param, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield new PageCaller(this, { pageStart: pageStart, pageSize: pageSize, param: param }).request();
            return ret;
        });
    }
    query(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let qc = new QueryCaller(this, param);
            let ret = yield qc.request();
            return ret;
        });
    }
    table(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.query(params);
            for (let i in ret) {
                return ret[i];
            }
        });
    }
    obj(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.table(params);
            if (ret.length > 0)
                return ret[0];
        });
    }
    scalar(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.obj(params);
            for (let i in ret)
                return ret[i];
        });
    }
}
exports.UqMap = UqMap;
class Map extends UqMap {
}
exports.Map = Map;
class MapCaller extends caller_1.EntityCaller {
    get entity() { return this._entity; }
    get path() { return undefined; }
    innerCall() {
        return __awaiter(this, void 0, void 0, function* () {
            let caller = this.getCaller(this.params);
            let res = yield this.entity.uqApi.xcall(caller);
            let ret = caller.xresult(res.res);
            return { res: ret };
        });
    }
    buildParams() {
        let p = super.buildParams();
        return p;
    }
}
class AddCaller extends MapCaller {
    getCaller(param) {
        return new MapAddCaller(this.entity, this.entity.actions.add, param);
    }
}
class DelCaller extends MapCaller {
    getCaller(param) {
        return new MapDelCaller(this.entity, this.entity.actions.add, param);
    }
}
class AllCaller extends MapCaller {
    getCaller(param) {
        return new MapAllCaller(this.entity, this.entity.queries.all, param);
    }
}
class PageCaller extends MapCaller {
    getCaller(param) {
        return new MapPageCaller(this.entity, this.entity.queries.page, param);
    }
}
class QueryCaller extends MapCaller {
    getCaller(param) {
        return new MapQueryCaller(this.entity, this.entity.queries.query, param);
    }
}
class MapAddCaller extends action_1.ActionSubmitCaller {
    constructor(map, action, params) {
        super(action, params);
        this.map = map;
    }
    get path() { return `map/${this.map.name}/add`; }
    get headers() { return undefined; }
}
class MapDelCaller extends action_1.ActionSubmitCaller {
    constructor(map, action, params) {
        super(action, params);
        this.map = map;
    }
    get path() { return `map/${this.map.name}/del`; }
    get headers() { return undefined; }
}
class MapAllCaller extends caller_1.QueryPageCaller {
    constructor(map, query, params) {
        super(query, params);
        this.map = map;
    }
    get path() { return `map/${this.map.name}/all`; }
    get headers() { return undefined; }
}
class MapPageCaller extends caller_1.QueryPageCaller {
    constructor(map, query, params) {
        super(query, params);
        this.map = map;
    }
    get path() { return `map/${this.map.name}/page`; }
    get headers() { return undefined; }
}
class MapQueryCaller extends caller_1.QueryQueryCaller {
    constructor(map, query, params) {
        super(query, params);
        this.map = map;
    }
    get path() { return `map/${this.map.name}/query`; }
    get headers() { return undefined; }
}
//# sourceMappingURL=map.js.map