import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div>
      <div className="m-2">Page Not Found</div>
      <Link href="/" className=" m-2 btn btn-primary">
        Go Back
      </Link>
    </div>
  );
};

export default NotFoundPage;
