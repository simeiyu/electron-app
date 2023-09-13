const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('path')

function getNewWindow(id) {
  let allWins = BrowserWindow.getAllWindows();
  for (let i = 0; i < allWins.length; i++) {
    if (`${allWins[i]._id}` === `${id}`) {
      return allWins[i];
    }
  }
  return null;
}

function interceptUrl(url) {
  let startIdx = url.indexOf('proxr')
  if(startIdx === -1) {
    startIdx = url.indexOf('proxy')
  }
  if(startIdx === -1) {
    return url;
  }
  return path.join(appConfig.RtoOrigin, url.slice(startIdx));
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
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

ipcMain.on('openParams', (event) => {
  const parentWindow = BrowserWindow.fromWebContents(event.sender);
  const child = new BrowserWindow({
    minWidth: 960,
    width: 960,
    minHeight: 600,
    height: 600,
    parent: parentWindow, 
    modal: true, 
    title: '节点参数',
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      // contextIsolation: false,
      // webviewTag: true
    },
  });
  child.setMenuBarVisibility(false);
  child.loadFile('./params.html')
  const view = new BrowserView({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  child.setBrowserView(view)
  view.setBounds({ x: 0, y: 50, width: 300, height: 300 })
  view.webContents.loadFile('./a.html')

  ipcMain.on('tabChange', (evt, tab) => {
    console.log('==== main tab change ', tab)
    view.webContents.loadFile(`./${tab}.html`)
  })
})
ipcMain.handle('text', () => {
  return "Hello my electron"
})