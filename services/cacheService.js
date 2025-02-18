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
