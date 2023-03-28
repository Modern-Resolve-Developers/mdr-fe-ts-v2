
type StorageProps = {
    store: (key: any, value: any) => void;
    load: (key: any) => void;
}

export const ControlledStorage : StorageProps = {
    store(key, value) {
        localStorage.setItem(key, JSON.stringify(value))
    },
    load(key) {
        const stored = localStorage.getItem(key)
        return stored == null || stored == undefined
        || stored == 'unknown' ? undefined : JSON.parse(key)
    },
}