import core from '@actions/core';
import { K8sClient, KubeConfig, stringify } from '@thinkdeep/k8s';
import * as fs from 'fs';

async function run() {
  try {
    const kubeconfigPath = core.getInput('kubeconfig');
    const kubeResourcesPath = core.getInput('resources');

    const kubeconfig = new KubeConfig();
    kubeconfig.loadFromFile(kubeconfigPath)

    const client = await new K8sClient(kubeconfig).init();

    const kubeResourcesYAML = fs.readFileSync(kubeResourcesPath, 'utf8');
    const deploymentResponse = await client.apply(kubeResourcesYAML);

    const deploymentResponseString = stringify(deploymentResponse);
    console.log(deploymentResponseString);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();