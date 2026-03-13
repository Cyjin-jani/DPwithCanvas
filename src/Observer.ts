abstract class Observer {
  abstract subscribe(v: Listener): void;
  abstract unsubscribe(name: string): void;
  abstract publish(): void;
}

interface Listener {
  name: string;
  publish(event: string): void;
}

export class SubscriptionManager {
  listeners: {
    [key: string]: Listener[];
  } = {};

  private constructor() {}

  addEvent(event: string) {
    if (this.listeners[event]) {
      return this.listeners[event];
    }
    this.listeners[event] = [];
    return this.listeners[event];
  }

  // pub-sub 패턴으로 리팩터링함
  /**
   * 장점: 모든 subscription 관련된 거를 중앙에서 통제할 수 있음
   * 각 컴포넌트간에 서로 결합도가 낮아지고, 모든 클래스는 다 이 subscription manger만 바라보는 중앙집권적 형태.
   * 더 큰 규모의 서비스에서는 단순 observer 패턴 대신 pub-sub 패턴을 활용하는 것이 좋음.
   *
   * [참고] 여러개의 서비스들까지 이벤트 관리를 하려면, 이렇게 listeners를 메모리에 저장하는 것 말고 DB 연동 (redis 등)을 통해서 처리할 수 있다.
   * 너무 여러 subscribe 데이터가 쌓이면 메모리 사용이 올라가니 느려질 수 있음..그럴 때 DB를 활용.
   *
   */
  private static instance: SubscriptionManager;

  subscribe(event: string, v: Listener): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(v);
  }

  unsubscribe(event: string, name: string): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event] = this.listeners[event].filter((v) => v.name !== name);
  }

  publish(event: string): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].forEach((target) => {
      target.publish(event);
    });
  }

  // singleton으로 만들어주기
  static getInstance() {
    if (!this.instance) {
      this.instance = new SubscriptionManager();
    }
    return this.instance;
  }
}

export class SaveCompleteObserver extends Observer {
  listeners: Listener[] = [];

  override subscribe(v: Listener): void {
    this.listeners.push(v);
  }

  override unsubscribe(name: string): void {
    this.listeners = this.listeners.filter((v) => v.name !== name);
  }

  override publish(): void {
    this.listeners.forEach((target) => {
      target.publish('saveComplete');
    });
  }
}
