# Yandex Disk API Client for Node.js

A lightweight Node.js class for interacting with Yandex Disk via its REST API.

## Features

- Upload files and directories to Yandex Disk.
- Download files from Yandex Disk.
- Create directories on Yandex Disk.
- Read directory contents (list files and folders).
- Read file contents (text or binary).
- Delete files.
- Check if a file or directory exists.
- Support for AbortSignal for operation cancellation.

## Installation

```bash
npm install yandisk
```

> **Note:** This class uses built‑in Node.js modules (`node:fs/promises`, `node:path`) and the global `fetch` function. No additional dependencies are required.

## Usage

### 1. Get an OAuth Token

1. Go to [Яндекс OAuth](https://oauth.yandex.ru/).
2. Register a new application.
3. Get your OAuth token with the necessary permissions for Yandex Disk.

### 2. Initialize the Client

```javascript
import YandexDisk from "yandex-disk-client";

const disk = new YandexDisk("your-oauth-token", "/MyFolder");
```

### 3. Basic Examples

**Upload a single file:**

```javascript
const success = await disk.uploadFile("myfile.txt", "Hello, Yandex Disk!");
if (success) {
  console.log("File uploaded successfully!");
}
```

**Download a file:**

```javascript
const success = await disk.downloadFile(
  "myfile.txt",
  "text",
  "/local/path/myfile.txt",
);
if (success) {
  console.log("File downloaded successfully!");
}
```

**Create a directory:**

```javascript
const success = await disk.mkdir("NewFolder");
if (success) {
  console.log("Directory created!");
}
```

**Read directory contents:**

```javascript
const items = await disk.readdir("/MyFolder");
console.log(items);
```

**Check if a file exists:**

```javascript
const exists = await disk.exists("myfile.txt");
console.log(`File exists: ${exists}`);
```

**Upload an entire local directory:**

```javascript
const success = await disk.uploadDir("RemoteFolder", "/local/path/to/folder");
if (success) {
  console.log("Directory uploaded successfully!");
}
```

**Take a public url**

```js
const disk = new YandexDisk(process.env.YANDEX_TOKEN!);

console.log(await disk.getPublicUrl("bear.png")); //  https://yadi.sk/d/BDc4uVNmkUn8cw

```

## API Reference

### Constructor

```typescript
new YandexDisk(token: string, directory?: string)
```

- `token` — your Yandex OAuth token (required).
- `directory` — the default directory on Yandex Disk (optional, defaults to `/`).

### Methods

#### `cd(path: string): void`

Change the current working directory on Yandex Disk.

- `path` — the new directory path.

#### `readdir(path?: string, signal?: AbortSignal): Promise<any[]>`

List the contents of a directory on Yandex Disk.

- `path` — optional path to the directory. If provided, changes the current directory.
- `signal` — optional `AbortSignal` to cancel the request.
- **Returns:** an array of items (files and folders) in the directory.

#### `uploadDir(dirname: string, dirpath: string, path?: string, signal?: AbortSignal): Promise<boolean>`

Upload a local directory and all its contents to Yandex Disk recursively.

- `dirname` — the name of the directory on Yandex Disk.
- `dirpath` — the local path to the directory to upload.
- `path` — optional remote path on Yandex Disk.
- `signal` — optional `AbortSignal`.
- **Returns:** `true` on success, `false` on failure.

#### `mkdir(dirname: string, path?: string, signal?: AbortSignal): Promise<boolean>`

Create a new directory on Yandex Disk.

- `dirname` — the name of the new directory.
- `path` — optional parent directory path.
- `signal` — optional `AbortSignal`.
- **Returns:** `true` on success, `false` on failure.

#### `uploadFile(filename: string, file: File | Blob | ArrayBuffer | Buffer | string, path?: string, signal?: AbortSignal): Promise<boolean>`

Upload a file to Yandex Disk.

- `filename` — the name to save the file as on Yandex Disk.
- `file` — the file content (string, Buffer, ArrayBuffer, etc.).
- `path` — optional directory path on Yandex Disk.
- `signal` — optional `AbortSignal`.
- **Returns:** `true` on success, `false` on failure.

#### `deleteFile(filename: string, path?: string, signal?: AbortSignal): Promise<boolean>`

Delete a file from Yandex Disk.

- `filename` — the name of the file to delete.
- `path` — optional directory path where the file is located.
- `signal` — optional `AbortSignal`.
- **Returns:** `true` on success, `false` on failure. Throws an error if the file is not found.

#### `readFile(filename: string, encoding: 'text' | 'buffer', path?: string, signal?: AbortSignal): Promise<string | ArrayBuffer | null>`

Read the contents of a file from Yandex Disk.

- `filename` — the name of the file.
- `encoding` — `'text'` to return a string, `'buffer'` to return an `ArrayBuffer`.
- `path` — optional directory path.
- `signal` — optional `AbortSignal`.
- **Returns:** file content as a string or `ArrayBuffer`, or `null` on error.

#### `downloadFile(filename: string, encoding: 'text' | 'buffer', localPath: string, path?: string, signal?: AbortSignal): Promise<boolean>`

Download a file from Yandex Disk and save it locally.

- `filename` — the name of the file on Yandex Disk.
- `encoding` — `'text'` or `'buffer'`.
- `localPath` — the full path where to save the file locally.
- `path` — optional remote directory path.
- `signal` — optional `AbortSignal`.
- **Returns:** `true` on success, `false` on failure.

#### `exists(filename: string, path?: string, signal?: AbortSignal): Promise<boolean>`

Check if a file or directory exists on Yandex Disk.

- `filename` — the name of the file or directory.
- `path` — optional parent directory path.
- `signal` — optional `AbortSignal`.
- **Returns:** `true` if the resource exists, `false` otherwise.

#### `getPublicUrl(filePath:string,signal:AbortSignal):Promise<string>`

Get file's or directory's public url:

- `filePath` - the path of the file or directory on Yandex Disk,
- `signal` — optional `AbortSignal`.
- **Returns:** public url.

## Error Handling

The methods return `false` or `null` on most errors and log the error to the console. For critical errors (e.g., missing token, file not found), the methods throw an `Error`. Always use `try‑catch` blocks when calling these methods if you need to handle errors programmatically.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

MIT
