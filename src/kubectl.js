import { exec } from '@actions/exec'

export default class kubectl {

    constructor(kubeconfig, namespace) {
        this.kubeconfig = kubeconfig
        this.namespace = namespace
    }

    apply(manifest) {
        exec('kubectl', ['apply', '-f', manifest, '-n', this.namespace, '--kubeconfig', this.kubeconfig]).then(
            (exitcode) => { }
        )
    }

    kustomize(overlay) {
        exec('kubectl', ['apply', '-k', overlay, '-n', this.namespace, '--kubeconfig', this.kubeconfig]).then(
            (exitcode) => { }
        )
    }
}
