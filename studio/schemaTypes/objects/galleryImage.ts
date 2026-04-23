import { defineField, defineType } from "sanity";

export default defineType({
  name: "galleryImage",
  title: "Imagen de galeria",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Imagen",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
          validation: (rule) => rule.required().max(120)
        }),
        defineField({
          name: "caption",
          title: "Pie de foto",
          type: "string",
          validation: (rule) => rule.max(180)
        })
      ]
    })
  ],
  preview: {
    select: {
      title: "image.caption",
      media: "image"
    },
    prepare({ title, media }) {
      return {
        title: title || "Imagen sin pie",
        media
      };
    }
  }
});
