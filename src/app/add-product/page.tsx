const AddProductPage = () => {
  return (
    <div>
      <h1 className="text-lg mb-3 font-bold">Add Product</h1>
      <form>
        <input
          className="mb-3 w-full input input-bordered"
          required
          placeholder="name"
          name="name"
        />
        <textarea
          name="description"
          placeholder="description"
          className="textarea textarea-bordered mb-3 w-full"
        ></textarea>
      </form>
    </div>
  );
};

export default AddProductPage;
