export const setItem = <T>(key: string, value: T) => {
    try {
        if(typeof window !== 'undefined'){
            window.localStorage.setItem(key, JSON.stringify(value))
        }
    } catch (error) {
        console.log(error)
    }
}

export const getItem = <T>(key: string): T | undefined => {
    try {
        if(typeof window !== 'undefined'){
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : undefined
        }
    } catch (error) {
        
    }
    return undefined
}

export const removeItem = (key: string) => {
    try {
        if(typeof window !== 'undefined'){
            window.localStorage.removeItem(key)
        }
    } catch (error) {
        console.log(error)        
    }
}

export const clear = () => {
    if(typeof window !== 'undefined') {
        window.localStorage.clear()
    }
}