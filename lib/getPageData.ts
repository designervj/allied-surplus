import { cache } from "react";
import { connectTenantDB } from "./db";
import { isHex } from "@/lib/utils";
import { ObjectId } from "mongodb";

function serialize(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

const tenantHeader = process.env.NEXT_PUBLIC_TENANT_ID;

export const getPageData = cache(async (slug: string) => {
  const db = await connectTenantDB();
  const page = await db.collection("pages").findOne({ slug });

  return serialize(page);
});

export const getSingleProduct = cache(async (id: string) => {
  const db = await connectTenantDB();
  const productColl = db.collection("products");

  const matchStage: any = {};
  if (isHex(id)) {
    matchStage._id = new ObjectId(id);
  } else {
    matchStage.slug = id;
  }

  const products = await productColl
    .aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "variants",
          localField: "_id",
          foreignField: "productId",
          as: "variants",
        },
      },
    ])
    .toArray();

  return serialize(products[0]);
});

export const getSingleForm = cache(async (id: string) => {
  const db = await connectTenantDB();
  const formColl = db.collection("forms");

  const form = await formColl.findOne({ _id: new ObjectId(id) });

  return serialize(form);
});

export const getTenantRegistry = cache(async () => {
  const db = await connectTenantDB();
  const tenantRegistry = db.collection("tenant_registry");

  const tenant = await tenantRegistry.findOne({ type: "branding" });

  return serialize(tenant);
});


export const getBusinessBlueprint = cache(async () => {
  try {
    const tenantRegistry = await fetch(
      "http://localhost:8000/platform/business-blueprint",
      {
        headers: {
          "x-tenant-db": tenantHeader || "",
        },
        credentials: "include",
      },
    );
    
    if (!tenantRegistry.ok) return null;
    
    const data = await tenantRegistry.json();
    return serialize(data.data);
  } catch (error) {
    console.error("Failed to fetch business blueprint:", error);
    return null;
  }
});
