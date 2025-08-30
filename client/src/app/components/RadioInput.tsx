type RadioInputProps = {
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  options: string[];
};

export const RadioInput: React.FC<RadioInputProps> = ({
  name,
  value,
  onChange,
  error,
  required = true,
  options,
}) => {
  return (
    <div
      className={`flex flex-col justify-start items-start my-1 w-full relative rounded-lg  `}
    >
      {options.map((opt) => (
        <label key={opt} className="flex capitalize items-center gap-3 my-2">
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={onChange}
            required={required}
            className="w-5 h-5"
          />
          {opt}
        </label>
      ))}
      {error && <p className="text-red-500  ">{error}</p>}
    </div>
  );
};
