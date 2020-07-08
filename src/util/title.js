function getTitle (vm) {                             //get title of vm
  const { title } = vm.$options
  if (title) {
    return typeof title === 'function'              //if title === 'function' return title.call
      ? title.call(vm)
      : title                                       //else return title
  }
}

const serverTitleMixin = {                                 
  created () {
    const title = getTitle(this)
    if (title) {
      this.$ssrContext.title = `Vue HN 2.0 | ${title}`
    }
  }
}

const clientTitleMixin = {
  mounted () {
    const title = getTitle(this)
    if (title) {
      document.title = `Vue HN 2.0 | ${title}`
    }
  }
}

export default process.env.VUE_ENV === 'server'               //export serverTitleMixin or clientTitleMixin
  ? serverTitleMixin
  : clientTitleMixin
