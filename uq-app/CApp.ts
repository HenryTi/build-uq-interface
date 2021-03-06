//=== UqApp builder created on Fri Feb 25 2022 11:38:12 GMT-0500 (北美东部标准时间) ===//
import { CUqApp } from "./CBase";
import { res } from "./res";
import { VMain } from "./VMain";
import { setUI } from "./uqs";

const gaps = [10, 3,3,3,3,3,5,5,5,5,5,5,5,5,10,10,10,10,15,15,15,30,30,60];

export class CApp extends CUqApp {
    protected async internalStart(isUserLogin: boolean) {
        this.setRes(res);
        setUI(this.uqs);
        
        this.openVPage(VMain, undefined, this.dispose);
    }

    private timer:any;
    protected onDispose() {
        clearInterval(this.timer);
        this.timer = undefined;
    }

    private tick = 0;
    private gapIndex = 0;
    private callTick = async () => {
        try {
            if (!this.user) return;
            ++this.tick;
            if (this.tick<gaps[this.gapIndex]) return;
            this.tick = 0;
            if (this.gapIndex < gaps.length - 1) ++this.gapIndex;
            let ret = await this.uqs.BzHelloTonwa.$poked.query(undefined, false);
            let v = ret.ret[0];
            if (v === undefined) return;
            if (!v.poke) return;
            this.gapIndex = 1;

            // 数据服务器提醒客户端刷新，下面代码重新调入的数据
            //this.cHome.refresh();
        }
        catch {
        }
    }
}
