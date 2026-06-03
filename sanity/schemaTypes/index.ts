import { audienceType } from "./audience";
import { brandType } from "./brand";
import { categoryType } from "./category";
import { collectionType } from "./collection";
import { productType } from "./product";
import { blogType } from "./blog";
import {
  authorType,
  blogCategoryType,
  orderType,
  addressType,
  reviewType,
} from "./others";
import { HeroSchema } from "./HeroSchema";
import { homePageType } from "./homePageType";

export const schemaTypes = [
  audienceType,
  brandType,
  collectionType,
  categoryType,
  authorType,
  blogCategoryType,
  productType, 
  blogType,
  orderType,
  addressType,
  reviewType,
  HeroSchema,
  homePageType,
];