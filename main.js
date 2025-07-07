const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { exec } = require("child_process"); // gunakan exec, bukan spawn
const { spawn } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  mainWindow.loadFile("index.html");
  mainWindow.on("closed", () => (mainWindow = null));
}

// Fungsi bukaCmd
async function bukaCmd() {
  console.log("==Fungsi bukaCmd dipanggil");
  return new Promise((resolve) => {
    exec("start cmd.exe", { windowsHide: false }, (error) => {
      if (error) {
        console.error("❌ Gagal buka CMD:", error);
        resolve("❌ Gagal membuka CMD: " + error.message);
      } else {
        console.log("✅ CMD berhasil dibuka");
        resolve("✅ CMD berhasil dibuka");
      }
    });
  });
}

// Fungsi bukaCMD2
async function bukaCmd2() {
  console.log("==Fungsi bukaCmd2 dipanggil");

  const perintah = `start cmd.exe /k "${`echo.`}&&${`echo.`}&&${`echo.`}&&${`echo.`}&&${`echo.`}&&${`echo ============================================================================`}&&${`echo Evolusi Parking . 2025`}&&${`echo ============================================================================`}&&${`echo Gunakan terminal untuk keadaan darurat seperti error install paket dan sebagainya.`} && ${`echo Silahkan minimize CMD bila saat ini sedang tidak dibutuhkan.`} &&${` echo.`} && ${`echo Versi Node.js`}&&${`node -v`} && ${`echo ============================================================================`} && ${`echo.`}&&${`echo.`}&&${`echo.`}&&${`echo.`}&&${`echo.`}"`;

  return new Promise((resolve) => {
    exec(perintah, { windowsHide: false }, (error) => {
      if (error) {
        console.error("❌ Gagal buka CMD:", error);
        resolve("❌ Gagal membuka CMD: " + error.message);
      } else {
        console.log("✅ CMD berhasil dibuka");
        resolve("✅ CMD berhasil dibuka");
      }
    });
  });
}

// Fungsi cekVersiNode
async function cekVersiNode() {
  console.log("==Fungsi cekVersiNode dipanggil");
  return new Promise((resolve, reject) => {
    exec("node -v", { windowsHide: true }, (error, stdout) => {
      if (error) {
        console.error("❌ Gagal ambil versi node:", error);
        reject("Gagal ambil versi");
      } else {
        const versi = stdout.trim();
        console.log("✅ Versi Node:", versi);
        resolve(versi);
      }
    });
  });
}

// Fungsi installPackage
async function installPackage(event, customChannel = "install-status") {
  console.log("==Fungsi installPackage dipanggil");
  const webContents = event.sender;

  return new Promise((resolve) => {
    webContents.send(customChannel, "Sedang Menginstal...");
    exec(
      "npm install",
      { cwd: path.resolve(__dirname) },
      (error, stdout, stderr) => {
        if (error) {
          console.error(stderr);
          webContents.send(customChannel, "Gagal menginstal paket.");
          return resolve(false); // ← ini penting
        }
        console.log("✅" + stdout);
        webContents.send(customChannel, "✅ Berhasil menginstal paket.");
        resolve(true); // ← ini juga penting
      }
    );
  });
}

// Fungsi checkAndInstall
async function checkAndInstall(event) {
  console.log("==Fungsi checkAndInstall dipanggil");
  const webContents = event.sender;
  webContents.send(
    "check-and-install-status",
    "Sedang mengececk versi Node.js..."
  );
  exec("node -v", { cwd: path.resolve(__dirname) }, (error, stdout, stderr) => {
    if (error) {
      console.error(stderr);
      return webContents.send(
        "check-and-install-status",
        "Gagal mengececk versi Node.js"
      );
    }
    console.log("✅" + stdout);
    webContents.send(
      "check-and-install-status",
      "✅ Berhasil mengececk versi Node.js"
    );

    setTimeout(() => {
      exec(
        "npm install",
        { cwd: path.resolve(__dirname) },
        (error, stdout, stderr) => {
          if (error) {
            console.error(stderr);
            return webContents.send(
              "check-and-install-status",
              "Gagal menginstall paket."
            );
          }
          console.log("✅" + stdout);
          webContents.send(
            "check-and-install-status",
            "✅ Berhasil mengececk dan menginstall paket."
          );
        }
      );
    }, 1000);
  });
  return;
}

