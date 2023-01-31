import dotenv from 'dotenv'
import puppeteer from 'puppeteer'
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { writeFile, readFile, readdir } from 'node:fs/promises';

dotenv.config()

async function isDirEmpty(dirname) {
    const files = await readdir(dirname)
    return files.length === 0
}

async function init() {
    const userDataDir = './.cache'
    const isEmpty = await isDirEmpty(userDataDir)

    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: userDataDir
    })

    const page = await browser.newPage()
    await page.goto('https://medium.com/m/signin')

    if (isEmpty) {
        const rl = readline.createInterface({ input, output });
        await page.goto('https://medium.com/m/signin')

        const signin = await page.waitForSelector('div > button')
        await signin.click()

        const email = await page.waitForSelector('input')
        await email.type(process.env.EMAIL, 2000)

        const submit = await page.waitForSelector('button')
        await submit.click()

        const link = await rl.question('Auth Link: ')
        await page.goto(link)
    }

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

async function timeoutSync(callback, ms, ...args) {
    return new Promise((s, r) => {
        setTimeout(async () => {
            try {
                await callback(...args)
                s()
            } catch(e) {
                r(e)
            }
        }, ms)
    })
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
