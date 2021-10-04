/** LRU cache with bounded size. */
export class LRUCache {
  max: number
  cache: Map<string, string>

  constructor(max = 10) {
    this.max = max;
    this.cache = new Map();
  }

  get(key: string): string | undefined {
    let item = this.cache.get(key);
    if (item) {
      // Refresh position of key.
      this.cache.delete(key);
      this.cache.set(key, item);
    }
    return item;
  }

  set(key: string, val: string) {
    if (this.cache.has(key)) {
      // Refresh position of key.
      this.cache.delete(key)
    } else if (this.cache.size == this.max) {
      // Evict oldest.
      this.cache.delete(this.first())
    }
    this.cache.set(key, val);
  }

  first(): string {
    // Map is ordered, so this returns oldest.
    return this.cache.keys().next().value;
  }
}
