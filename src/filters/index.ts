// 책임 연쇄 패턴. (chain of responsibility)
// 만약 순서가 중요한 경우라면 순서가 잘 지켜지도록 순서를 잘 정의하는 것이 필요.
// 예시) blur -> grayscale -> invert 순 (grayscale이 먼저되고 blur가 되지 않도록 주의)
// (하지만 여기서 구현된 filter는 사실 크게 순서가 중요하지는 않음)
export abstract class Filter {
  next?: Filter;
  // setNext 통해서 다음 filter를 연결할 수 있음
  setNext(filter: Filter) {
    this.next = filter;
    return filter;
  }

  // 비즈니스 로직이 들어가는 곳
  abstract handle(offscreenCanvas: OffscreenCanvas): Promise<void>;
}

// blur, invert, grayscale 아무것도 적용하지 않았을 때의 기본 필터.
export class DefaultFilter extends Filter {
  override async handle(offscreenCanvas: OffscreenCanvas) {
    // 다음 게 있으면 다음으로 넘기고, 그게 아니라면 아무것도 하지 않음.
    if (this.next) {
      await this.next.handle(offscreenCanvas);
    }
  }
}
export class BlurFilter extends Filter {
  override async handle(offscreenCanvas: OffscreenCanvas) {
    return new Promise<void>((resolve, reject) => {
      const offscreenContext = offscreenCanvas.getContext('2d')!;
      offscreenContext.filter = 'blur(30px)';
      const image = new Image();
      offscreenCanvas.convertToBlob().then((blob) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const dataURL = reader.result as string;
          console.log('dataURL', dataURL);
          image.src = dataURL;
        });
        reader.readAsDataURL(blob);
      });
      image.addEventListener('load', async () => {
        offscreenContext.drawImage(image, 0, 0);
        if (this.next) {
          await this.next.handle(offscreenCanvas);
        }
        resolve();
      });
    });
  }
}
export class GrayscaleFilter extends Filter {
  override async handle(offscreenCanvas: OffscreenCanvas) {
    return new Promise<void>((resolve, reject) => {
      const offscreenContext = offscreenCanvas.getContext('2d')!;
      offscreenContext.filter = 'grayscale(1)';
      const image = new Image();
      offscreenCanvas.convertToBlob().then((blob) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const dataURL = reader.result as string;
          console.log('dataURL', dataURL);
          image.src = dataURL;
        });
        reader.readAsDataURL(blob);
      });
      image.addEventListener('load', async () => {
        offscreenContext.drawImage(image, 0, 0);
        if (this.next) {
          await this.next.handle(offscreenCanvas);
        }
        resolve();
      });
    });
  }
}
export class InvertFilter extends Filter {
  override async handle(offscreenCanvas: OffscreenCanvas) {
    return new Promise<void>((resolve, reject) => {
      const offscreenContext = offscreenCanvas.getContext('2d')!;
      offscreenContext.filter = 'invert(1)';
      const image = new Image();
      offscreenCanvas.convertToBlob().then((blob) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const dataURL = reader.result as string;
          console.log('dataURL', dataURL);
          image.src = dataURL;
        });
        reader.readAsDataURL(blob);
      });
      image.addEventListener('load', async () => {
        offscreenContext.drawImage(image, 0, 0);
        if (this.next) {
          await this.next.handle(offscreenCanvas);
        }
        resolve();
      });
    });
  }
}
