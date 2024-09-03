"use client";

import { ShoppingCart } from "../lib/db/cart";
import { FaShoppingCart } from "react-icons/fa";
import { formatPrice } from "../lib/format";
import Link from "next/link";

interface ShoppingCartButtonProps {
  cart: ShoppingCart | null;
}

const ShoppingCartButton = ({ cart }: ShoppingCartButtonProps) => {
  const closeDropdown = () => {
    const ele = document.activeElement as HTMLElement;
    if (ele) {
      ele.blur();
    }
  };
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn-ghost btn-circle btn">
        <div className="indicator">
          <FaShoppingCart className="text-2xl font-extrabold" />
          <span className="badge badge-sm indicator-item">
            {cart?.size ?? 0}
          </span>
        </div>
      </label>
      <div
        tabIndex={0}
        className="card dropdown-content card-compact mt-3 w-52 bg-base-100 shadow z-30"
      >
        <div className="card-body">
          <span className="text-lg font-bold">{cart?.size || 0} Items</span>
          <span className="text-info">
            Subtotal: {formatPrice(cart?.subtotal || 0)}
          </span>
          <Link
            href="/"
            className="btn btn-primary btn-block"
            onClick={closeDropdown}
          >
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartButton;
