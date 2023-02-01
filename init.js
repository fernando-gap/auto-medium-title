import { mkdir } from 'node:fs/promises';
import puppeteer from 'puppeteer'
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import dotenv from 'dotenv'
import { isDirEmpty } from './utils.js';
dotenv.config()


async function init() {
    const userDataDir = './.cache'
    let isEmpty = false
    try {
        isEmpty = await isDirEmpty(userDataDir)
    } catch(e) {
        isEmpty = true
        await mkdir(userDataDir)
    }

    if (isEmpty) {
        const browser = await puppeteer.launch({
            headless: false,
            userDataDir: userDataDir
        })

        const page = await browser.newPage()
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
    } else {
        console.log('Nothing to do. `.cache` already exists!')
    }
}

init()
