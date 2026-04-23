import { defineField, defineType } from "sanity";

export default defineType({
  name: "saxoProject",
  title: "Proyecto de saxo",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titulo",
      type: "string",
      validation: (rule) => rule.required().max(110)
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "publishedAt",
      title: "Fecha de publicacion",
      type: "datetime",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "workType",
      title: "Tipo de trabajo",
      type: "string",
      options: {
        list: [
          { title: "Restauracion", value: "Restauracion" },
          { title: "Ajuste y calibracion", value: "Ajuste y calibracion" },
          { title: "Puesta a punto", value: "Puesta a punto" },
          { title: "Personalizacion", value: "Personalizacion" }
        ]
      }
    }),
    defineField({
      name: "model",
      title: "Modelo de saxo",
      type: "string"
    }),
    defineField({
      name: "year",
      title: "Ano aproximado",
      type: "number"
    }),
    defineField({
      name: "ownerName",
      title: "Nombre de cliente",
      type: "string",
      description: "Opcional. Usa iniciales si prefieres privacidad."
    }),
    defineField({
      name: "excerpt",
      title: "Resumen",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(60).max(220)
    }),
    defineField({
      name: "coverImage",
      title: "Imagen principal",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
          validation: (rule) => rule.required().max(120)
        })
      ]
    }),
    defineField({
      name: "phases",
      title: "Fases del trabajo",
      type: "array",
      of: [{ type: "phaseBlock" }],
      validation: (rule) => rule.required().min(1)
    })
  ],
  orderings: [
    {
      title: "Mas recientes",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }]
    }
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "model",
      media: "coverImage"
    }
  }
});
