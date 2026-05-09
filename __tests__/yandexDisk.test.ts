import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import YandexDisk from "yandisk";

let yandexDisk: YandexDisk | null = null;
beforeAll(() => {
  vi.stubEnv(
    "YANDEX_TOKEN",
    "y0__xCGrK2dBRjsuj8gyqm27xaZBYyKYvucnGZdrM-fulY3BnMt1g",
  );
  yandexDisk = new YandexDisk(process.env.YANDEX_TOKEN!);
});

afterAll(() => {
  vi.unstubAllEnvs(); // Восстанавливает исходные значения
});

describe("Testing yandex disk", () => {
  test("Readdir is success!", async () => {
    const files = (await yandexDisk!.readdir("/")) as any[];
    expect(files.length).greaterThan(0);
  });
  test("Readfile is success!", async () => {
    const file = (await yandexDisk!.readFile(
      "5a1bbaca-330d-43be-8b84-f8bff58cd75e",
      "buffer",
    )) as ArrayBuffer;
    expect(file).toBeDefined();
  });
  test("getPublicUrl is success!", async () => {
    const publicUrl = await yandexDisk!.getPublicUrl(
      "5a1bbaca-330d-43be-8b84-f8bff58cd75e",
    );
    expect(publicUrl).toBeDefined();
  });
  test("exists is success!", async () => {
    const isExist = await yandexDisk!.exists(
      "5a1bbaca-330d-43be-8b84-f8bff58cd75e",
    );
    console.log(isExist);
    expect(isExist).toBeTruthy();
  });
});
