import * as toolCache from '@actions/tool-cache';

import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

const defaultKubectlVersion = '1.20.2'
const defaultKustomizeVersion = '4.0.5'

const TOOLS = [
    {
        name: 'kubectl',
        defaultVersion: defaultKubectlVersion,
        isArchived: false,
        commandPathInPackage: 'kubectl'
    },
    {
        name: 'kustomize',
        defaultVersion: defaultKustomizeVersion,
        isArchived: true,
        commandPathInPackage: 'kustomize'
    },
]

function getDownloadURL(commandName, version) {
    switch (commandName) {
        case 'kubectl':
            return util.format(
                'https://storage.googleapis.com/kubernetes-release/release/v%s/bin/linux/amd64/kubectl',
                version
            )
        case 'kustomize':
            return util.format(
                'https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2Fv%s/kustomize_v%s_linux_amd64.tar.gz',
                version,
                version
            )
    }
}

async function downloadTool(version, tool) {
    let cachedToolPath = toolCache.find(tool.name, version)
    let commandPathInPackage = tool.commandPathInPackage
    let commandPath = ''

    if (!cachedToolPath) {
        const downloadURL = getDownloadURL(tool.name, version)

        try {
            const packagePath = await toolCache.downloadTool(downloadURL)

            if (tool.isArchived) {
                const extractTarBaseDirPath = util.format(
                    '%s_%s',
                    packagePath,
                    tool.name
                )

                fs.mkdirSync(extractTarBaseDirPath)

                const extractedDirPath = await toolCache.extractTar(
                    packagePath,
                    extractTarBaseDirPath
                )

                if (commandPathInPackage.indexOf('%s') > 0) {
                    commandPathInPackage = util.format(commandPathInPackage, version)
                }
                commandPath = util.format(
                    '%s/%s',
                    extractedDirPath,
                    commandPathInPackage
                )
            } else {
                commandPath = packagePath
            }
        } catch (exception) {
            throw new Error(`Download ${tool.name} Failed! (url: ${downloadURL})`)
        }
        cachedToolPath = await toolCache.cacheFile(
            commandPath,
            tool.name,
            tool.name,
            version
        )
        // eslint-disable-next-line no-console
        console.log(`${tool.name} version '${version}' has been cached`)
    } else {
        // eslint-disable-next-line no-console
        console.log(`Found in cache: ${tool.name} version '${version}'`)
    }
    const cachedCommand = path.join(cachedToolPath, tool.name)
    fs.chmodSync(cachedCommand, '777')
    return cachedCommand
}

export async function getTools() {
    TOOLS.forEach(async function (tool) {
        const cachedPath = await downloadTool(tool.defaultVersion, tool)
        core.addPath(path.dirname(cachedPath))
    })
}