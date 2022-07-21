import core from '@actions/core';
import k8s from '@kubernetes/client-node';
import kubectl from './src/kubectl.js';
import * as fs from 'fs';

async function run() {
	try {
		
		const kubeconfigPath = core.getInput('kubeconfig');
		const kubeManifestPath = core.getInput('resources');
		const kubeNamespace = core.getInput('namespace');
		const kubeKustomization = core.getInput('kustomize');
		const kustomizeOverlay = core.getInput('overlay');     
		
		if(kubeKustomization == true){
			kube
		}

        const ctl = new kubectl(kubeconfigPath);
        ctl.apply(kubeManifestPath)

	} catch (error) {
		console.log(error)
		core.setFailed(error.message);
	}
}

run();