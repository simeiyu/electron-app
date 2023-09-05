const info = document.getElementById('info')

info.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`

const func = async() => {
  const res = await window.versions.ping()
  console.log('--- ping: ', res)
}

func()

const $title = document.getElementById('title')
const $btn = document.getElementById('btn')

$btn.addEventListener('click', () => {
  window.electronAPI.setTitle($title.value)
})