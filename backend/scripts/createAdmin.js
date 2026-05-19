import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  const [, , name, email, password] = process.argv;

  if (!name || !email || !password) {
    console.log('Usage: node scripts/createAdmin.js <name> <email> <password>');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('\n❌ MONGODB_URI is missing in backend/.env\n');
    process.exit(1);
  }

  if (
    uri.includes('<username>') ||
    uri.includes('<password>') ||
    uri.includes('cluster.mongodb.net')
  ) {
    console.error('\n❌ MONGODB_URI still uses the placeholder from .env.example\n');
    console.error('Replace it with your real MongoDB Atlas connection string.');
    console.error('Get it from: Atlas → Database → Connect → Drivers → Node.js\n');
    console.error('Example format:');
    console.error(
      'mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/smart-complaints?retryWrites=true&w=majority\n'
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('\n❌ Could not connect to MongoDB:', err.message);
    console.error('\nCheck:');
    console.error('  • Username/password in the URI are correct');
    console.error('  • Special characters in password are URL-encoded (@ → %40)');
    console.error('  • Atlas Network Access allows your IP (or 0.0.0.0/0 for dev)\n');
    process.exit(1);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = 'admin';
    if (password) existing.password = password;
    await existing.save();
    console.log(`✅ Updated existing user to admin: ${email}`);
  } else {
    await User.create({ name, email, password, role: 'admin' });
    console.log(`✅ Admin user created: ${email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
