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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const modern_random_ua_1 = __importDefault(require("modern-random-ua"));
puppeteer_extra_1.default.use(puppeteer_extra_plugin_stealth_1.default());
const URL = 'https://simconnect.simge.edu.sg/psp/paprd/EMPLOYEE/HRMS/s/WEBLIB_EOPPB.ISCRIPT1.FieldFormula.Iscript_SM_Redirect?cmd=login';
const HTTP_HEADERS = { "Accept-Language": "en,en-US;q=0.9,ja;q=0.8" };
const scraper = (username, password, log) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_extra_1.default.launch({
        headless: false,
        args: ['--no-sandbox'],
        ignoreHTTPSErrors: true
    });
    const page = yield browser.newPage();
    yield page.setUserAgent(modern_random_ua_1.default.generate());
    yield page.setExtraHTTPHeaders(HTTP_HEADERS);
    yield page.setCacheEnabled(false);
    const cookies = yield page.cookies();
    yield page.deleteCookie(...cookies);
    log('Entering SIMconnect...');
    yield page.goto(URL, { timeout: 0, waitUntil: 'load' });
    log('Logging in...');
    yield page.select('#User_Type', 'Student');
    yield page.type('#userid', username);
    yield page.type('#pwd', password);
    yield Promise.all([
        page.waitForNavigation({ timeout: 0, waitUntil: 'load' }),
        page.click('#loginbutton')
    ]);
    log('Viewing apps...');
    yield Promise.all([
        page.waitForNavigation({ timeout: 0, waitUntil: 'networkidle0' }),
        page.click("body > table:nth-child(2) > tbody > tr:nth-child(1) > td > div > div > table.eppbr_tab_bg.EPPBRLAYOUTTABLE > tbody > tr > td:nth-child(1) > table > tbody > tr > td:nth-child(7) > a")
    ]);
    log('Viewing timetable...');
    yield page.select('#DERIVED_SSS_SCL_SSS_MORE_ACADEMICS', '1002');
    yield Promise.all([
        page.waitForNavigation({ timeout: 0, waitUntil: 'networkidle0' }),
        page.click('#DERIVED_SSS_SCL_SSS_GO_1')
    ]);
    log('Extracting data');
    const content = yield page.$('#ptifrmtgtframe').then(element => element === null || element === void 0 ? void 0 : element.contentFrame());
    // content?.waitForSelector("#ACE_STDNT_ENRL_SSV2\\$0", { timeout: 0 });
    content === null || content === void 0 ? void 0 : content.evaluate(() => {
        const stuff = document.documentElement.innerHTML;
        console.log(stuff);
    });
    // const subjectSchedule = await page.$eval(
    //     "#ACE_STDNT_ENRL_SSV2\$0 > tbody", element => {
    //         return element.innerHTML;
    //     });
    log('Finishing up...');
    const html = yield page.content();
    yield browser.close();
    return html;
});
const app = express_1.default();
const PORT = process.env.PORT || 8000;
app.get('/', (req, res) => {
    res.write("<h1>Please wait...</h1>");
    scraper('nshendra001', 'c7jcbEdROB', (log) => res.write(log + '<br/>'))
        .then(html => {
        res.write(html);
        res.end();
    });
});
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
//# sourceMappingURL=index.js.map