#! /usr/bin/env node
import Bree from 'bree'
import path from 'node:path'
import { __dirname, logger } from './utils.js'


console.log(path.join(__dirname, 'jobs', 'medium'))
const bree = new Bree({
    root: path.join(__dirname, 'jobs'),
    logger: logger,
    jobs: [
        {
            name: 'medium',
            // interval: 'at 01:00 pm'
        }
    ]
})

await bree.start()
