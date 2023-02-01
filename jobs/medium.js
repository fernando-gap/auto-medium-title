import puppeteer from 'puppeteer'
import { writeFile, readFile } from 'node:fs/promises';
import { timeoutSync } from '../utils.js';

async function init() {
    const browser = await puppeteer.launch({
        userDataDir: './.cache',
        headless: true
    })

    const page = await browser.newPage()
    await page.goto('https://medium.com/m/signin')

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
}


(async () => {
    const { browser, page } = await init()
    const title = JSON.parse(await readFile('./jobs/title.json', 'utf-8'))
    title.counter += 1
    await draft(page, 'Day ' + title.counter)
    await writeFile('title.json', JSON.stringify(title))
    await timeoutSync(async () => {
        await browser.close()
    }, 15000)
})()
