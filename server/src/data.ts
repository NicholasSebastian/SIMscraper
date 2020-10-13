import puppeteer from 'puppeteer-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import randomUA from 'modern-random-ua';
import { StudentData, PersonInfo, Subject, Section, Class } from './types';

puppeteer.use(stealth());

const URL = 'https://simconnect.simge.edu.sg/psp/paprd/EMPLOYEE/HRMS/s/WEBLIB_EOPPB.ISCRIPT1.FieldFormula.Iscript_SM_Redirect?cmd=login';
const HTTP_HEADERS = { "Accept-Language": "en,en-US;q=0.9,ja;q=0.8" };

const access = async (username: string, password: string, log: Function) => {
    const browser = await puppeteer.launch({ 
        headless: false,
        args: ['--no-sandbox'],
        ignoreHTTPSErrors: true
    });
    const page = await browser.newPage();
    await page.setUserAgent(randomUA.generate());
    await page.setExtraHTTPHeaders(HTTP_HEADERS);
    await page.setCacheEnabled(false);

    const cookies = await page.cookies();
    await page.deleteCookie(...cookies);

    log('Entering SIMconnect...');
    await page.goto(URL, { timeout: 0, waitUntil: 'load' });

    log('Logging in...');
    await page.select('#User_Type', 'Student');
    await page.type('#userid', username);
    await page.type('#pwd', password);
    await Promise.all([
        page.waitForNavigation({ timeout: 0, waitUntil: 'load' }),
        page.click('#loginbutton')
    ]);

    log('Viewing apps...');
    await Promise.all([
        page.waitForNavigation({ timeout: 0, waitUntil: 'networkidle0' }),
        page.click("body > table:nth-child(2) > tbody > tr:nth-child(1) > td > div > div > table.eppbr_tab_bg.EPPBRLAYOUTTABLE > tbody > tr > td:nth-child(1) > table > tbody > tr > td:nth-child(7) > a")
    ]);

    log('Getting data...');
    const info: PersonInfo | null | undefined =
        await page.evaluate(() => {
            return {
                email: (document.querySelector('#DERIVED_SSS_SCL_EMAIL_ADDR')!.innerHTML).replace(/<\/?[^>]+(>|$)/g, ""),
                homeAddress: (document.querySelector('#DERIVED_SSS_SCL_SSS_LONGCHAR_2')!.innerHTML).replace(/<\/?[^>]+(>|$)/g, ""),
                mailAddress: (document.querySelector('#DERIVED_SSS_SCL_SSS_LONGCHAR_1')!.innerHTML).replace(/<\/?[^>]+(>|$)/g, ""),
                phone: (document.querySelector('#DERIVED_SSS_SCL_DESCR50')!.innerHTML).replace(/<\/?[^>]+(>|$)/g, "")
            };
        });

    log('Viewing timetable...');
    await page.select('#DERIVED_SSS_SCL_SSS_MORE_ACADEMICS', '1002');
    await Promise.all([
        page.waitForNavigation({ timeout: 0, waitUntil: 'networkidle0' }),
        page.click('#DERIVED_SSS_SCL_SSS_GO_1')
    ]);

    log('Loading...');
    const iframe = await page.$('#ptifrmtgtframe').then(element => element?.contentFrame());
    await iframe?.waitForSelector("#ACE_STDNT_ENRL_SSV2\\$0", { timeout: 0, visible: true });
    
    log('Getting name...');
    const name: string | null | undefined = 
        await iframe?.$eval('#DERIVED_SSTSNAV_PERSON_NAME', element => element.textContent);

    log('Getting subject information...');
    const subjects: Subject[] | null | undefined =
        await iframe?.$eval("#ACE_STDNT_ENRL_SSV2\\$0 > tbody", element => {
            let subjects: Subject[] = [];
            for (let i = 1; i < element.childElementCount; i += 2) {    // for each subject
                const subject = element.children[i];
                const subjectName = subject.children[1].children[0].children[0].children[0].children[0].children[0].innerHTML;
                const timetableBody = subject.children[1].children[0].children[0].children[0].children[1].children[0]
                                        .children[0].children[0].children[2].children[1].children[0].children[0].children[0];
                
                let sections: Section[] = [];
                for (let j = 1; j < timetableBody.childElementCount; j++) {     // for each row
                    const row = timetableBody.children[j];

                    if (row.children[1].children.length > 0) {
                        const sectionInfo: Section = {
                            section: row.children[1].children[0].children[0].children[0].innerHTML,
                            component: row.children[2].children[0].children[0].innerHTML,
                            classes: []
                        };
                        sections.push(sectionInfo);
                    }
                    const classInfo: Class = {
                        date: row.children[6].children[0].children[0].innerHTML,
                        daytime: row.children[3].children[0].children[0].innerHTML,
                        room: row.children[4].children[0].children[0].innerHTML,
                        instructor: row.children[5].children[0].children[0].innerHTML
                    };
                    sections[sections.length - 1].classes.push(classInfo);
                }

                subjects.push({ 
                    name: subjectName, 
                    sections 
                });
            }
            return subjects;
        })

    log('Finishing up...');
    await browser.close();

    const data: StudentData = { name, info, subjects };
    return data;
};

export default access;