<template>
  <div>
    <section
      v-for="(section, index) in getSections"
      :key="index"
    >
      <component
        :is="section.component"
        :fields="section.fields"
      >
      </component>
    </section>
  </div>
</template>

<script>
import contentful from '../plugins/contentful';

export default {
  async asyncData() {
    const client = await contentful.getEntry('4o6g6OxJzcJP9bpvk2u1sW');

    return {
      entries: client.fields.content.map((item) => {
        return {
          id: item.sys.contentType.sys.id,
          fields: item.fields,
        }
      }),
    }
  },
  computed: {
    getSections() {
      const sections = [];

      this.entries.forEach(async (entry) => {
        const componentName = entry.id.charAt(0).toUpperCase() + entry.id.slice(1);

        sections.push({
          component: () => import(`~/components/content/${componentName}.vue`),
          fields: entry.fields,
        });
      });


      return sections;
    },
  },
}
</script>