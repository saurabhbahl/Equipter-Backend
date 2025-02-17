// // cacheService.js

// export default class CacheService {
//   /**
//    * Create a new CacheService.
//    * @param {number} defaultTTL - Default time-to-live in seconds (default is 60 seconds).
//    * @param {number} cleanupInterval - Interval in seconds to run cleanup (default is 60 seconds).
//    */
//   constructor(defaultTTL = 60, cleanupInterval = 60) {
//     this.cache = new Map();
//     this.defaultTTL = defaultTTL * 1000; // convert to milliseconds
//     this.cleanupInterval = cleanupInterval * 1000; // convert to milliseconds

//     // Automatically clean up expired entries on a set interval.
//     this.cleanupTimer = setInterval(() => this.cleanup(), this.cleanupInterval);
//   }

//   /**
//    * Stores a key-value pair in the cache with an optional TTL.
//    * @param {string} key - The key for the cache entry.
//    * @param {*} value - The value to cache.
//    * @param {number} [ttl] - Time-to-live in seconds. Uses defaultTTL if not provided.
//    */
//   set(key, value, ttl = this.defaultTTL / 1000) {
//     const expireAt = Date.now() + ttl * 1000;
//     this.cache.set(key, { value, expireAt });
//   }

//   /**
//    * Retrieves the value for a given key from the cache.
//    * Returns null if the key is not found or has expired.
//    * @param {string} key - The key to retrieve.
//    * @returns {*} The cached value or null.
//    */
//   get(key) {
//     const entry = this.cache.get(key);
//     if (!entry) return null;

//     // If the entry has expired, remove it and return null.
//     if (Date.now() > entry.expireAt) {
//       this.cache.delete(key);
//       return null;
//     }
//     return entry.value;
//   }

//   /**
//    * Deletes a key from the cache.
//    * @param {string} key - The key to delete.
//    * @returns {boolean} True if an element existed and has been removed.
//    */
//   delete(key) {
//     return this.cache.delete(key);
//   }

//   /**
//    * Clears the entire cache.
//    */
//   clear() {
//     this.cache.clear();
//   }

//   /**
//    * Checks whether a key exists and is still valid (not expired).
//    * @param {string} key - The key to check.
//    * @returns {boolean} True if the key exists and has not expired.
//    */
//   has(key) {
//     const entry = this.cache.get(key);
//     if (!entry) return false;
//     if (Date.now() > entry.expireAt) {
//       this.cache.delete(key);
//       return false;
//     }
//     return true;
//   }

//   /**
//    * Removes all expired entries from the cache.
//    */
//   cleanup() {
//     const now = Date.now();
//     for (const [key, { expireAt }] of this.cache) {
//       if (now > expireAt) {
//         this.cache.delete(key);
//       }
//     }
//   }

//   /**
//    * Stops the automatic cleanup timer.
//    */
//   stopCleanup() {
//     clearInterval(this.cleanupTimer);
//   }
// }

// import NodeCache from 'node-cache';
// export default class CacheService {
//   /**
//    * Create a new CacheService instance.
//    * @param {number} ttlSeconds - Time-to-live for cache entries in seconds.
//    */
//   constructor(ttlSeconds) {
//     this.defaultTTL=3600
//     this.cache = new NodeCache({
//       stdTTL: ttlSeconds,
//       // checkperiod: ttlSeconds * 0.2,
//     });
//   }

//     /**
//    * Retrieves the value for a given key from the cache.
//    * Returns null if the key is not found or has expired.
//    * @param {string} key - The key to retrieve.
//    * @returns {*} The cached value or null.
//    */
//   get(key) {
//     console.log(key)
//     const entry = this.cache.get(key);
//     console.log(entry)
//     if (!entry) return null;

//     // If the entry has expired, remove it and return null.
//     if (Date.now() > entry.expireAt) {
//       this.cache.delete(key);
//       return null;
//     }
//     return entry.value;
//   }

//   /**
//    * Set a value in the cache.
//    * @param {string} key - The key for the cache entry.
//    * @param {*} value - The value to store.
//    */

//   set(key, value, ttl = this.defaultTTL) {
//     const expireAt = Date.now() + ttl;
//     this.cache.set(key, { value, expireAt });
//   }

//   /**
//    * Delete a key from the cache.
//    * @param {string} key - The key to delete.
//    */
//   delete(key) {
//     this.cache.del(key);
//     console.log(`Key deleted from cache: ${key}`);
//   }

//   /**
//    * Flush all entries from the cache.
//    */
//   flush() {
//     this.cache.flushAll();
//     console.log("All cache flushed");
//   }
// }

// import NodeCache from 'node-cache';

// export default class CacheService {
//   /**
//    * Create a new CacheService instance.
//    * @param {number} ttlSeconds - Time-to-live for cache entries in seconds.
//    */
//   constructor(ttlSeconds = 3600) {
//     this.cache = new NodeCache({
//       stdTTL: ttlSeconds,
//     });

