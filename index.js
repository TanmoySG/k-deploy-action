import core from '@actions/core';
import kubectl from './src/kubectl.js';

async function run() {
	try {
		const kubeconfigPath = core.getInput('kubeconfig');
		const kubeNamespace = core.getInput('namespace');
		const kubeKustomization = core.getBooleanInput('kustomize');

		const ctl = new kubectl(kubeconfigPath, kubeNamespace);

		if (kubeKustomization == false) {
			const kubeManifestPath = core.getInput('resources');
			ctl.apply(kubeManifestPath)
		} else {
			const kustomizeOverlay = core.getInput('overlay');
			ctl.kustomize(kustomizeOverlay);
		}

	} catch (error) {
		console.log(error)
		core.setFailed(error.message);
	}
}

run();