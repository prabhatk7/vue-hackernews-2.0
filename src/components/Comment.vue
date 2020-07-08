<template>                                                                                //template contains tags and components
  <li v-if="comment" class="comment">                                                     //conditional class allocation
    <div class="by">
      <router-link :to="'/user/' + comment.by">{{ comment.by }}</router-link>                 //link that will take us to the user who commented
      {{ comment.time | timeAgo }} ago                                                    //time passed since user commented
    </div>
    <div class="text" v-html="comment.text"></div>                                           //comment text is put dynamically
    <div class="toggle" :class="{ open }" v-if="comment.kids && comment.kids.length">      //if comment.kids && comment.kids.length them class="open"
      <a @click="open = !open">{{                                                          //on click toggle the 'open' state
        open
            ? '[-]'                                                                       //if open put [-] else........
            : '[+] ' + pluralize(comment.kids.length) + ' collapsed'
      }}</a>
    </div>
    <ul class="comment-children" v-show="open">                                   //unordered list
      <comment v-for="id in comment.kids" :key="id" :id="id"></comment>            //for every id in comment.kids list the comment
    </ul>
  </li>
</template>

<script>                                                           //js starts here
export default {                                                  //export this component with name comment
  name: 'comment',
  props: ['id'],                                                  //props received by component
  data () {                                                        //data method same as state
    return {
      open: true
    }
  },
  computed: {                                                    //compputed has a comment method
    comment () {
      return this.$store.state.items[this.id]
    }
  },
  methods: {                                                     //methods used in this component (just like Handlers)
    pluralize: n => n + (n === 1 ? ' reply' : ' replies')
  }
}
</script>

<style lang="stylus">                                                //CSS starts here
.comment-children
  .comment-children
    margin-left 1.5em

.comment
  border-top 1px solid #eee
  position relative
  .by, .text, .toggle
    font-size .9em
    margin 1em 0
  .by
    color #828282
    a
      color #828282
      text-decoration underline
  .text
    overflow-wrap break-word
    a:hover
      color #ff6600
    pre
      white-space pre-wrap
  .toggle
    background-color #fffbf2
    padding .3em .5em
    border-radius 4px
    a
      color #828282
      cursor pointer
    &.open
      padding 0
      background-color transparent
      margin-bottom -0.5em
</style>
