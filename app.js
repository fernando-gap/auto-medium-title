#! /usr/bin/env node
import Bree from 'bree'
import path from 'node:path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(path.join(__dirname, 'jobs', 'medium'))
const bree = new Bree({
    root: path.join(__dirname, 'jobs'),
    jobs: [
        {
            name: 'medium',
            interval: 'at 01:00 pm'
        }
    ]
})

await bree.start()
