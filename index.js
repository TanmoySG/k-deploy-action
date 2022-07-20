import core from '@actions/core';
import k8s from '@kubernetes/client-node';
import * as fs from 'fs';

async function run() {
	try {
		const kubeconfigPath = core.getInput('kubeconfig');
		const kubeResourcesPath = core.getInput('resources');
		const kubeNamespace = core.getInput('namespace');

		const kc = new k8s.KubeConfig();
		kc.loadFromFile(kubeconfigPath);

		const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
		const kubeResourcesYAML = fs.readFileSync(kubeResourcesPath, 'utf8');

		const kubeDeploymentResources = k8s.loadYaml(kubeResourcesYAML)

		k8sApi.createNamespacedDeployment(kubeNamespace, kubeDeploymentResources).then(
			(response) => {
				core.info('Yay! \nYou spawned: ' + amazingDeployment.metadata.name);
			},
			(err) => {
				core.info('Oh no. Something went wrong :(');
				core.setFailed(err);
			}
		);
	} catch (error) {
		core.setFailed(error.message);
	}
}

run();