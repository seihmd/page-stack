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
  showClass: 'sv-show',
  hideClass: 'sv-hide'
};

class ShiftView {
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

  to(id, showScrollTop = false, onPopState = false) {
    if (id === this.currentId) {
      return;
    }
    this.memoId(id);

    this.hide();
    this.show(id, showScrollTop);

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

  show(id, showScrollTop) {
    const { el } = this.memo[id];
    el.classList.remove(this.option.hideClass);
    el.classList.add(this.option.showClass);

    if (!showScrollTop) {
      el.style.visibility = 'hidden';
      setTimeout(() => {
        scrollingElement.scrollTop = this.memo[id].scroll;
        el.style.visibility = 'visible';
      }, 0);
    }

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

const ShiftViewComponent = {
  props: {
    svId: {
      type: String,
      required: true
    },
    svCurrent: {
      type: String,
      required: true
    }
  },
  computed: {
    isCurrent() {
      return this.svId === this.svCurrent;
    }
  },
  template: `
  <div
    :id="svId"
    :class="{'sv-hide': !isCurrent, 'sv-show': isCurrent}">
    <template v-if="isCurrent"><slot/></template>
  </div>`
};

const ShiftViewMixin = {
  data: {
    baseId: 'page1',
    svCurrent: '',
    shiftView: null
  },
  components: {
    'shift-view': ShiftViewComponent
  },
  watch: {
    svCurrent() {
      this.shiftView.to(this.svCurrent);
    }
  },
  mounted() {
    this.svCurrent = this.baseId;
    this.shiftView = new ShiftView(this.baseId);
  },
  methods: {
    to(id) {
      this.svCurrent = id;
      this.shiftView.to(id);
    },
    toScrollTop(id) {
      this.svCurrent = id;
      this.shiftView.to(id, true);
    },
    toBase() {
      this.svCurrent = this.baseId;
    }
  }
};

export default ShiftViewMixin;
