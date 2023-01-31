import Bree from 'bree'

const bree = new Bree({
    jobs: [
        {
            name: 'medium',
            interval: 'at 01:00 am'
        }
    ]
})

await bree.start()
