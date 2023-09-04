const { app, BrowserWindow } = require('electron');
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadFile('index.html')
}

app.whenReady()
  .then(() => {
    createWindow();

    app.on('activate', () => {
      console.log('===>>> activate ', BrowserWindow.getAllWindows().length)
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

app.on('window-all-closed', () => {
  console.log('===>>> window-all-closed ', process.platform)
  if (process.platform !== 'darwin') {
    app.quit()
  }
})