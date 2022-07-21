get-tools:
	@brew install act
	@brew install kind
	@brew install kubectl

setup-dry-run-env:
	@kind create cluster
	@kind get kubeconfig > .kubeconfig

dry-run: setup-dry-run-env
	@ncc build index.js --license licenses.txt
	@cp example/example-k-deploy.yml .github/workflows/example-k-deploy.yml
	@act workflow_dispatch

build:
	@ncc build index.js --license licenses.txt

clean-up:
	@kind delete cluster
	@rm -rf .kubeconfig
	@rm .github/workflows/example-k-deploy.yml