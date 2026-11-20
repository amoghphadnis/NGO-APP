/**
 * Polyfills missing iterator and inspection methods on React Native's FormData prototype.
 * React Native's FormData stores entries in `this._parts: Array<[string, any]>` but lacks
 * standard ES2015+ entries(), keys(), values(), and Symbol.iterator methods.
 *
 * This prevents crashes with Expo's WinterCG convertFormDataAsync and Array.from(formData.keys()).
 */
if (typeof FormData !== 'undefined' && FormData.prototype) {
  const proto = FormData.prototype as any;

  if (typeof proto.entries !== 'function') {
    proto.entries = function* () {
      if (Array.isArray(this._parts)) {
        for (const [name, value] of this._parts) {
          yield [name, value];
        }
      }
    };
  }

  if (typeof proto.keys !== 'function') {
    proto.keys = function* () {
      if (Array.isArray(this._parts)) {
        for (const [name] of this._parts) {
          yield name;
        }
      }
    };
  }

  if (typeof proto.values !== 'function') {
    proto.values = function* () {
      if (Array.isArray(this._parts)) {
        for (const [, value] of this._parts) {
          yield value;
        }
      }
    };
  }

  if (typeof proto[Symbol.iterator] !== 'function') {
    proto[Symbol.iterator] = function () {
      return this.entries();
    };
  }
}

export {};
