import React from 'react';
/**
 * Reusable button component with loading and full-width options.
 *
 * - Shows a spinning loader and "Loading..." text when loading
 * - Disables the button during loading state
 * - Can stretch to fill full width of container
 * - Supports all standard HTML button attributes
 *
 * @param {Object} props - Component props (extends React.ButtonHTMLAttributes)
 * @param {React.ReactNode} props.children - Button label or text
 * @param {boolean} [props.isLoading=false] - Shows loading spinner if true
 * @param {boolean} [props.fullWidth=false] - Makes button full width if true
 * @param {string} [props.className=''] - Additional CSS classes to apply
 * @param {boolean} [props.disabled=false] - Disables the button
 * @param {React.Ref} [props.ref] - Reference to the button element
 * @returns {React.ReactElement} A styled button component
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  fullWidth?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ref,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 px-6 py-3 text-lg';

  const widthStyle = fullWidth ? 'w-full' : '';

  const combinedClassName = `${baseStyles} ${widthStyle} ${className}`;

  return (
    <button ref={ref} className={combinedClassName} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
