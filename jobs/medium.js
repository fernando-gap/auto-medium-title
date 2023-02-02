import puppeteer from 'puppeteer'
import { writeFile, readFile } from 'node:fs/promises';
import { timeoutSync } from '../utils.js';
import { __dirname  } from '../utils.js';
import path from 'node:path';

async function init() {
    console.log()
    const browser = await puppeteer.launch({
        userDataDir: path.resolve(__dirname, '.cache'),
        headless: true
    })

    const page = await browser.newPage()
    await page.goto('https://medium.com/m/signin')
    await page.setExtraHTTPHeaders({'Accept-Language': 'en-US,en;q=0.9'});
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36')

    return {
        page,
        browser
    }
}

async function draft(page, title) {
    await page.goto('https://medium.com/new-story')
    console.log(await page.content())
    const field =  await page.waitForSelector('h3')
    await field.click()
    await field.type(title, 2000)
    console.log('done', title)
}


(async () => {
    const { browser, page } = await init()
    const title = JSON.parse(await readFile('./jobs/title.json', 'utf-8'))
    title.counter += 1
    await draft(page, 'Day ' + title.counter)
    await writeFile('title.json', JSON.stringify(title))
    await timeoutSync(async () => {
        await browser.close()
    }, 10000)
})()
