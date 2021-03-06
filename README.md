# K-Deploy Action

`k-deploy-action` is a GitHub Action that can be used to build CI/CD pipeline to deploy an app to any Kubernetes Enviroment. Also supports Kustomization.

## Usage

The action can be used as

```yaml
- name: Kubernetes Deployment
  uses: TanmoySG/k-deploy-action@v0.2.2-alpha
  with:
    kubeconfig: path/to/kubeconfig
    namespace: 'default'
    manifest: path/to/resources/file
```

Using Kustomization

```yaml
- name: Kubernetes Deployment
  uses: TanmoySG/k-deploy-action@v0.2.2-alpha
  with:
    kubeconfig: path/to/kubeconfig
    namespace: 'default'
    kustomize: true
    overlay: 'path-to/deploy/overlay/something'
```

## Configuration

The Action can be configures using inputs

| Input Name | Required | Default | Description |
| ---------- | -------- | ------- | ----------- |
| kubeconfig | Yes      | None | Path to Kubeconfig for the Kubernetes cluster. Default Context is used. |
| namespace  | No       | `default` |Namespace to make the deployment in. Default: 'default' |
| mainifest  | No, if using kustomize, otherwise Yes  | None | Manifest File required for Deploying the Application with all configurations. [Ref.](https://kubernetes.io/docs/concepts/cluster-administration/manage-deployment/) |
| kustomize  | No | `false` | Boolean - true if using kustomize, else false |
| overlay    | Yes, if using kustomize | None | Path to kustomization overlay |

Currently this action supports all resources defined in a [single YML file](https://kubernetes.io/docs/concepts/cluster-administration/manage-deployment/). Multiple Resources File support will be added soon.

### Best Practices

While using the k-deploy action it is important that the kubeconfig file is not added to the repository without properly securing it. No authentiation file like the kubeconfig or certificates should be added without encrypting them, or securing them in some other way. It is highly recommended that kubeconfigs and certs should NOT be added to the repository.

To tackle this, one may use one of the following ways to secure the things.

- Kubeconfig and Certs can be stored using GitHub Secrets. Add a step before using the `k-deploy-action` that takes the secrets and creates the required files (kubeconfig and certs) in runtime of the workflow, and specify the path where the files were created in the k-deploy inputs.

```yml
- name: Generate Kubeconfig and Certs
  run: |
    echo ${{ secrets.KUBECONFIG }} > path/to/deploy.kubeconfig
    echo ${{ secrets.CERTS }} > path/to/cert

- name: Kubernetes Deployment
  uses: TanmoySG/k-deploy-action@v0.2.2-alpha
  with:
    kubeconfig: path/to/deploy.kubeconfig
    namespace: 'default'
    manifest: path/to/resources/file

- name: Clean-Up
  run: |
    rm path/to/deploy.kubeconfig
    rm path/to/cert
```

- The Kubeconfigs and Certs can be encrypted and added to the repository. While during the workflow runtime, the encrypted files are decrypted using a key stored in GitHub Secrets and used in the k-deploy inputs. Keys for decryption can also be stored in some cloud Key Management Service.

```yml
- name: Decrypt Kubeconfigs and Certs
  run: |
    ./decrypt kubeconfig.encrypted -k ${{ secret.DECRYPTION_KEY}} > path/to/deploy.kubeconfig
    ./decrypt certs.encrypted -k ${{ secret.DECRYPTION_KEY}} > path/to/cert

- name: Kubernetes Deployment
  uses: TanmoySG/k-deploy-action@v0.2.2-alpha
  with:
    kubeconfig: path/to/deploy.kubeconfig
    namespace: 'default'
    manifest: path/to/resources/file

- name: Clean-Up
  run: |
    rm path/to/deploy.kubeconfig
    rm path/to/cert
```

## Local Testing

Testing this action locally requires you to clone the repo and run the following commands.
```sh
# Installs the dependancies - kind, kubectl and act
make get-tools

# run the sample action - example/example-k-deploy.yml
make dry-run

# cleanup
make clean-up
```

The local testing depends on [act](https://github.com/nektos/act), a tool to run GitHub Actions locally.

## Known Issues

- Context Setting is not available so it picks up default context.
- Kubeconfig and certs should be in same directory for a certificate based authentication to work.
- Currently only a single resource file is supported.

## Notes

- [Report Bugs here](https://github.com/TanmoySG/k-deploy-action/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBug+Fix%5D)
- [Feature Additions/Requests](https://github.com/TanmoySG/k-deploy-action/issues/new?assignees=TanmoySG&labels=enhancement&template=feature-development.md&title=%5BFeature%5D)
- [Please leave your feedback about using the action.](https://github.com/TanmoySG/k-deploy-action/issues/new?assignees=&labels=&template=feedback.md&title=%5BFeedback%5D)
