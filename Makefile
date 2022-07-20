get-tools:
	@brew install act
	@brew install kind
	@brew install kubectl

setup-dry-run-env:
	@kind create cluster
	@kind get kubeconfig > .kubeconfig


act-dry-run: setup-dry-run-env
	@ncc build index.js --license licenses.txt
	@cp example/example-k-deploy.yml .github/workflows/example-k-deploy.yml
	@act workflow_dispatch
	@rm .github/workflows/example-k-deploy.yml

build:
	@ncc build index.js --license licenses.txt

teardown-dry-run-env:
	@kubectl delete deployment logsmith
	@kind delete cluster
	@rm -rf .kubeconfig