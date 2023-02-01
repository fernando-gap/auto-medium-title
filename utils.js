import { readdir } from 'node:fs/promises';

export async function isDirEmpty(dirname) {
    const files = await readdir(dirname)
    return files.length === 0
}

export async function timeoutSync(callback, ms, ...args) {
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