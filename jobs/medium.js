import puppeteer from 'puppeteer'
import { writeFile, readFile } from 'node:fs/promises';
import { timeoutSync } from '../utils.js';
import { __dirname, logger } from '../utils.js';
import path from 'node:path';

async function init() {
    const browser = await puppeteer.launch({
        userDataDir: path.resolve(__dirname, '.cache'),
        headless: true
    })
    logger.info('Launch Browser')
    const page = await browser.newPage()
    await page.goto('https://medium.com/m/signin')
    await page.setExtraHTTPHeaders({'Accept-Language': 'en-US,en;q=0.9'});
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36')
    logger.info('Access Medium Home Page')
    return {
        page,
        browser
    }
}

async function draft(page, title) {
    await page.goto('https://medium.com/new-story')
    const field =  await page.waitForSelector('h3')
    await field.click()
    await field.type(title, 2000)
    logger.info(`Type title: ${title}`)
}


(async () => {
    const { browser, page } = await init()
    logger.info('Call to init() completed')
    const titlePath = path.resolve(__dirname, './jobs/title.json')
    const title = JSON.parse(await readFile(titlePath, 'utf-8'))
    title.counter += 1
    logger.info(`Read ${titlePath} contents`)
    await draft(page, title.prefix + title.counter)
    await writeFile(titlePath, JSON.stringify(title))
    logger.info(`Write ${titlePath} new content`)
    await timeoutSync(async () => {
        await browser.close()
        logger.info(`Close browser`)
    }, 10000)
})()
