// Comprehensive Base64 polyfill to satisfy react-pdf dependencies
const lookup: string[] = [];
const revLookup: number[] = [];
const code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (let i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}
revLookup["-".charCodeAt(0)] = 62;
revLookup["_".charCodeAt(0)] = 63;

function getLens(b64: string): [number, number] {
  const len = b64.length;
  let validLen = b64.indexOf("=");
  if (validLen === -1) validLen = len;
  const placeHoldersLen = validLen === len ? 0 : 4 - (validLen % 4);
  return [validLen, placeHoldersLen];
}

export function byteLength(b64: string): number {
  const lens = getLens(b64);
  return ((lens[0] + lens[1]) * 3) / 4 - lens[1];
}

export function toByteArray(b64: string): Uint8Array {
  let tmp;
  const lens = getLens(b64);
  const validLen = lens[0];
  const placeHoldersLen = lens[1];
  const arr = new Uint8Array(byteLength(b64));
  let cur = 0;
  const len = placeHoldersLen > 0 ? validLen - 4 : validLen;
  let i;
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)];
    arr[cur++] = (tmp >> 16) & 0xff;
    arr[cur++] = (tmp >> 8) & 0xff;
    arr[cur++] = tmp & 0xff;
  }
  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[cur++] = tmp & 0xff;
  } else if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[cur++] = (tmp >> 8) & 0xff;
    arr[cur++] = tmp & 0xff;
  }
  return arr;
}

export function fromByteArray(uint8: Uint8Array | number[]): string {
  let tmp;
  const len = uint8.length;
  const extraLen = len % 3;
  const parts = [];
  const maxChunkLength = 16383;
  for (let i = 0, len2 = len - extraLen; i < len2; i += maxChunkLength) {
    parts.push(
      encodeChunk(
        uint8,
        i,
        i + maxChunkLength > len2 ? len2 : i + maxChunkLength
      )
    );
  }
  if (extraLen === 1) {
    tmp = uint8[len - 1];
    parts.push(lookup[tmp >> 2] + lookup[(tmp << 4) & 0x3f] + "==");
  } else if (extraLen === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(
      lookup[tmp >> 10] +
        lookup[(tmp >> 4) & 0x3f] +
        lookup[(tmp << 2) & 0x3f] +
        "="
    );
  }
  return parts.join("");
}

function encodeChunk(
  uint8: Uint8Array | number[],
  start: number,
  end: number
): string {
  let tmp;
  const output = [];
  for (let i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xff0000) +
      ((uint8[i + 1] << 8) & 0xff00) +
      (uint8[i + 2] & 0xff);
    output.push(
      lookup[(tmp >> 18) & 0x3f] +
        lookup[(tmp >> 12) & 0x3f] +
        lookup[(tmp >> 6) & 0x3f] +
        lookup[tmp & 0x3f]
    );
  }
  return output.join("");
}

// THE CRITICAL PART: provide both named and default exports
export default {
  byteLength,
  toByteArray,
  fromByteArray,
};
