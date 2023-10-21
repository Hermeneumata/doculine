export default function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium leading-6 text-gray-900"
    >
      {children}
    </label>
  );
}
