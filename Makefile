get-act:
	@brew install act

act-dry-run:
	@ncc build index.js --license licenses.txt
	@cp example/example-k-deploy.yml .github/workflows/example-k-deploy.yml
	@act