export default function GlobalFooter() {
  return (
    <footer className="rounded-lg p-4 dark:bg-gray-900 md:px-6">
      <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
      <span className="block text-sm text-gray-500 dark:text-gray-400 sm:text-center">
        © 2022{" "}
        <a href={process.env.HOST} className="hover:underline">
          Mandos Estates™
        </a>
        . All Rights Reserved.
      </span>
    </footer>
  );
}
