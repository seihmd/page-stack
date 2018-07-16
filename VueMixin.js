const PageStackItem = {
  props: {
    psId: {
      type: String,
      required: true
    },
    psCurrent: ''
  },
  template: `<div
    v-if="psId === psCurrent"
    :class="{show: psId === psCurrent}"
    class="stackpage"><slot/></div>`
};

const PageStackMixin = {
  data: {
    psCurrent: ''
  },
  components: {
    PageStackItem
  }
};

export default PageStackMixin;
