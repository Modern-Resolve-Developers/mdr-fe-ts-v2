const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function generateMeetString(length: any){
    let result = ""
    const characterLength = characters.length
    for(let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characterLength))
    }
    return result.trim()
}