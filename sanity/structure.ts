import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Singleton
      S.listItem()
        .title('Home Page')
        .id('homePage')
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
        ),

      S.divider(),

      S.documentTypeListItem("product"),
      S.documentTypeListItem("category"),
      S.documentTypeListItem("brand"),
      S.documentTypeListItem("collection"),
      S.documentTypeListItem("order"),
      S.documentTypeListItem("address"),
      S.documentTypeListItem("author"),
      S.documentTypeListItem("blogCategory"),
      S.documentTypeListItem("blog"),
      S.documentTypeListItem("audience"),
    ]);