// 🛠️ Tambahan: Handler open-cmd
ipcMain.handle("open-cmd", async () => {
  console.log("📥 IPC: open-cmd");

  // Menjalankan CMD dan langsung keluar dari handler, tanpa promise
  return await bukaCmd();
});

// 🛠️ Tambahan: Handler cek-versi-node
ipcMain.handle("cek-versi-node", async () => {
  console.log("📥 IPC: cek-versi-node");

  // Menjalankan cekVersiNode dan langsung keluar dari handler, tanpa promise
  return await cekVersiNode();
});

// 🛠️ Tambahan: Handler install-package
ipcMain.on("install-package", async (event) => {
  console.log("📥 IPC: install-package");
  return await installPackage(event);
});

// 🛠️ Tambahan: Handler check-and-install
ipcMain.on("check-and-install", async (event) => {
  console.log("📥 IPC: check-and-install");
  return await checkAndInstall(event);
});

// 🛠️ Tambahan: Handler open-cmd-check-node-dan-install-paket
ipcMain.on("open-cmd-check-node-dan-install-paket", async (event) => {
  console.log("📥 IPC: open-cmd-check-node-dan-install-paket");
  const hasilCmd = await bukaCmd();
  const webContents = event.sender;

  let hasilVersi;
  try {
    hasilVersi = await cekVersiNode();
    webContents.send(
      "open-cmd-check-node-dan-install-paket-status",
      `✅ CMD dibuka.\nVersi Node.js: ${hasilVersi}`
    );
    setTimeout(async () => {
      // 🧩 Embed: langsung panggil installPackage()
      // 🔧 Install dan deteksi hasil
      const sukses = await installPackage(
        event,
        "open-cmd-check-node-dan-install-paket-status"
      );
      if (sukses) {
        setTimeout(() => {
          webContents.send(
            "open-cmd-check-node-dan-install-paket-status",
            "🚀 Seluruh proses berhasil."
          );
        }, 1000);
      } else {
        setTimeout(() => {
          webContents.send(
            "open-cmd-check-node-dan-install-paket-status",
            "⚠️ Instalasi gagal setelah proses awal berhasil."
          );
        }, 1000);
      }
    }, 1000);
  } catch (err) {
    webContents.send(
      "open-cmd-check-node-dan-install-paket-status",
      `❌ CMD dibuka, tapi gagal cek versi Node.js: ${err}`
    );
    return; // Berhenti jika gagal cek versi
  }
});

// 🛠️ Tambahan: Handler open-cmd-check-node-dan-install-paket-v2
ipcMain.on("open-cmd-check-node-dan-install-paket-v2", async (event) => {
  console.log("📥 IPC: open-cmd-check-node-dan-install-paket-v2");
  bukaCmd2();
  const webContents = event.sender;

  let hasilVersi;
  setTimeout(async () => {
    try {
      hasilVersi = await cekVersiNode();
      webContents.send(
        "open-cmd-check-node-dan-install-paket-v2-status",
        `✅ CMD dibuka.\nVersi Node.js: ${hasilVersi}`
      );
      setTimeout(async () => {
        // 🧩 Embed: langsung panggil installPackage()
        // 🔧 Install dan deteksi hasil
        const sukses = await installPackage(
          event,
          "open-cmd-check-node-dan-install-paket-v2-status"
        );
        if (sukses) {
          setTimeout(() => {
            webContents.send(
              "open-cmd-check-node-dan-install-paket-v2-status",
              "🚀 Seluruh proses berhasil."
            );
          }, 1000);
        } else {
          setTimeout(() => {
            webContents.send(
              "open-cmd-check-node-dan-install-paket-v2-status",
              "⚠️ Instalasi gagal setelah proses awal berhasil."
            );
          }, 1000);
        }
      }, 1000);
    } catch (err) {
      webContents.send(
        "open-cmd-check-node-dan-install-paket-v2-status",
        `❌ CMD dibuka, tapi gagal cek versi Node.js: ${err}`
      );
      return; // Berhenti jika gagal cek versi
    }
  }, 2000);
});

// Tambahkan ini hanya saat development
try {
  require("electron-reload")(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`),
  });
} catch (_) {}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
