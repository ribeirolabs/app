import Link from "next/link";

export const GenericError = () => {
  return (
    <div className="w-content text-center">
      <h1>Something went wrong!</h1>

      <Link href="/">
        <a className="btn btn-secondary">Back to homepage</a>
      </Link>
    </div>
  );
};

export const ForbiddenError = ({ resource }: { resource: string }) => {
  return (
    <div className="w-content text-center">
      <h1>Hold on!</h1>
      <h2>You do not have access to this {resource}.</h2>

      <Link href="/">
        <a className="btn btn-secondary">Back to homepage</a>
      </Link>
    </div>
  );
};
