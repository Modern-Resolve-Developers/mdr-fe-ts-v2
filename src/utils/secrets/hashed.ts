import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCODING = 'hex';
const IV_LENGTH = 16;
const KEY = 'DoCKvdLslTuB4y3EZlKate7XMottHski1LmyqJHvUhs=';
const key_in_bytes = Buffer.from(KEY, 'base64')
export const encrypt = (data: any) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key_in_bytes, iv);
  return Buffer.concat([cipher.update(data,), cipher.final(), iv]).toString(ENCODING);
}

export const decrypt = (data: any) => {
  const binaryData = new Buffer(data, ENCODING);
  const iv = binaryData.slice(-IV_LENGTH);
  const encryptedData = binaryData.slice(0, binaryData.length - IV_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, key_in_bytes, iv);

  return Buffer.concat([decipher.update(encryptedData), decipher.final()]).toString();
}