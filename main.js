const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  ipcMain.on('set-title', (event, title) => {
    // webContents是一个EventEmitter. 负责渲染和控制网页, 是 BrowserWindow 对象的一个属性。
    const webContents = event.sender;  
    const _win = BrowserWindow.fromWebContents(webContents);
    _win.setTitle(title);
    _win.maximize()
  })

  win.loadFile('index.html')
}

app.whenReady()
  .then(() => {
    ipcMain.handle('ping', () => 'pong')

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