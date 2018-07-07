const defaultOption = {
  baseElement: 'main-content',
  showClass: 'show'
};

class PageStack {
  /**
   * @param {Object} [option={}]
   */
  constructor(option = {}) {
    this.option = Object.assign(defaultOption, option);
    this.stack = [this.option.baseElement];
  }

  pop() {
    if (this.stack.length === 1) {
      return;
    }
    const current = this.stack.pop();
    this.hide(current);
    this.show(this.stack[this.stack.length - 1]);
  }

  push(id) {
    const current = this.stack[this.stack.length - 1];
    if (current === id) {
      return;
    }
    this.stack.push(id);
    this.hide(current);
    this.show(id);
  }

  replace(id) {
    const current = this.stack[this.stack.length - 1];
    if (current === id) {
      return;
    }
    this.stack[this.stack.length - 1] = id;
    this.hide(current);
    this.show(id);
  }

  toggle(id, toggleToShow) {
    const target = window.document.getElementById(id);
    target.classList.toggle(this.option.showClass, toggleToShow);
  }

  hide(id) {
    if (typeof id === 'string') {
      this.toggle(id, false);
    }
  }

  show(id) {
    if (typeof id === 'string') {
      this.toggle(id, true);
    }
  }
}

export default PageStack;
