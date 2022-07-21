import { exec } from '@actions/exec'

export default class kustomize {
    constructor() {
        return this
    }

    build(overlay, outputfile) {
        exec('kustomize', ['build', overlay, '>', outputfile]).then(
            (exitcode) => {
                return outputfile
            }
        )
    }
}