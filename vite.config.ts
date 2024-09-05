import { defineConfig, Plugin } from "vite";
import path from 'path'
import { readdirSync, statSync, writeFileSync } from "fs";
import { execSync } from "child_process";

function exportManifest(options = {}): Plugin {
    return {
        name: 'export-manifest',
        buildEnd () {
            console.log('\nBuilding service worker...')
            execSync('npm run build:sw')
        },
        async writeBundle(output) {
            const files = []
            const readDir = (dirPath: string) => {
                for (const item of readdirSync(dirPath)) {
                    const p = path.resolve(dirPath, item)

                    if (statSync(p).isDirectory()) {
                        readDir(p)
                    } else if (!p.endsWith('.map')) {
                        files.push(p.replace(output.dir, ''))
                    }
                }
            }

            readDir(output.dir)

            writeFileSync(
                path.resolve(output.dir, 'manifest.json'),
                JSON.stringify({ files }),
                { encoding: 'utf-8' }
            )
        }
    }
}

export default defineConfig({
    plugins: [
        exportManifest()
    ],
})