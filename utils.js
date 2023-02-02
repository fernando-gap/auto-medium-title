import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

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