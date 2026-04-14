const KEY = 'groceria_uploads'

function loadMap() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

function saveMap(map) {
  localStorage.setItem(KEY, JSON.stringify(map))
}

/**
 * Frontend-only limitation:
 * - We can't write to a real server folder from the browser.
 * - We store uploads in localStorage (base64) and allow user to download the file
 *   using the requested naming format.
 *
 * @param {{ filename: string, dataUrl: string, mime: string, size: number }} upload
 */
export function storeUpload(upload) {
  const map = loadMap()
  map[upload.filename] = {
    dataUrl: upload.dataUrl,
    mime: upload.mime,
    size: upload.size,
    storedAt: new Date().toISOString(),
  }
  saveMap(map)
}

/** @param {string} filename */
export function getUpload(filename) {
  const map = loadMap()
  return map[filename] || null
}

/** @param {string} filename */
export function downloadUpload(filename) {
  const u = getUpload(filename)
  if (!u) return false
  const a = document.createElement('a')
  a.href = u.dataUrl
  a.download = filename
  a.click()
  return true
}

