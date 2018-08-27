function getScrollingElement() {
  if ('scrollingElement' in document) {
    return document.scrollingElement;
  }
  if (navigator.userAgent.indexOf('WebKit') !== -1) {
    return document.body;
  }
  return document.documentElement;
}

const scrollingElement = getScrollingElement();
const defaultOption = {
  showClass: 'pagestack-show',
  hideClass: 'pagestack-hide'
};

class PageStack {
  /**
   * @param {Object} [option={}]
   */
  constructor(baseId, option = {}) {
    this.option = Object.assign(defaultOption, option);
    const baseEl = document.getElementById(baseId);
    if (!baseEl) {
      throw Error(`element with id: ${baseId} is not found`);
    }
    this.currentId = baseId;
    this.memo = {
      [baseId]: {
        scroll: 0,
        el: baseEl
      }
    };
  }

  to(id) {
    if (id === this.currentId) {
      return;
    }
    this.memoId(id);

    this.hide();
    this.show(id);
  }

  hide() {
    this.memo[this.currentId].scroll = scrollingElement.scrollTop;
    const { el } = this.memo[this.currentId];
    el.classList.toggle(this.option.showClass, false);
    el.classList.toggle(this.option.hideClass, true);
  }

  show(id) {
    const { el } = this.memo[id];
    el.classList.toggle('pagestack-hide', false);
    el.classList.toggle('pagestack-show', true);
    setTimeout(() => {
      getScrollingElement().scrollTop = this.memo[id].scroll;
    }, 0);
    this.currentId = id;
  }

  memoId(id) {
    if (this.memo[id]) {
      return;
    }

    const el = document.getElementById(id);
    if (!el) {
      throw Error(`element with id: ${id} is not found`);
    }
    this.memo[id] = {
      scroll: 0,
      el
    };
  }
}

export default PageStack;
