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
  historyMode: true,
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

    if (this.option.historyMode) {
      window.history.pushState({ psid: baseId }, '');
      window.onpopstate = ({ state }) => {
        if (state && state.psid) {
          this.to(state.psid, true);
        }
      };
    }
  }

  to(id, onPopState = false) {
    if (id === this.currentId) {
      return;
    }
    this.memoId(id);

    this.hide();
    this.show(id);

    if (this.option.historyMode && !onPopState) {
      window.history.pushState({ psid: id }, '');
    }
  }

  hide() {
    this.memo[this.currentId].scroll = scrollingElement.scrollTop;
    const { el } = this.memo[this.currentId];
    el.classList.remove(this.option.showClass);
    el.classList.add(this.option.hideClass);
  }

  show(id) {
    const { el } = this.memo[id];
    el.classList.remove(this.option.hideClass);
    el.classList.add(this.option.showClass);
    setTimeout(() => {
      scrollingElement.scrollTop = this.memo[id].scroll;
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
