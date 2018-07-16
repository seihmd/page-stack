const defaultOption = {
  showClass: 'show',
  historyMode: true,
  baseId: ''
};

class PageStack {
  /**
   * @param {string} baseId
   * @param {Object} [option={}]
   */
  constructor(option = {}) {
    this.option = Object.assign(defaultOption, option);
    const { baseId } = this.option;
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
    this.memoId(id);
    this.hide();

    this.show(id);
  }

  hide() {
    this.memo[this.currentId].scroll = window.scrollY;
    this.toggle(this.currentId, false);
  }

  show(id) {
    this.toggle(id, true);
    window.scrollTo(0, this.memo[id].scroll);
    this.currentId = id;
  }

  toggle(id, toggleToShow) {
    const { el } = this.memo[id];
    el.classList.toggle(this.option.showClass, toggleToShow);
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
