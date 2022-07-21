import { exec } from '@actions/exec'
import kustomize from './kustomize.js';


export default class kubectl extends kustomize {

    constructor(kubeconfig) {
        super()
        this.kubeconfig = kubeconfig
    }

    apply(manifest) {
        exec('kubectl', ['apply', '-f', manifest, '--kubeconfig', this.kubeconfig]).then(
            (exitcode) => {}
        )
    }

    kustomize(overlay, outputfile){
        const k = new kustomize()
        return k.build(overlay, outputfile)
    }
}
