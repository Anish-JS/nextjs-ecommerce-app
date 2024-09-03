"use client";
import { startTransition, useState, useTransition } from "react";
import { FaShoppingCart } from "react-icons/fa";

interface AddToCartButtonProps {
  productId: string;
  incrementProductQuantity: (productId: string) => Promise<void>;
}

const AddToCartButton = ({
  productId,
  incrementProductQuantity,
}: AddToCartButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <button
        className="btn btn-primary flex items-center justify-center"
        onClick={() => {
          setSuccess(false);
          startTransition(async () => {
            await incrementProductQuantity(productId);
            setSuccess(true);
          });
        }}
      >
        <div> Add To Cart </div>
        <FaShoppingCart className="text-xl font-extrabold" />
      </button>
      {isPending && (
        <span className="loading loading-spinner loading-md"></span>
      )}
      {!isPending && success && (
        <span className="text-success">Added to cart</span>
      )}
    </div>
  );
};

export default AddToCartButton;
