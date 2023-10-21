type TextAreaProps = {
  id: string;
  name: string;
  value: string;
  rows: number;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
};

export default function TextArea({
  id,
  name,
  value,
  rows,
  onChange,
  placeholder,
}: TextAreaProps) {
  return (
    <textarea
      id={id}
      name={name}
      rows={rows}
      className="block outline-none w-full rounded-md border py-1.5 transition duration-100 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-outset focus:border focus:border-blue-400 focus:ring-blue-300 sm:text-sm sm:leading-6 bg-white hover:bg-gray-50 text-gray-500 border-gray-200"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}
