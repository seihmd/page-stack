const defaultOption = {
  showClass: 'show'
};

// TODO should work without history
class PageStack {
  /**
   * @param {string} baseId
   * @param {Object} [option={}]
   */
  constructor(baseId, option = {}) {
    const baseEl = document.getElementById(baseId);
    if (!baseEl) {
      throw Error(`element with id: ${baseId} is not found`);
    }
    this.option = Object.assign(defaultOption, option);
    this.baseId = baseId;
    this.currentId = baseId;
    this.memo = {
      [baseId]: {
        scroll: 0,
        el: baseEl
      }
    };

    window.history.pushState({ id: this.baseId }, '');
    window.onpopstate = ({ state }) => {
      if (state && state.id) {
        this.push(state.id, false);
      }
    };
  }

  pushBase() {
    if (this.baseId === this.currentId) {
      return;
    }

    this.push(this.baseId);
  }

  push(id, pushHistory = true) {
    this.memoId(id);
    this.hide();
    this.show(id);
    if (pushHistory) {
      window.history.pushState({ id: this.currentId }, '');
    }
  }

  pop() {
    window.history.back();
  }

  hide() {
    this.memo[this.currentId].scroll = window.scrollY;
    this.toggle(this.currentId, false);
  }

  show(id) {
    this.toggle(id, true);
    // TODO 必要？
    // window.scrollTo(0, this.memo[id].scroll);
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
