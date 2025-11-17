const KEY = 'lfjj-db-v1'


function readAll() {
try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}
function writeAll(db) {
localStorage.setItem(KEY, JSON.stringify(db))
}


export function get(key, fallback) {
const db = readAll()
return db[key] ?? fallback
}


export function set(key, value) {
const db = readAll()
db[key] = value
writeAll(db)
}


export function push(key, item) {
const arr = get(key, [])
arr.unshift({ ...item, createdAt: new Date().toISOString() })
set(key, arr)
return arr
}


export function removeAt(key, index) {
const arr = get(key, [])
arr.splice(index, 1)
set(key, arr)
return arr
}