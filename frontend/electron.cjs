const { app, BrowserWindow } = require('electron');
const path = require('path'); // NOU: Ajuda a trobar la ruta de l'arxiu

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Inventari Immobiliari",
    autoHideMenuBar: true,
    // NOU: Línia per carregar la teva icona!
    icon: path.join(__dirname, 'icon.png') 
  });

  win.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});