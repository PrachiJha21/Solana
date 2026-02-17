import express from 'express';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';

const app = express();
app.use(express.json());

// Simple in-memory nonce store (demo only)
const nonces = new Map<string, number>();

app.get('/api/auth/nonce', (req, res) => {
  const address = req.query.address as string;
  const nonce = Math.floor(Math.random() * 1000000);
  nonces.set(address, nonce);
  res.json({ nonce });
});

app.post('/api/auth/verify', async (req, res) => {
  const { address, message, signature } = req.body;
  
  try {
    const nonce = nonces.get(address);
    if (!nonce || !message.includes(`Nonce:${nonce}`)) {
      return res.status(401).json({ error: 'Invalid or expired nonce' });
    }

    const signatureUint8 = new Uint8Array(signature);
    const messageUint8 = new TextEncoder().encode(message);
    const pubKeyUint8 = new PublicKey(address).toBytes();

    const verified = nacl.sign.detached.verify(messageUint8, signatureUint8, pubKeyUint8);

    if (verified) {
      nonces.delete(address);
      // In a real app, generate a JWT here
      res.json({ success: true, token: 'mock-jwt-token' });
    } else {
      res.status(401).json({ error: 'Signature verification failed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Verification error' });
  }
});

// Update the registerRoutes function to include these if needed
// For now, this is just a stub as requested.
export default app;
