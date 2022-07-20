import { exec } from '@actions/exec'


export default class kubectl {

    constructor() {
        return this
    }

    execute(args){
        await exec('kubectl', ...args)
    }

}