import { Injectable } from '@nestjs/common';
import crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;

  constructor() {
    const key = process.env.ENCRYPTION_KEY; // 32 bytes required (base64 or hex accepted)
    if (!key) throw new Error('ENCRYPTION_KEY is not set');
    this.key = this.normalizeKey(key);
    if (this.key.length !== 32) throw new Error('ENCRYPTION_KEY must resolve to 32 bytes');
  }

  encrypt(plain: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    // pack as base64: iv.authTag.ciphertext
    return Buffer.concat([iv, authTag, encrypted]).toString('base64');
  }

  decrypt(token: string): string {
    const buf = Buffer.from(token, 'base64');
    const iv = buf.subarray(0, 12);
    const authTag = buf.subarray(12, 28);
    const ciphertext = buf.subarray(28);
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
    return decrypted;
  }

  private normalizeKey(raw: string): Buffer {
    // try base64 then hex then utf8
    try { return Buffer.from(raw, 'base64'); } catch {}
    try { return Buffer.from(raw, 'hex'); } catch {}
    return Buffer.from(raw, 'utf8');
  }
}
