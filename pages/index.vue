<template>
  <div>
    <component
      v-for="(section, index) in getSections"
      :key="index"
      :is="section.component"
      :entry="section.entry"
    >
    </component>
  </div>
</template>

<script>
import contentful from '../plugins/contentful';

export default {
  async asyncData({ store }) {
    const client = await contentful.getEntries({
      'sys.id': '4o6g6OxJzcJP9bpvk2u1sW',
      locale: store.state.i18n.locale,
      include: 2,
    });

    return {
      entries: client.items[0].fields.content,
    }
  },
  computed: {
    getSections() {
      const sections = [];

      this.entries.forEach((entry) => {
        const entryId = entry.sys.contentType.sys.id;
        const componentName = entryId.charAt(0).toUpperCase() + entryId.slice(1);

        sections.push({
          component: async () => await import(`@/components/content/${componentName}.vue`),
          entry,
        });
      });

      return sections;
    },
  },
  head() {
    return {
      title: 'The World’s Most Comfortable Shoes – Allbirds',
    }
  },
}
</script>