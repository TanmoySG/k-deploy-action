import core from '@actions/core';
import { K8sClient, KubeConfig, stringify } from '@thinkdeep/k8s';
import * as fs from 'fs';

async function run() {
  try {
    const kubeconfigPath = core.getInput('kubeconfig');
    const kubeDeployments = core.getInput('deployments');

    const kubeconfig = new KubeConfig();
    kubeconfig.loadFromFile(kubeconfigPath)

    const client = await new K8sClient(kubeconfig).init();

    const deploymentYAMLString = fs.readFileSync(kubeDeployments, 'utf8');
    const deploymentResponse = await client.create(deploymentYAMLString);

    const deploymentResponseString = stringify(deploymentResponse);
    console.log(deploymentResponseString);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();