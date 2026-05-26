import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("product"),
      S.documentTypeListItem("category"),
      S.documentTypeListItem("brand"),
      S.documentTypeListItem("collection"),
      S.documentTypeListItem("order"),
      S.documentTypeListItem("address"),
      S.documentTypeListItem("author"),
      S.documentTypeListItem("blogCategory"), // ✅ FIXED
      S.documentTypeListItem("blog"),
      S.documentTypeListItem("audience"),
    ]);