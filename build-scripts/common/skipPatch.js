// Patch for the module that skips optionalDependencies
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const __rootdir = path.resolve(__dirname, '../..')
let backupData = []
let filePaths = []

if (process.platform === 'win32') {
  const resultArr = fs.readdirSync('patches').filter(file => /fs-xattr+.*\.patch$/gm.test(file))
  filePaths = [...filePaths, ...resultArr]
}

if (filePaths) {
  for (const fileName of filePaths) {
    const filePath = path.join(__rootdir, `patches/${fileName}`)
    try {
      backupData.push(fs.readFileSync(filePath))
    } catch (err) {
      console.error(`Failed to backup file: ${filePath}. Error: ${err}`);
    }
    try {
      fs.unlinkSync(filePath);
      console.log(`File ${filePath} deleted successfully.`);
    } catch (err) {
      console.error(`Failed to delete file: ${filePath}. Error: ${err}`);
    }
  }
}

const result = execSync('npx patch-package', {
  cwd: __rootdir
})
console.log(`Patch package result: ${result.toString()}`)

process.on('exit', () => {
  if (backupData.length) {
    for (const index in backupData) {
      const filePath = path.join(__rootdir, `patches/${filePaths[index]}`)
      try {
        fs.writeFileSync(filePath, backupData[index]);
        console.log(`File ${filePath} restored successfully.`);
      } catch (err) {
        console.error(`Failed to restore file: ${filePath}. Error: ${err}`);
      }
    }
    
  }
  console.log('Restored patch file before exit')
})
