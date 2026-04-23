import { defineField, defineType } from "sanity";

export default defineType({
  name: "phaseBlock",
  title: "Fase del trabajo",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titulo de fase",
      type: "string",
      validation: (rule) => rule.required().max(80)
    }),
    defineField({
      name: "description",
      title: "Explicacion tecnica",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "images",
      title: "Imagenes de esta fase",
      type: "array",
      of: [{ type: "galleryImage" }],
      validation: (rule) => rule.required().min(1)
    })
  ],
  preview: {
    select: {
      title: "title",
      media: "images.0.image"
    }
  }
});