//   }

//   /**
//    * Set a value in the cache.
//    * @param {string} key - The key for the cache entry.
//    * @param {*} value - The value to store.
//    */
//   set(key, value) {
//     let res=this.cache.set(key, value,3600);
//     console.log(`Value set in cache for ${key}:${value} ${res}`);
//   }
//   /**
//    * Retrieves the value for a given key from the cache.
//    * Returns null if the key is not found or has expired.
//    * @param {string} key - The key to retrieve.
//    * @returns {*} The cached value or null.
//    */
//   get(key) {
//     const value = this.cache.get(key);
//     console.log(`Getting key "${key}" from cache:`, value);
//     return value === undefined ? null : value;
//   }

//   /**
//    * Delete a key from the cache.
//    * @param {string} key - The key to delete.
//    */
//   delete(key) {
//     this.cache.del(key);
//     console.log(`Key deleted from cache: ${key}`);
//   }

//   /**
//    * Flush all entries from the cache.
//    */
//   flush() {
//     this.cache.flushAll();
//     console.log("All cache flushed");
//   }
// }

// import NodeCache from 'node-cache';

// export default class CacheService {
//   /**
//    * Create a new CacheService instance.
//    * @param {number} ttlSeconds - Time-to-live for cache entries in seconds.
//    */
//   constructor(ttlSeconds = 3600) {
//     this.cache = new NodeCache({
//       stdTTL: ttlSeconds,
//       // checkperiod: ttlSeconds * 0.2,
//     });
//   }

//   /**
//    * Set a value in the cache.
//    * @param {string} key - The key for the cache entry.
//    * @param {*} value - The value to store.
//    * @returns {boolean} True if the value was successfully set, false otherwise.
//    */
//   set(key, value) {
//     if (!key || typeof key !== 'string') {
//       console.error(`Invalid key provided: ${key}`);
//       return false;
//     }
//     const success = this.cache.set(key, value);
//     console.log(`Value set in cache for key "${key}":`, value);
//     let res=this.cache.get(key)
//     console.log("saved value",res)
//     let res2=this.get("access_token")
//     console.log('res2',res2)
//     return success;
//   }

//   /**
//    * Retrieves the value for a given key from the cache.
//    * Returns null if the key is not found or has expired.
//    * @param {string} key - The key to retrieve.
//    * @returns {*} The cached value or null.
//    */
//   get(key) {
//     if (!key || typeof key !== 'string') {
//       console.error(`Invalid key provided: ${key}`);
//       return null;
//     }
//     const value = this.cache.get(key);
//     console.log(`Getting key "${key}" from cache:`, value);
//     return value;
//   }

//   /**
//    * Delete a key from the cache.
//    * @param {string} key - The key to delete.
//    * @returns {boolean} True if the key was successfully deleted, false otherwise.
//    */
//   deleteKey(key) {
//     if (!key || typeof key !== 'string') {
//       console.error(`Invalid key provided: ${key}`);
//       return false;
//     }
//     const success = this.cache.del(key) > 0; // Returns true if at least one key was deleted
//     console.log(`Key deleted from cache: ${key}`);
//     return success;
//   }

//   /**
//    * Flush all entries from the cache.
//    */
//   flush() {
//     this.cache.flushAll();
//     console.log("All cache flushed");
//   }
// }
import memoryCache from "memory-cache";

export default class CacheService {
  /**
   * Set a value in the cache.
   * @param {string} key - The key for the cache entry.
   * @param {*} value - The value to store.
   * @param {*} time - Time in ms.
   * @returns {boolean} True if the value was successfully set, false otherwise.
   */
  set(key, value, time) {
    const res = memoryCache.put(key, value, time);
  }

  /**
   * Retrieves the value for a given key from the cache.
   * Returns null if the key is not found or has expired.
   * @param {string} key - The key to retrieve.
   * @returns {*} The cached value or null.
   */
  get(key) {
    if (!key || typeof key !== "string") {
      console.error(`Invalid key provided: ${key}`);
      return null;
    }
    const value = this.cache.get(key);
    console.log(`Getting key "${key}" from cache:`, value);
    return value;
  }

  /**
   * Delete a key from the cache.
   * @param {string} key - The key to delete.
   * @returns {boolean} True if the key was successfully deleted, false otherwise.
   */
  deleteKey(key) {
    if (!key || typeof key !== "string") {
      console.error(`Invalid key provided: ${key}`);
      return false;
    }
    const success = this.cache.del(key) > 0; // Returns true if at least one key was deleted
    console.log(`Key deleted from cache: ${key}`);
    return success;
  }

  /**
   * Flush all entries from the cache.
   */
  flush() {
    this.cache.flushAll();
    console.log("All cache flushed");
  }
}
