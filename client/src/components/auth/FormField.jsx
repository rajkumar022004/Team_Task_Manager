const FormField = ({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  autoComplete,
  icon,
  rightElement,
}) => {
  const hasError = touched && error;

  return (
    <div>
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`input ${icon ? 'pl-10' : ''} ${rightElement ? 'pr-12' : ''} ${
            hasError ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
          }`}
        />
        {rightElement && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {hasError && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;
