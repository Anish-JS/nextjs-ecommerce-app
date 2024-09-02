import { redirect } from "next/navigation";
import { db } from "../lib/db/prisma";
import { NextResponse } from "next/server";
import FormSubmitButton from "@/components/FormSubmitButton";

export const metadata = {
  title: "Add product - Shoemakers' Lane",
};

const addProduct = async (formdata: FormData) => {
  "use server";
  const name = formdata.get("name")?.toString();
  const description = formdata.get("description")?.toString();
  const imageUrl = formdata.get("imageUrl")?.toString();
  const price = Number(formdata.get("price") || 0);

  //   throw Error("Bazinga");

  if (!name || !description || !imageUrl || !price) {
    throw new Error("Missing required fields");
  }
  await db.product.create({
    data: { name, description, imageUrl, price },
  });
  redirect("/");
};

const AddProductPage = () => {
  return (
    <div>
      <h1 className="text-lg mb-3 font-bold">Add Product</h1>
      <form action={addProduct}>
        <input
          className="mb-3 w-full input input-bordered"
          required
          placeholder="Name"
          name="name"
        />
        <textarea
          name="description"
          placeholder="Description"
          className="textarea textarea-bordered mb-3 w-full"
        />
        <input
          className="mb-3 w-full input input-bordered"
          required
          type="url"
          placeholder="Image Url"
          name="imageUrl"
        />
        <input
          className="mb-3 w-full input input-bordered"
          required
          type="number"
          placeholder="Price"
          name="price"
        />
        <FormSubmitButton className="btn-block">Add product</FormSubmitButton>
      </form>
    </div>
  );
};

export default AddProductPage;
