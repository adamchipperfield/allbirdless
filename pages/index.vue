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
  async asyncData() {
    const client = await contentful.getEntries({
      'sys.id': '4o6g6OxJzcJP9bpvk2u1sW',
      include: 2,
    });

    console.log('Entries:', client.items[0].fields.content);

    return {
      entries: client.items[0].fields.content,
    }
  },
  computed: {
    getSections() {
      const sections = [];

      this.entries.forEach(async (entry) => {
        const entryId = entry.sys.contentType.sys.id;
        const componentName = entryId.charAt(0).toUpperCase() + entryId.slice(1);

        sections.push({
          component: () => import(`~/components/content/${componentName}.vue`),
          entry,
        });
      });

      return sections;
    },
  },
}
</script>