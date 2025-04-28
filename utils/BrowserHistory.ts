export class BrowserHistory {
  backStack: string[];
  forwardStack: string[];
  currentPage: string;

  constructor(initialPage: string) {
    this.backStack = [];
    this.forwardStack = [];
    this.currentPage = initialPage;
  }

  visit(page: string) {
    this.backStack.push(this.currentPage);
    this.currentPage = page;
    this.forwardStack = []; // when visiting new page, clear forward history
  }

  back() {
    if (this.backStack.length === 0) return null;

    this.forwardStack.push(this.currentPage);
    this.currentPage = this.backStack.pop()!;
    return this.currentPage;
  }

  forward() {
    if (this.forwardStack.length === 0) return null;

    this.backStack.push(this.currentPage);
    this.currentPage = this.forwardStack.pop()!;
    return this.currentPage;
  }

  canBack() {
    return this.backStack.length > 0;
  }

  canForward() {
    return this.forwardStack.length > 0;
  }

  getCurrentPage() {
    return this.currentPage;
  }
}
