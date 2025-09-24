import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
  // Removed deprecated useUnifiedTopology and useNewUrlParser options
}

let client
let clientPromise

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

// Helper function to get database
export async function getDatabase(dbName = process.env.MONGODB_DB_NAME || 'portfolio') {
  const client = await clientPromise
  return client.db(dbName)
}

// Helper function to get collection
export async function getCollection(collectionName, dbName) {
  const db = await getDatabase(dbName)
  return db.collection(collectionName)
}

// Connection health check
export async function checkConnection() {
  try {
    const client = await clientPromise
    await client.db('admin').command({ ping: 1 })
    console.log('MongoDB connection successful')
    return true
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    return false
  }
}
