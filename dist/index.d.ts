export default class YandexDisk {
    #private;
    directory: string;
    constructor(token: string, directory?: string);
    cd(path: string): void;
    readdir(path?: string, signal?: AbortSignal): Promise<any>;
    uploadDir(dirname: string, dirpath: string, path?: string, signal?: AbortSignal): Promise<boolean>;
    mkdir(dirname: string, path?: string, signal?: AbortSignal): Promise<boolean>;
    uploadFile(filename: string, file: File | Blob | ArrayBuffer | Buffer<ArrayBuffer> | string, path?: string, signal?: AbortSignal): Promise<boolean>;
    deleteFile(filename: string, path?: string, signal?: AbortSignal): Promise<boolean>;
    readFile(filename: string, encoding: "text" | "buffer", path?: string, signal?: AbortSignal): Promise<string | ArrayBuffer | null | undefined>;
    downloadFile(filename: string, encoding: "text" | "buffer", localPath: string, path?: string, signal?: AbortSignal): Promise<boolean>;
    exists(filename: string, path?: string, signal?: AbortSignal): Promise<boolean>;
    getPublicUrl(filePath: string, signal?: AbortSignal): Promise<string>;
}
//# sourceMappingURL=index.d.ts.map