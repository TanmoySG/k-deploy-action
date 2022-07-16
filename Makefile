get-act:
	@brew install act

act-dry-run:
	@ncc build index.js --license licenses.txt
	@act