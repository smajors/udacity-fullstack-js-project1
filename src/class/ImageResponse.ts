export class ImageResponse {
  path: string;
  cached: boolean;
  constructor(path: string, cached: boolean) {
    this.path = path;
    this.cached = cached;
  }

  isCached(): boolean {
    return this.cached;
  }

  getPath(): string {
    return this.path;
  }
}
