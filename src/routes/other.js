import express from "express";
const router = express.Router()
import os from 'node:os'
// import { fork } from 'child_process'


router.get('/info', (_req, res) => {
    const processInfo = {
        args:process.argv.splice(2),
        platform: process.platform,
        version: process.version,
        title: process.title,
        execPath: process.execPath,
        processId: process.pid,
        rss: process.memoryUsage().rss,
        numberOfProcessors: os.cpus().length
    }
    // console.log(processInfo)
    res.status(200).json(processInfo)
})

// const randomNumbersGeneratorFork = fork('./src/functions/randomNumbersGenerator.js')

// router.get('/randoms', (req, res) => {
//     const cant = req.query.cant || 100000000;
    
//     // randomNumbersGeneratorFork.on('message', (resultado) => {
//         res.status(200).json(resultado)
//     // })
//     // randomNumbersGeneratorFork.send(cant)
//     console.log('Lista Generada')
// })

export default router;
