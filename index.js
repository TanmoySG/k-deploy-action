const core = require('@actions/core');

const fs = require('fs');


// most @actions toolkit packages have async methods
async function run() {
  try {
    const kubeconfigPath = core.getInput('kubeconfig');
    core.info(`Kubeconfig Path ${kubeconfigPath}.`);

    fs.readFile(kubeconfigPath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      core.info(data);
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();