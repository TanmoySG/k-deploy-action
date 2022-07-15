const core = require('@actions/core');


// most @actions toolkit packages have async methods
async function run() {
  try {
    const kubeconfigPath = core.getInput('kubeconfig');
    core.info(`Kubeconfig Path ${kubeconfigPath}.`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();