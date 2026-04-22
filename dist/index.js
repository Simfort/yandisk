import { writeFile, readdir, stat, readFile } from "node:fs/promises";
import { join } from "node:path";
export default class YandexDisk {
    directory = "/";
    #oauth_token;
    constructor(token, directory) {
        if (!token) {
            throw new Error("Token is not defined");
        }
        this.#oauth_token = token;
        this.directory = directory || "/";
    }
    cd(path) {
        this.directory = path;
    }
    #readDir = async (startPath, dirname, path, signal) => {
        console.log(startPath, dirname);
        const recursiveReadDir = async (currentPath, currentDirname) => {
            const files = await readdir(currentPath);
            for (const file of files) {
                const fullPath = join(currentPath, file);
                const fullDirname = join(currentDirname, file);
                const stats = await stat(fullPath);
                if (stats.isDirectory()) {
                    this.mkdir(fullDirname, path, signal);
                    await recursiveReadDir(fullPath, fullDirname); // Рекурсивный вызов для поддиректории
                }
                else {
                    const data = await readFile(fullPath);
                    this.uploadFile(fullDirname, data, path, signal);
                }
            }
        };
        await recursiveReadDir(startPath, dirname);
    };
    async readdir(path, signal) {
        if (path) {
            this.cd(path);
        }
        try {
            const res = await fetch(`https://cloud-api.yandex.net/v1/disk/resources?path=${encodeURIComponent(this.directory)}`, {
                headers: {
                    Authorization: `OAuth ${this.#oauth_token}`,
                },
                signal,
            });
            if (!res.ok) {
                throw new Error("Yandex-Disk Error:" + res.statusText);
            }
            const data = await res.json();
            return data._embedded.items;
        }
        catch (error) {
            console.error(error);
        }
    }
    async uploadDir(dirname, dirpath, path, signal) {
        try {
            await this.#readDir(dirpath, dirname, path, signal);
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    async mkdir(dirname, path, signal) {
        if (path) {
            this.cd(path);
        }
        const pathdir = this.directory === "/"
            ? `${this.directory}${dirname}`
            : `${this.directory}/${dirname}`;
        try {
            const res = await fetch("https://cloud-api.yandex.net/v1/disk/resources?path=" +
                encodeURIComponent(pathdir), {
                method: "PUT",
                headers: {
                    Authorization: `OAuth ${this.#oauth_token}`,
                },
                signal,
            });
            if (!res.ok) {
                throw new Error("Yandex-Disk Error:" + res.statusText);
            }
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    async uploadFile(filename, file, path, signal) {
        if (path) {
            this.cd(path);
        }
        const pathdir = this.directory === "/"
            ? `${this.directory}${filename}`
            : `${this.directory}/${filename}`;
        try {
            const responseGet = await fetch("https://cloud-api.yandex.net/v1/disk/resources/upload?" +
                `path=${encodeURIComponent(pathdir)}&overwrite=true`, {
                method: "GET",
                headers: {
                    Authorization: `OAuth ${this.#oauth_token}`,
                },
                signal,
            });
            if (!responseGet.ok) {
                throw new Error("Yandex-Disk Error:" + responseGet.statusText);
            }
            const uploadData = await responseGet.json();
            const responsePut = await fetch(uploadData.href, {
                method: "PUT",
                body: file, // Замените на содержимое вашего файла
            });
            if (!responsePut.ok) {
                throw new Error("Yandex-Disk Error:" + responsePut.statusText);
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async deleteFile(filename, path, signal) {
        if (path) {
            this.cd(path);
        }
        try {
            const pathdir = this.directory === "/"
                ? `${this.directory}${filename}`
                : `${this.directory}/${filename}`;
            const response = await fetch("https://cloud-api.yandex.net/v1/disk/resources?" +
                `path=${encodeURIComponent(pathdir)}`, {
                method: "DELETE",
                headers: {
                    Authorization: `OAuth ${this.#oauth_token}`,
                },
                signal,
            });
            if (response.status === 404) {
                throw new Error("Yandex-Disk:File is not defined");
            }
            else if (!response.ok) {
                throw new Error("Yandex-Disk:" + response.statusText);
            }
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    async readFile(filename, encoding, path, signal) {
        if (path) {
            this.cd(path);
        }
        try {
            const downloadPath = this.directory === "/"
                ? `${this.directory}${filename}`
                : `${this.directory}/${filename}`;
            const getUrlResponse = await fetch(`https://cloud-api.yandex.net/v1/disk/resources/download?path=${encodeURIComponent(downloadPath)}`, {
                method: "GET",
                headers: { Authorization: `OAuth ${this.#oauth_token}` },
                signal,
            });
            if (!getUrlResponse.ok) {
                throw new Error(`Yandex-Disk Error: ${getUrlResponse.status} ${await getUrlResponse.text()}`);
            }
            const downloadData = await getUrlResponse.json();
            const downloadUrl = downloadData.href;
            const fileResponse = await fetch(downloadUrl, { signal });
            if (!fileResponse.ok) {
                throw new Error(`Yandex-Disk: ${fileResponse.statusText}`);
            }
            // Для текстовых файлов — читаем как текст
            let fileContent = null;
            if (encoding === "text") {
                fileContent = await fileResponse.text();
            }
            else if (encoding === "buffer") {
                fileContent = await fileResponse.arrayBuffer();
            }
            return fileContent;
        }
        catch (error) {
            console.error(error);
        }
    }
    async downloadFile(filename, encoding, localPath, path, signal) {
        try {
            const file = await this.readFile(filename, encoding, path, signal);
            if (file) {
                let content = null;
                if (encoding === "buffer") {
                    content = Buffer.from(file);
                }
                else if (encoding === "text") {
                    content = file;
                }
                else {
                    throw new Error("Yandex-Disk:Encoding undefined");
                }
                await writeFile(localPath, content);
            }
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    async exists(filename, path, signal) {
        try {
            if (path) {
                this.cd(path);
            }
            const existPath = this.directory === "/"
                ? `${this.directory}${filename}`
                : `${this.directory}/${filename}`;
            const response = await fetch(`https://cloud-api.yandex.net/v1/disk/resources?path=${encodeURIComponent(existPath)}`, {
                method: "GET",
                headers: { Authorization: `OAuth ${this.#oauth_token}` },
                signal,
            });
            if (response.status === 200) {
                const metadata = await response.json();
                return true;
            }
            else if (response.status === 404) {
                return false;
            }
            else {
                throw new Error("Yandex-Disk:" + response.statusText);
            }
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    async getPublicUrl(filePath, signal) {
        const downloadPath = this.directory === "/"
            ? `${this.directory}${filePath}`
            : `${this.directory}/${filePath}`;
        // Шаг 1. Получаем временный URL для скачивания
        const getUrlResponse = await fetch(`https://cloud-api.yandex.net/v1/disk/resources/download?path=${encodeURIComponent(downloadPath)}`, {
            method: "GET",
            headers: {
                Authorization: `OAuth ${this.#oauth_token}`,
            },
            signal,
        });
        if (!getUrlResponse.ok) {
            throw new Error(`Ошибка получения ссылки для скачивания: ${getUrlResponse.statusText}`);
        }
        const downloadData = await getUrlResponse.json();
        const directUrl = downloadData.href; // Это прямая ссылка на файл
        return directUrl;
    }
}
//# sourceMappingURL=index.js.map