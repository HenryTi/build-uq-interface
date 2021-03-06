import fetch from 'node-fetch';
import * as fs from 'fs';
import { build, DevConfig, UqBuildContext, UqConfig, Web } from './tonwa-core';
import { TsTemplate } from 'tonwa-core/uqBuild/TsTemplate';

class NodeWeb extends Web {
    fetch(url: string, init?: any): Promise<any> {
        return fetch(url, init);
    }
}

class UqBuildContextUI extends UqBuildContext {
    get uiPlatform(): string { return 'react' };
    get uiPlatformUpper(): string { return 'REACT' };
    get uiPlatformCamel(): string { return 'React' }
    get element(): string { return 'JSX.Element' }
}

(async function () {
    console.log('start building ts-uq-react!');
    let cwd = process.cwd();
    let uqAppPath = cwd + '/src/uq-app';
    if (fs.existsSync(uqAppPath) === false) {
        uqAppPath = cwd + '/uq-app';
        if (fs.existsSync(uqAppPath) === false) {
            console.error(`Folder '${uqAppPath}' not exists`);
            return;
        }
    }
    let jsonUqConfigs = cwd + '/src/uqconfig.json';
    if (fs.existsSync(jsonUqConfigs) === false) {
        console.error(`uqConfigs.json in ${cwd}/src not exists:`, jsonUqConfigs);
        return;
    }
    if (fs.existsSync(uqAppPath + '/uqs') === false) {
        fs.mkdirSync(uqAppPath + '/uqs');
    }

    let json = fs.readFileSync(jsonUqConfigs, 'utf8');
    let uqConfigs = uqsFromConfigs(JSON.parse(json));
    let web = new NodeWeb();
    await build(uqConfigs, new UqBuildContextUI(web, uqAppPath));
})();

function uqsFromConfigs(uqConfigs: any): UqConfig[] {
    let { devs, uqs } = uqConfigs;
    return uqs.map((v: any) => {
        let { dev, name, alias } = v;
        return {
            dev: devs[dev],
            name,
            alias,
        };
    });
}
